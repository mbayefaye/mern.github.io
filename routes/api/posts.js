const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//const jwt = require('jsonwebtoken');
const passport = require('passport');


//load profile et user model

const Post = require('../../models/Post'); 
const Profile = require('../../models/Profile');    
const validatePostInput = require('../../validation/post')


//@route Get Api/posts/test
//#desc Test post route
//@Access Public
router.get('/test' , (req,res)=> res.json({
	msg:'posts works'
}));


//@route Get Api/posts
//#desc Test posts 
//@Access Public
router.get('/' , (req,res)=> {
	Post.find().sort({date:-1}).then(posts => res.json(posts))
	.catch(err => res.status(404).json({nopostsFound:'no posts found'}))

})

//@route Get Api/posts/:id
//#desc Get post by id
//@Access Public
router.get('/:id' , (req,res)=> {
	Post.findById(req.params.id).then(post => res.json(post))
	.catch(err => res.status(404).json({nopostFound:'no post found with that id'}))

})


//@route Post Api/posts
//#desc Create Post
//@Access Private
router.post('/' ,passport.authenticate('jwt' ,{session:false}), (req,res)=>{
	const {errors , isValid } = validatePostInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors)
	}
	const newPost = new Post({
		text:req.body.text,
		name:req.body.name,
		avatar:req.body.avatar,
		user:req.user.id
	});

	newPost.save().then(post => res.json(post))
});

//@route Delete Api/posts/:id
//#desc Delete post by id
//@Access private


router.delete('/:id' ,passport.authenticate('jwt',{session:false}), (req,res)=>{
	Profile.findOne({user:req.user.id})
	.then(profile => {
		Post.findById(req.params.id)
		.then(post =>{
			//check for post owner
			if (post.user.toString()!== req.user.id) {
				return res.status(401).json({'notauthorized':'User not authorized'})
			}

			//delete

			post.remove().then(() => res.json({success:true}));
		})
		.catch(err =>res.status(404).json({postnotfound:'No post found'}))
	})


});



//@route Post Api/posts/like/:id
//#desc Like post
//@Access private
router.post(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: 'User already liked this post' });
          }

          // Add user id to likes array
          post.likes.unshift({ user: req.user.id });

          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    });
  }
);

//@route Post Api/posts/unlike/:id
//#desc Like post
//@Access private
router.post('/unlike/:id' , passport.authenticate('jwt',{session:false}), (req,res)=>{
	Profile.findOne({user:req.user.id})
	.then(profile => {
		Post.findById(req.params.id)
		.then(post =>{
			if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
				return res.status(400).json({notLiked:'you have not yet liked this post'});
			}

			//delete user id to unlike a
			const removeIndex = post.likes
			.map(item =>item.user.toString())
			.indexOf(req.user.id);
			//splice
			post.likes.splice(removeIndex,1);
			post.save().then(post => res.json(post))
		})
		.catch(err =>res.status(404).json({postnotfound:'No post found'}))
	})
});



//@route Post Api/posts/comment/:id
//#desc add a comment 
//@Access private

router.post('/comment/:id' , passport.authenticate('jwt',{session:false}), (req,res)=>{
	const {errors , isValid } = validatePostInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors)
	}
	Post.findById(req.params.id)
	.then(post =>{
		const newComment ={
			text:req.body.text,
			name:req.body.name,
			avatar:req.body.avatar,
			user:req.body.id
		}
		//add comment array

		post.comments.unshift(newComment);
		post.save().then(post =>res.json(post))
	})
	.catch(err =>res.status(404).json({postnotfound:'No post found'}))
});


//@route Delete Api/posts/comment/:id
//#desc add a comment 
//@Access private

router.delete('/comment/:id/:comment_id' , passport.authenticate('jwt',{session:false}), (req,res)=>{
	Post.findById(req.params.id)
	.then(post =>{
		if (post.comments.filter(comment =>comment._id.toString() === req.params.comment_id).length = 0) {
			return res.status(400).json({commentNotExisted:'comment not exists'});
		}		//add comment array
      //delete user id to unlike a
			const removeIndex = post.comments
			.map(item =>item._id.toString())
			.indexOf(req.params.comment_id);
			//splice
			post.comments.splice(removeIndex,1);
			post.save().then(post => res.json(post))
		
	})
	.catch(err =>res.status(404).json({postnotfound:'No post found'}))
});




module.exports = router