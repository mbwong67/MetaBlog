const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { validationResult } = require("express-validator");

const User = require("../models/user");

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      const error = new Error("User Already Exists");
      error.httpStatusCode = 305;
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();
    return res.status(200).json({ message: "User Created Successfully!" });
  } catch (err) {
    console.log(err);
    const error = new Error("Please try again later!");
    error.httpStatusCode = 500;
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    // Login Logic
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("User not found");
      error.httpStatusCode = 404;
      return next(error);
    }

    const doMatch = await bcrypt.compare(password, user.password);

    if (!doMatch) {
      const error = new Error("Invalid Credentials");
      error.message = "Incorrect Password";
      error.httpStatusCode = 401;
      return next(error);
    }

    const token = jwt.sign(
      { email: user.email, userId: user._id.toString() },
      process.env.JWT_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ token, userId: user._id.toString() });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    next(err);
  }
};
