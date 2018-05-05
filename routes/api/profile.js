const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const passport = require('passport');

//load validations
 const validateProfileInput = require('../../validation/profile')
 const validateExperienceInput = require('../../validation/experience')
 const validateEducationInput = require('../../validation/education')

//load profile et user model
const Profile = require('../../models/Profile');
const User = require('../../models/User');


//@route Get Api/profile/test
//#desc Test profile route
//@Access Public
router.get('/test' , (req,res)=> res.json({
	msg:'profile works'
}));

//@route Get Api/profile
//#desc Get Current users profile
//@Access Private
router.get('/' ,passport.authenticate('jwt' ,{session:false}), (req,res) => { 
	const errors = {};
	Profile.findOne({user:req.user.id}).populate('user', 'name')
	.then(profile =>{
		if (!profile) {
			errors.noprofile ='there is no profile for this user';
			return res.status(404).json(errors);
		}
		res.json(profile);
	})
	.catch(err => res.status(404).json(err));

});

//@route Post Api/profile/all
//#desc Get  all profiles
//@Access public

router.get('/all' , (req,res)=>{
    const errors = {};
    Profile.find()
    .then(profiles =>{
        if (!profiles) {
            errors.profiles = 'there are no profiles'
            res.status(404).json(errors)
        }
        res.json(profiles)
    })
    .catch(err =>
        res.status(404).json({profile:'there are no profiles'})
        );

});

//@route Post Api/profile/handle/:handle
//#desc Get  profile by handle
//@Access public

router.get('/handle/:handle' , (req,res)=>{
    const errors = {};
    Profile.findOne({handle:req.params.handle})
    .then(profile =>{
        if (!profile) {
            errors.profile = 'there is no profile for this user'
            res.status(404).json(errors)
        }
        res.json(profile)
    })
    .catch(err =>res.status(404).json(err));

});

//@route Post Api/profile/user/:user_id
//#desc Get  profile by user ID
//@Access public

router.get('/user/:user_id' , (req,res)=>{
    const errors = {};
    Profile.findOne({handle:req.params.user_id})
    .then(profile =>{
        if (!profile) {
            errors.profile = 'there is no profile for this user'
            res.status(404).json(errors)
        }
        res.json(profile)
    })
    .catch(err =>res.status(404).json({profile:'there is no profile for this user'}));

});








//@route Post Api/profile
//#desc create user  profile
//@Access Private
router.post('/' ,passport.authenticate('jwt' ,{session:false}), (req,res) => { 
	const {errors , isValid} = validateProfileInput(req.body);
	//check validation
	if (!isValid) {
		return res.status(400).json(errors);
	}
	//get fields
	const profileFields = {};

	profileFields.user = req.user.id;

	if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    // skills -split into array
    if (typeof req.body.skills !=='undefined') {
    	profileFields.skills = req.body.skills.split(',');
    }

    //social 
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({user:req.user.id})
    .then(profile =>{
    	if (profile) {
    		//update
    		Profile.findOneAndUpdate(
    		{user:req.user.id},
    		{$set:profileFields},
    		{new:true})
    		.then(profile =>res.json(profile));
    	} else {
    		//check if handle exists
    		Profile.findOne({handle:profileFields.handle})
    		.then(profile =>{
    			if (profile) {
    			  errors.handle ="that handle already exists";
    			  res.status(400).json(errors);
    			}
    			//save profile
    			new Profile(profileFields).save().then(profile => res.json(profile));
    		})
    	}
    })
}); 

//@route Post Api/profile/experience/
//#desc Add  experience to profile 
//@Access Private


router.post('/experience' , passport.authenticate('jwt' ,{session:false}),  (req,res)=>{
    const {errors , isValid} = validateExperienceInput(req.body);
    //check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    Profile.findOne({user:req.user.id})
    .then(profile => {
        const newExp = {
            title:req.body.title,
            company:req.body.company,
            location:req.body.location,
            from:req.body.from,
            to:req.body.to,
            current:req.body.current,
            description:req.body.description
        }

        //Add to exp Array

        profile.experiences.unshift(newExp);
        profile.save().then(profile =>res.json(profile));
    })

})


//@route Post Api/profile/experience/
//#desc Add  experience to profile 
//@Access Private


router.post('/education' , passport.authenticate('jwt' ,{session:false}),  (req,res)=>{
    const {errors , isValid} = validateEducationInput(req.body);
    //check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }
    Profile.findOne({user:req.user.id}).then(profile => {
        const newEdu = {
            school:req.body.school,
            degree:req.body.degree,
            fieldofstudy:req.body.fieldofstudy,
            from:req.body.from,
            to:req.body.to,
            current:req.body.current,
            description:req.body.description
        }

        //Add to edu Array

        profile.education.unshift(newEdu);
        profile.save().then(profile =>res.json(profile));
    })

})


//@route delete Api/profile/experience/:id
//#desc delete  experience from profile 
//@Access Private


router.delete('/experience/:exp_id' , passport.authenticate('jwt' ,{session:false}),  (req,res)=>{
    Profile.findOne({user:req.user.id}).then(profile => {
        //get remove index 
        const removeIndex = profile.experiences.map((item) => item.id)
        .indexOf(req.params.exp_id);

        //splice out of array
        profile.experiences.splice(removeIndex, 1);

        //save
      profile.save().then(profile =>res.json(profile));
       
    })

})

//@route Post Api/profile/education/:id
//#desc delete  education from profile 
//@Access Private

router.delete('/education/:edu_id' , passport.authenticate('jwt' ,{session:false}),  (req,res)=>{
    Profile.findOne({user:req.user.id}).then(profile => {
        //get remove index 
        const removeIndex = profile.education.map((item) => item.id)
        .indexOf(req.params.edu_id);

        //splice out of array
        profile.education.splice(removeIndex, 1);

        //save
      profile.save().then(profile =>res.json(profile));
       
    })

})


//@route Post Api/profile/
//#desc delete user and profile 
//@Access Private

router.delete('/' , passport.authenticate('jwt' ,{session:false}),  (req,res)=>{
    Profile.findOneAndRemove({user:req.user.id})
    .then(()=>{
        User.findOneAndRemove({_id:req.user.id})
        .then(() =>res.json({success:true}) ) 
    })
})


module.exports = router