const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

//Import model
const User = require("../../models/User");

//@route   GET api/auth
//@desc    Test route
//@access  Public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
}); //adding auth makes route protected

//@route   POST api/auth
//@desc    Authenticate user & get token
//@access  Public
router.post(
  "/",
  [
    check("email", "Please provide valid email").isEmail(),
    check("password", "Please enter a password").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      //see if user exists
      let user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ errors: [{ msg: "invalid credentials" }] });
      }

      //match user email and password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: "invalid credentials" }] });
      }
      //return jsonwebtoken
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(payload, config.get("jwtToken"), { expiresIn: 36000 }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("server error");
    }
  }
);

module.exports = router;
