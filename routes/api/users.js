const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");

//@route   POST api/users
//@desc    Resgister a user
//@access  Public
router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please provide valid email").isEmail(),
    check("password", "Please enter a password 6 or more characters").isLength({ min: 6 })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.send("User route");
  }
);

module.exports = router;
