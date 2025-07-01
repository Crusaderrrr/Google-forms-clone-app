const sessionAuth = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role !== 'guest') {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized access" });
  }
};

module.exports = sessionAuth;