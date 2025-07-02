const blocked = async (req, res, next) => {
  const { email } = req.body; 
  
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { isBlocked: true }
    });

    if (user && user.isBlocked) {
      return res.status(403).json({ message: 'You have been blocked =(' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: "Blocked check failed", error: err.message });
  }
}

module.exports = blocked;