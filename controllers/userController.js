const prisma = require('../prisma/prismaClient')
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: `User doesn't exist`});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({message: 'Invalid Password'})
    }

    req.session.user = {
      id: user.id, 
      name: user.name, 
      email: user.email,
      isAdmin: user.isAdmin,
      role: 'user'
    };

    res.status(200).json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin, role: req.session.user.role}});
  } catch (err) {
    res.status(500).json({ message: 'Error during login', error: err.message });
  }
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email: email } });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    } else {
      const user = await prisma.user.create({
        data: { name: name, email: email, password: await bcrypt.hash(password, 10) }
      });

      req.session.user = { id: user.id, name: user.name, email: user.email };

      return res.status(201).json({ message: 'Signup successful', user: { id: user.id, name: user.name, email: user.email } });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error during signup', error: err.message });
  }
};

exports.guest = async (req, res) => {
  try {
    const guestState = req.body;
    if (guestState) {
      req.session.user = {role: 'guest'}
    }
    return res.status(200).json({ message: 'Entry as guest successful', role: req.session.user.role})
  } catch (err) {
    res.status(500).json({ message: 'Error during guest post request', error: err.message })
  }
}