const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const User = require('../../models/User')
const jwt = require('jsonwebtoken')
const keys = require('../../config/keys')
const passport = require('passport');



//load input validation
const validationRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

//@route Get Api/users/test
//#desc Test users route
//@Access Public
router.get('/test' , (req,res)=> res.json({
	msg:'users works'
}));

//@route Get Api/users/test
//#desc Register users 
//@Access Public
router.post('/register' , (req,res)=>{
	const { errors , isValid } = validationRegisterInput(req.body);
	// check Validation
	if (!isValid) {
		return res.status(400).json(errors)
	}
	User.findOne({email:req.body.email})
		.then(user => {
			if (user) {
				errors.email = "Email has already exists";
				return res.status(400).json(errors);
			}else {
				const avatar = gravatar.url(req.body.email , {
					s:'200',//size 
					r:'pg', //rating
					d:'mm' //default
				})
				const newUser = new User({
					name:req.body.name,
					email:req.body.email,
					avatar,
					password:req.body.password
				});
				bcrypt.genSalt(10 ,(err , salt)=>{
					bcrypt.hash(newUser.password , salt , (err, hash)=>{
						if (err) throw err;
						newUser.password = hash;
						newUser.save()
						 .then(user => res.json(user))
						  .catch(err => console.log(err))
					})
				})
			}
		})
});

//@route Get Api/users/login
//#desc login user / returning jwt token 
//@Access Public
router.post('/login' , (req, res) =>{
	const { errors , isValid } = validateLoginInput(req.body);
	// check Validation
	if (!isValid) {
		return res.status(400).json(errors)
	}
	const email = req.body.email;
	const password = req.body.password;

	//find user by email
	User.findOne({email}).then(user =>{
		//check for user
		if (!user) {
			errors.email = "User not found"
			return res.status(404).json(errors);
		}
		//check Password
		bcrypt.compare(password , user.password)
			.then(isMatch =>{
				if (isMatch) {
					//user matched

					//create jwt paylload
					const payload = {
						id:user.id,
						name:user.name,
						avatar:user.avatar
					}

					//sign token
					jwt.sign(
						payload,
						keys.secretOrKey,
						{ expiresIn: 3600},
						 (err , token) => {
						 	res.json({
						 		success:true,
						 		token:'Bearer ' + token
						 	});
					});
				}else{
					errors.password = "password incorrect "
					return res.status(400).json(errors)
				}
			})
	})


});


//@route Get Api/users/current
//#desc Return current user
//@Access Private

router.get('/current' , passport.authenticate('jwt' , {session:false}), (req, res)=>{
		res.json({
			id:req.user.id,
			name:req.user.name,
			email:req.user.email
		})


});















module.exports = router