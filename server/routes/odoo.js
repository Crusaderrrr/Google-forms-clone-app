const express = require("express");
const router = express.Router();
const jwtMiddleware = require("../middleware/jwtMiddleware");

router.get("/get-templates", jwtMiddleware, async (req, res) => {
  console.log("External api reached");
  try {
    const userId = req.user.userId;

    const userTemplates = await prisma.template.findMany({
      where: { authorId: userId },
      select: {
        id: true,
        title: true,
        author: {
          select: { name: true }, 
        },
        questions: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
      },
    });

    const finalResponseData = await Promise.all(
      userTemplates.map(async (template) => {
        const aggregatedQuestions = await Promise.all(
          template.questions.map(async (question) => {
            let aggregatedResult = {};
            let answerCount = 0;

            if (question.type === "integer") {
              const answers = await prisma.answer.findMany({
                where: { questionId: question.id },
                select: { value: true },
              });

              const numericValues = answers
                .map((a) => parseFloat(a.value))
                .filter((n) => !isNaN(n));

              answerCount = numericValues.length;
              if (answerCount > 0) {
                aggregatedResult = {
                  average:
                    numericValues.reduce((a, b) => a + b, 0) / answerCount,
                  min: Math.min(...numericValues),
                  max: Math.max(...numericValues),
                };
              }
            } else if (
              ["singleLine", "multiLine", "checkbox"].includes(question.type)
            ) {
              const popularAnswers = await prisma.answer.groupBy({
                by: ["value"],
                where: { questionId: question.id },
                _count: { value: true },
                orderBy: { _count: { value: "desc" } },
                take: 5,
              });

              answerCount = await prisma.answer.count({
                where: { questionId: question.id },
              });

              aggregatedResult = {
                most_popular: popularAnswers.map((item) => ({
                  answer: item.value,
                  count: item._count.value,
                })),
              };
            }

            return {
              question_text: question.title,
              question_type: question.type,
              answer_count: answerCount,
              aggregated_result: aggregatedResult,
            };
          })
        );

        return {
          author_name: template.author?.name || "N/A",
          template_title: template.title,
          template_id_external: template.id,
          questions: aggregatedQuestions,
        };
      })
    );

    res.status(200).json({ data: finalResponseData });
  } catch (err) {
    console.error("API Aggregation Error:", err);
    res
      .status(500)
      .json({
        message: "Error fetching aggregated results",
        error: err.message,
      });
  }
});

module.exports = router;
