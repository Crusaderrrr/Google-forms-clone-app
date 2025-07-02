const prisma = require("../prisma/prismaClient");
const bcrypt = require("bcryptjs");

exports.getUserInfo = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const userInfo = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        templates: true,
        forms: {
          include: {
            template: true,
          },
        },
      },
    });
    res.status(200).json(userInfo);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error during fetching user info", error: err.message });
  }
};

exports.getMe = async (req, res) => {
  if (req.session && req.session.user && req.session.user.role === "guest") {
    res.status(200).json({
      user: {
        isAdmin: false,
        isBlocked: false,
        role: "guest",
      },
    });
  } else if (
    req.session &&
    req.session.user &&
    req.session.user.role !== "guest"
  ) {
    const role =
      req.session.isAdmin === true
        ? "admin"
        : req.session.user.email.length > 0
        ? "user"
        : "guest";
    res.status(200).json({
      user: {
        id: req.session.user.id,
        name: req.session.user.name,
        email: req.session.user.email,
        isAdmin: req.session.user.isAdmin,
        isBlocked: req.session.user.isBlocked,
        role: role,
      },
    });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: `User doesn't exist` });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      role: "user",
    };

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: req.session.user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error during login", error: err.message });
  }
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    } else {
      const user = await prisma.user.create({
        data: {
          name: name,
          email: email,
          password: await bcrypt.hash(password, 10),
        },
      });

      req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: false,
        isBlocked: false,
        role: "user",
      };

      return res.status(201).json({
        message: "Signup successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          isBlocked: user.isBlocked,
          role: "user",
        },
      });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error during signup", error: err.message });
  }
};

exports.guest = async (req, res) => {
  try {
    const guestState = req.body;
    if (guestState) {
      req.session.user = { role: "guest" };
    }
    return res.status(200).json({
      message: "Entry as guest successful",
      role: req.session.user.role,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error during guest post request", error: err.message });
  }
};

exports.searchUsers = async (req, res) => {
  const { q, searchType } = req.query;

  if (!q || q.length < 2) {
    return res.json([]);
  }

  let where = {};
  if (searchType === "name") {
    where = { name: { contains: q, mode: "insensitive" } };
  } else if (searchType === "email") {
    where = { email: { contains: q, mode: "insensitive" } };
  }

  try {
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
      },
      take: 5,
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "User search failed", details: err.message });
  }
};

async function fetchAllUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      isBlocked: true,
      isAdmin: true,
    },
  });
}

exports.getAllUsers = async (req, res) => {
  try {
    const users = await fetchAllUsers();
    res.status(200).json({ message: "Users fetch successful", users });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Users search failed", error: err.message });
  }
};

exports.makeAdmin = async (req, res) => {
  try {
    const ids = req.body.ids;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Invalid user IDs" });
    }

    await prisma.user.updateMany({
      where: { id: { in: ids } },
      data: {
        isAdmin: true,
      },
    });

    const updatedUsers = await fetchAllUsers();
    res
      .status(200)
      .json({ message: "Admins set successfully", users: updatedUsers });
  } catch (err) {
    res.status(500).json({ message: "Admin set failed", error: err.message });
  }
};

exports.removeAdmin = async (req, res) => {
  try {
    const ids = req.body.ids;
    const userId = req.body.userId;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Invalid user IDs" });
    }

    await prisma.user.updateMany({
      where: { id: { in: ids } },
      data: {
        isAdmin: false,
      },
    });

    if (ids.includes(userId)) {
      req.session.user.isAdmin = false;
    }

    const updatedUsers = await fetchAllUsers();
    res
      .status(200)
      .json({ message: "Admins removed successfully", users: updatedUsers });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Admin remove failed", error: err.message });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const ids = req.body.ids;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Invalid user IDs" });
    }

    await prisma.user.updateMany({
      where: { id: { in: ids } },
      data: {
        isBlocked: true,
      },
    });

    const updatedUsers = await fetchAllUsers();
    res
      .status(200)
      .json({ message: "Blocked users successfully", users: updatedUsers });
  } catch (err) {
    res.status(500).json({ message: "Block users failed", error: err.message });
  }
};

exports.unblockUser = async (req, res) => {
  try {
    const ids = req.body.ids;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Invalid user IDs" });
    }

    await prisma.user.updateMany({
      where: { id: { in: ids } },
      data: {
        isBlocked: false,
      },
    });

    const updatedUsers = await fetchAllUsers();
    res
      .status(200)
      .json({ message: "Unblocked users successfully", users: updatedUsers });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Unblock users failed", error: err.message });
  }
};

exports.deleteUsers = async (req, res) => {
  try {
    const ids = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Invalid user IDs" });
    }

    await prisma.user.deleteMany({
      where: { id: { in: ids } },
    });

    const updatedUsers = await fetchAllUsers();
    res
      .status(200)
      .json({ message: "Deleted users successfully", users: updatedUsers });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Delete users failed", error: err.message });
  }
};
