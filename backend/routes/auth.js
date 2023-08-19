const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'kanishkisgoodboy'
//create a user using POST "/api/auth/createuser". doesnt require auth / no login required
router.post(
  "/createuser",
  [
    body("name", "enter a valid name").isLength({ min: 5 }),
    body("email", "enter a valid email").isEmail(),
    body("password", "pass must be alteast 5 caracters").isLength({ min: 8 }),
  ],
  async (req, res) => {
    //if there are erros , return badrequest andthe errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // check whther the user with this email exist already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "sorry the user with email already exist" });
      }
      const salt = bcrypt.genSaltSync(10);
      const secPass =await bcrypt.hash(req.body.password,salt); 
      //creeate a user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data = {
        user:{
            id:user.id
        }
      }
      const authToken = jwt.sign(data,JWT_SECRET);
    //   console.log(authToken);
    //   res.json(user);
    res.json({authToken})
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured");
    }
  }
);
module.exports = router;
