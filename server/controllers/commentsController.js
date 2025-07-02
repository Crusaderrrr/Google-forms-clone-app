const prisma = require("../prisma/prismaClient");

exports.submitComments = async (req, res) => {
  try {
    const { value, templateId } = req.body;
    const authorId = req.session.user.id;

    if (!authorId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const comment = await prisma.comment.create({
      data: {
        value,
        templateId: Number(templateId),
        authorId: Number(authorId),
      },
      include: {
        author: { select: { id: true, name: true } },
      },
    });

    res.status(201).json(comment);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to add comment", details: err.message });
  }
};
