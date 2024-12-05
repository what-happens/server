const { validationResult } = require("express-validator");
const admin = require("firebase-admin");

const createUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    //req에서 에러가 있을 경우
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password, name } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });
    res.status(201).json({ message: "User created", user: userRecord });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error create user", error: error.message });
  }
};

module.exports = { createUser };
