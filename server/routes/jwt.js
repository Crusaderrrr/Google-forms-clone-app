const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.get("/create", async (req, res) => {
  try {
    const secretKey = process.env.JWT_SECRET_KEY;
    const userPayload = {
      userId: req.session.user.id,
    };

    const token = jwt.sign(userPayload, secretKey, { expiresIn: "1h" });

    res.status(201).json({ message: "JWT creation successful", token });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error when creating a JWT", error: err.message });
  }
});

module.exports = router;
