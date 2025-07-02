const prisma = require("../prisma/prismaClient");

exports.submitLike = async (req, res) => {
  try {
    const { templateId } = req.body;
    const authorId = req.session.user.id;

    if (!authorId && req.session.role === "guest") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const existingLike = await prisma.like.findFirst({
      where: { templateId, authorId },
    });
    if (existingLike) {
      return res.status(400).json({ error: "Already liked" });
    }

    const like = await prisma.like.create({
      data: {
        templateId: templateId,
        authorId: authorId,
      },
      include: {
        author: { select: { id: true } },
        template: { select: { id: true } },
      },
    });
    res.status(200).json(like);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error submitting like", error: err.message });
  }
};

exports.deleteLike = async (req, res) => {
  try {
    const { templateId } = req.body;
    const authorId = req.session.user.id;
    if (!authorId && req.session.role === "guest") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await prisma.like.deleteMany({
      where: {
        templateId: Number(templateId),
        authorId: Number(authorId),
      },
    });

    res.status(200).json({ message: "Like removed" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting like", error: err.message });
  }
};
