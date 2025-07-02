const adminAuth = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized access" });
  }
};

module.exports = adminAuth;