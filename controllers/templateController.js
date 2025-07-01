const prisma = require("../prisma/prismaClient");
const cloudinary = require("cloudinary").v2;

exports.getAllTemplates = async (req, res) => {
  try {
    if (req.session.user && req.session.user.role !== "guest") {
      const userId = req.session.user.id;
      const templates = await prisma.template.findMany({
        where: { authorId: userId },
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });
      return res.status(200).json({
        message: "All templates fetch successful",
        templates: templates,
      });
    } else {
      return res
        .status(401)
        .json({ message: "Unauthorized on fetching templates" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error during fetching all templates",
      error: err.message,
    });
  }
};

exports.createTemplate = async (req, res) => {
  try {
    if (req.session.user && req.session.user.role !== "guest") {
      const authorId = req.session.user.id;
      const { title, description, access } = req.body;
      let { topic, tags, questions, allowedUsers } = req.body;

      if (typeof tags === "string") tags = JSON.parse(tags);
      if (typeof questions === "string") questions = JSON.parse(questions);
      if (typeof allowedUsers === "string")
        allowedUsers = JSON.parse(allowedUsers);

      if (!Array.isArray(tags)) tags = [];
      if (!Array.isArray(questions)) questions = [];
      if (!Array.isArray(allowedUsers)) allowedUsers = [];

      let imageUrl =
        "https://res.cloudinary.com/dupcshdti/image/upload/v1750362614/template_default_img_doyzwe.jpg";
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "templates",
        });
        imageUrl = result.secure_url;
      }

      const template = await prisma.template.create({
        data: {
          title,
          description,
          topic,
          access,
          authorId,
          imageUrl,
          ...(access === "private" && {
            allowedUsers: {
              connect: allowedUsers.map((id) => ({ id })),
            },
          }),
          questions: {
            create: questions?.map((q) => ({
              type: q.type,
              title: q.title,
              description: q.description,
              showInTable: q.showInTable,
              enabled: q.enabled,
              order: q.order,
            })),
          },
          tags: {
            create: tags?.map((tagObj) => ({
              tag: {
                connectOrCreate: {
                  where: { name: tagObj.tag.name },
                  create: { name: tagObj.tag.name },
                },
              },
            })),
          },
        },
        include: {
          tags: { include: { tag: true } },
          questions: true,
          allowedUsers: true,
        },
      });

      return res
        .status(201)
        .json({ message: "Template created successfully", template });
    } else {
      return res
        .status(401)
        .json({ message: "Unauthorized on creating template" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error during template creation", error: err.message });
  }
};

exports.getLatestTemplates = async (req, res) => {
  try {
    const templates = await prisma.template.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        tags: { include: { tag: true } },
        questions: true,
        author: true,
      },
    });
    return res
      .status(200)
      .json({ message: "Latest templates fetched", templates });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server error on fetching latest", error: err.message });
  }
};

exports.deleteTemplates = async (req, res) => {
  try {
    const { templateIds } = req.body;
    if (
      !Array.isArray(templateIds) ||
      templateIds.length === 0 ||
      req.session.user.role === "guest"
    ) {
      return res
        .status(400)
        .json({ message: "No templates selected for deletion" });
    }

    const templates = await prisma.template.findMany({
      where: { id: { in: templateIds } },
      select: { imageUrl: true },
    });

    for (const template of templates) {
      if (
        template.imageUrl &&
        template.imageUrl.includes("cloudinary") &&
        !template.imageUrl.includes("template_default_img")
      ) {
        const parts = template.imageUrl.split("/");
        const fileWithExt = parts[parts.length - 1];
        const folder = parts[parts.length - 2];
        const publicId = `${folder}/${fileWithExt.split(".")[0]}`;

        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (cloudErr) {
          console.warn(
            `Cloudinary deletion failed for ${publicId}:`,
            cloudErr.message
          );
        }
      }
    }
    await prisma.template.deleteMany({
      where: { id: { in: templateIds } },
    });
    return res.status(200).json({ message: "Templates deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting templates", error: err.message });
  }
};

exports.getTemplateById = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const template = await prisma.template.findUnique({
      where: { id: id },
      include: {
        tags: { include: { tag: true } },
        questions: true,
        author: true,
        allowedUsers: true,
        comments: { 
          include: {
            author: { select: { id: true, name: true }}
          }},
        likes: true 

      },
    });
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }
    return res.status(200).json({ message: "Template found", template });
    return res
      .status(401)
      .json({ message: "Unauthorized on fetching template" });
  } catch (err) {
    console.error("error during template fetch", err);
    res
      .status(500)
      .json({ message: "Error fetching template", error: err.message });
  }
};

exports.updateTemplate = async (req, res) => {
  try {
    if (req.session.user && req.session.user.role !== "guest") {
      let { title, description, topic, tags, questions } = req.body;

      if (typeof tags === "string") tags = JSON.parse(tags);
      if (typeof questions === "string") questions = JSON.parse(questions);

      if (!Array.isArray(tags)) tags = [];
      if (!Array.isArray(questions)) questions = [];

      const currentTemplate = await prisma.template.findUnique({
        where: { id: Number(req.params.id) },
        select: { imageUrl: true },
      });

      let imageUrl = currentTemplate.imageUrl;

      if (req.file) {
        if (
          imageUrl &&
          imageUrl.includes("cloudinary") &&
          !imageUrl.includes("template_default_img")
        ) {
          try {
            const parts = imageUrl.split("/");
            const fileWithExt = parts[parts.length - 1];
            const folder = parts[parts.length - 2];
            const publicId = `${folder}/${fileWithExt.split(".")[0]}`;
            await cloudinary.uploader.destroy(publicId);
          } catch (cloudErr) {
            console.warn(
              `Cloudinary deletion failed for ${imageUrl}:`,
              cloudErr.message
            );
          }
        }
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "templates",
        });
        imageUrl = result.secure_url;
      }

      const updatedTemplate = await prisma.template.update({
        where: { id: Number(req.params.id) },
        data: {
          title,
          description,
          topic,
          imageUrl,
          updatedAt: new Date(),
          questions: {
            deleteMany: {},
            create: questions.map((q) => ({
              type: q.type,
              title: q.title,
              description: q.description,
              showInTable: q.showInTable,
              enabled: q.enabled,
              order: q.order,
            })),
          },
          tags: {
            deleteMany: {},
            create: tags.map((tagObj) => ({
              tag: {
                connectOrCreate: {
                  where: { name: tagObj.tag?.name || tagObj.name },
                  create: { name: tagObj.tag?.name || tagObj.name },
                },
              },
            })),
          },
        },
        include: { tags: { include: { tag: true } }, questions: true },
      });
      return res.status(200).json({
        message: "Template updated successfully",
        template: updatedTemplate,
      });
    } else {
      return res
        .status(401)
        .json({ message: "Unauthorized on updating template" });
    }
  } catch (err) {
    console.error("Update error:", err);
    res
      .status(500)
      .json({ message: "Error when updating template", error: err.message });
  }
};

exports.searchTemplates = async (req, res) => {
  const { q } = req.query;

  if (!q || q.length < 1) {
    return res.json([]);
  }

  try {
    const templates = await prisma.template.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          {
            questions: {
              some: { description: { contains: q, mode: "insensitive" } },
            },
          },
          { comments: { some: { value: { contains: q, mode: 'insensitive' } } } },
        ],
      },
      include: {
        questions: true,
        comments: true,
      },
    });
    res.json(templates);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error when searching templates", error: err.message });
  }
};
