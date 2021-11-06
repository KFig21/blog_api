const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const AdminSchema = new Schema({
  username: { required: true, type: String },
  password: { required: true, type: String },
});

AdminSchema.pre("save", async function (next) {
  console.log("test");
  const hash = await bcrypt.hash(this.password, 10);

  this.password = hash;
  next();
});

AdminSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
