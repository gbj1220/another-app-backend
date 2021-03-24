var express = require("express");
var router = express.Router();
var {
  signUp,
  login,
  updateUserPassword,
} = require("./controller/userController");

var {
  checkIfEmptyMiddleware,
  checkForSymbolMiddleware,
  checkLoginIsEmpty,
} = require("../lib/validator");

router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post(
  "/sign-up",
  checkIfEmptyMiddleware,
  checkForSymbolMiddleware,
  signUp
);

router.post("/login", checkLoginIsEmpty, login);

router.put("/update-user-password", updateUserPassword);

module.exports = router;