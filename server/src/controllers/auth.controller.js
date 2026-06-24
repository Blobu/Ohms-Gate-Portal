const {
  registerUser,
  loginUser,
} = require('../services/auth.service');

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    const result = await registerUser({
      firstName,
      lastName,
      email,
      password,
    });

    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    const result = await loginUser({
      email,
      password,
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
};