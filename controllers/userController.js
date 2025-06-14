const prisma = require('../prisma/prismaClient')
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({message: 'Invalid Password'})
    }

    res.status(200).json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Error during login', error: err.message });
  }
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email: email } });

    if (existingUser) {
      res.status(409).json({ message: 'User already exists' });
    } else {
      const user = await prisma.user.create({
        data: { name: name, email: email, password: await bcrypt.hash(password, 10) }
      });
      res.status(201).json({ message: 'Signup successful', user: { id: user.id, name: user.name, email: user.email } });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error during signup', error: err.message });
  }
};