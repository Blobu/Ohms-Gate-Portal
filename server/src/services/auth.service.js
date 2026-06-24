const fs = require('fs/promises');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const usersFilePath = path.join(__dirname, '../data/users.json');

const readUsers = async () => {
  const data = await fs.readFile(usersFilePath, 'utf-8');
  return JSON.parse(data);
};

const writeUsers = async (users) => {
  await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
};

const generateToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

const registerUser = async ({ firstName, lastName, email, password }) => {
  const users = await readUsers();

  const existingUser = users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );

  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = {
    id: String(users.length + 1),
    firstName,
    lastName,
    email,
    passwordHash,
    role: 'Teacher',
  };

  users.push(newUser);
  await writeUsers(users);

  const accessToken = generateToken(newUser);

  return {
    accessToken,
    user: {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: newUser.role,
    },
  };
};

const loginUser = async ({ email, password }) => {
  const users = await readUsers();

  const user = users.find(
    (candidate) => candidate.email.toLowerCase() === email.toLowerCase()
  );

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const accessToken = generateToken(user);

  return {
    accessToken,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  };
};

module.exports = {
  registerUser,
  loginUser,
};