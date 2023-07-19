const jwt = require("jsonwebtoken");

const authModel = require("../models/AuthModel");

class authController {
  getAll(req, res, next) {
    authModel.find({}).then((account) => {
      res.json(account);
    });
  }

  // handle login
  login(req, res, next) {
    const { username, password } = req.body;
    authModel
      .findOne({ username, password })
      .then((account) => {
        if (!account) {
          return res
            .status(404)
            .json({ message: "Invalid username or password" });
        } else {
          var token = jwt.sign({ _id: account._id }, "pets");
          return res.json({
            message: "Login is success",
            data: account,
            token: token,
            role: account.role,
          });
        }
      })
      .catch((err) => {
        res.status(404).json({ err });
      });
  }

  // handle register
  register(req, res, next) {
    req.body.role = 1;
    const account = new authModel(req.body);
    account
      .save()
      .then((account) => {
        res.status(201).json({ data: account });
      })
      .catch(next);
  }
}

module.exports = new authController();