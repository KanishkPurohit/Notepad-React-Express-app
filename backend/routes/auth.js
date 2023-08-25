const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'kanishkisgoodboy'
//ROUTE 1: create a user using POST "/api/auth/createuser". doesnt require auth / no login required
router.post(
  "/createuser",
  [
    body("name", "enter a valid name").isLength({ min: 5 }),
    body("email", "enter a valid email").isEmail(),
    body("password", "pass must be alteast 5 caracters").isLength({ min: 8 }),
  ],
  async (req, res) => {
    let success=false;
    //if there are erros , return badrequest andthe errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    // check whther the user with this email exist already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({success, error: "sorry the user with email already exist" });
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
    success=true;
    res.json({success,authToken})
    } catch (error) {
      console.error(error.message);
      res.status(500).send(" internal server error occured");
    }
  }
);

//ROUTE 2: authenticate a user using POST "/api/auth/login". doesnt require auth / no login required
router.post(
    "/login",
    [
      body("email", "enter a valid email").isEmail(),
      body("password", "pass cannot be blanck").exists(),
    ],
    async (req, res) => {
     let success=false;
         //if there are erros , return badrequest andthe errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {email,password} = req.body;
    try {
        let user =await User.findOne({email});
        if(!user){
          success=false;
            return res.status(400).json({error:"please try to login with correct credentials"});
        }
        const passwordCompare =await bcrypt.compare(password,user.password);
        if(!passwordCompare){
          success=false;
            return res.status(400).json({ success,error:"please try to login with correct credentials"});
        }
        const data = {
            user:{
                id:user.id
            }
        }
        const authToken = jwt.sign(data,JWT_SECRET);
        success = true;
        res.json({success,authToken});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal server error occured");
    }

});

// ROUTE 3: get logged in user details using post"/api/auth/getuser".Login requiered
router.post(
    "/getuser", fetchuser , async (req, res) => {
try {
     userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
} catch (error) {
    console.error(error.message);
        res.status(500).send("internal server error occured");
}
})
module.exports = router;
