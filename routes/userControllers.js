const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const userModel = require('./usersModel');
const session = require('express-session');
const xss = require('xss');
const jwtSecret = "207716d4b1623d3ffffe7ed14504bdf8eb433e1aa4da27404eb01bfaf4e1b6a642db79"

module.exports = {
  loginGet: (req,res) =>{
    res.status(200).render('login', {"nologin":'nologin'});
  },

  
  loginPost: async (req,res) =>{
    let { user_email,user_password } = req.body
    // console.log(user_email)
    if(!user_email || !user_password) {
      return res.status(404).send("error");
    }

    let user = await userModel.findOne({email:user_email})
    bcrypt.compare(user_password, user.password).then(function (result) {
      if(result){
        const maxAge = 3 * 60 * 60;
        const token = jwt.sign({id:user._id,user_email},
          jwtSecret,{expiresIn:maxAge,});
        res.cookie("jwt",token,{
          httpOnly:true,
          maxAge:maxAge*1000,
        });
        req.session.user = user._id;
        res.status(201).redirect('/');
      }else{
        res.status(400).render('register',{'message':"Sorry Coudn't login", 'nologin': 'nologin'});
      }
    });

  },

  createUserGet: (req,res)=>{
    res.render('register', {"nologin":'nologin'})
  },

  createUserPost: async (req,res)=>{
    const {user_email,user_password,user_first_name,user_last_name } = req.body
    bcrypt.hash(user_password, 10).then(async (hash) => {
    await userModel.create({
      first_name:user_first_name,
      last_name:user_last_name,
      email:user_email,
      password: hash,

    })
      .then((user) => {
        const maxAge = 3 * 60 * 60;
        const token = jwt.sign(
          { id: user._id, user_email},
          jwtSecret,
          {
            expiresIn: maxAge, // 3hrs in sec
          }
        );
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: maxAge * 1000, // 3hrs in ms
        });
        res.status(201).render('index', {nologin:'nologin'})
      })
      .catch((error) =>
        res.status(400).render('register',{'message': error, 'message1':"Sorry Couldn't create account", 'nologin': 'nologin'})
      );
  });
  },
  logout:(req,res)=>{
    res.cookie("jwt","",{maxAge:"1"})
    req.session.destroy(function (err) {
      res.redirect('/');
  });
  }

}




