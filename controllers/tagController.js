const prisma = require("../prisma/prismaClient");

exports.searchTags = async (req, res) => {
  const { q } = req.query;

  if (!q || q.length < 1) {
    return res.json([]);
  }

  try {
    const tags = await prisma.tag.findMany({
      where: {
        name: {
          startsWith: q,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
      },
      take: 10,
    });
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: "Tag search failed", details: err.message });
  }
};

exports.getAllTags = async (req, res) => {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    });
    res.status(200).json({ message: "All tags fetched successfully", tags });
  } catch (err) {
    res.status(500).json({ error: "Tag search failed", details: err.message });
  }
};
