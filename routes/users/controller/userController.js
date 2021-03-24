const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../Model/User");
const mongoDBErrorHelper = require("../../lib/mongoDBErrorHelper");

module.exports = {
  signUp: async (req, res) => {
    try {
      let salted = await bcrypt.genSalt(10);
      let hashedPassword = await bcrypt.hash(req.body.password, salted);

      const { firstName, lastName, email } = req.body;

      let createdUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      let savedUser = await createdUser.save();

      res.json({
        data: savedUser,
      });
    } catch (e) {
      res.status(500).json(mongoDBErrorHelper(e));
    }
  },

  login: async (req, res) => {
    try {
      let findTheUser = await User.findOne({ email: req.body.email });

      if (!findTheUser) {
        throw { Message: "Register your email!" };
      }

      let comparedPassword = await bcrypt.compare(
        req.body.password,
        findTheUser.password
      );

      if (!comparedPassword) {
        throw {
          Message: "Please check that your email and password are correct.",
        };
      } else {
        let jwtToken = jwt.sign(
          {
            email: findTheUser.email,
          },
          "notSoMightyAfterAll",
          { expiresIn: "48h" }
        );

        res.json({
          jwtToken: jwtToken,
        });
      }
    } catch (e) {
      console.log(e.message);
      res.status(500).json(mongoDBErrorHelper(e));
    }
  },

  updateUserPassword: async (req, res) => {
    try {
      let findTheUser = await User.findOne({ email: req.body.email });

      let comparedPassword = await bcrypt.compare(
        req.body.oldPassword,
        findTheUser.password
      );

      if (!comparedPassword) {
        throw {
          Message:
            "Either your email or password is invalid. Please try again.",
        };
      }

      let salted = await bcrypt.genSalt(10);
      let hashedNewPassword = await bcrypt.hash(req.body.newPassword, salted);

      await User.findOneAndUpdate(
        { email: req.body.email },
        { password: hashedNewPassword },
        { new: true }
      );

      res.json({
        message: "We did it!",
        payload: true,
      });
    } catch (e) {
      res.status(500).json(mongoDBErrorHelper(e));
    }
  },
};
