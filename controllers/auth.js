const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../models/user");

const { HttpError, ctrlWrapper } = require("../helpers");

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    throw HttpError(409, "User already exist");
  }

  const hashPassword = await bcrypt.hash(req.body.password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });
  const { name, email, _id } = newUser;
  res.status(201).json({ _id, name, email });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  const isCorrectPassword = await bcrypt.compare(password, user?.password);

  if (!isCorrectPassword || !user) {
    throw HttpError(401, "Incorrect email or password");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({ token });
};

const logout = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({ message: "Logout success" });
};

const getCurrent = async (req, res) => {
  res.json(req.user);
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
};
