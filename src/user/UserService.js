const bcrypt = require("bcrypt");
const User = require("./User");

const save = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await User.create({ ...data, password: hashedPassword });
  return user;
};

const getOne = async (params) => {
  const user = await User.findOne({ where: params });
  return user;
};

module.exports = {
  save,
  getOne,
};
