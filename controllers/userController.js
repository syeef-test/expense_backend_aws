const mongoUserService = require("../services/mongoUserService");

const { validationResult } = require("express-validator");

exports.postSignup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name ,Email and Password are required" });
    }

    const user = await mongoUserService.createUser(req.body);
    if (user) {
      res.status(201).json({ message: "Sign Up Succesful", success: true });
    } else {
      res.status(401).json({
        message: "User Allready Exist with same email",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// exports.generateAccessToken = (id, name, ispremiuemuser) => {
//   //console.log(id,name,ispremiuemuser);
//   return jwt.sign({ userId: id, name: name, ispremiuemuser: ispremiuemuser }, process.env.TOKEN_SECRET);
// };

exports.postLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username && !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const user = await mongoUserService.loginUser(req.body);
    if (user) {
      if (user.success) {
        res.status(200).json(user);
      } else {
        res.status(401).json(user);
      }
    } else {
      res.status(404).json({ message: "User Does not exist", success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
