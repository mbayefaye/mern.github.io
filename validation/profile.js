const Validator =require('validator');
const isEmpty = require('./is_empty');

module.exports = function validateProfileInput (data) {
	// body... 
	let errors = {};

	data.handle = !isEmpty(data.handle) ? data.handle :'';
	data.status = !isEmpty(data.status) ? data.status :'';
	data.skills = !isEmpty(data.skills) ? data.skills :'';
	

	if (!Validator.isLength(data.handle , {min:2, max: 40})) {
		errors.handle ='Handle nedds to be between 2 and 40 characters'
	}
	if (Validator.isEmpty(data.handle)) {
		errors.handle = 'Profile handle is required'
	}
	
    if (Validator.isEmpty(data.status)) {
		errors.status = 'Status fields is required'
	}
   
    if (Validator.isEmpty(data.skills)) {
		errors.skills = 'skills fields is required'
	}

	if(!isEmpty(data.website)){
		if (!Validator.isURL(data.website,{protocols: ['https'], require_protocol:true})) {
			errors.website = 'URL not a validate url'
		}
	}

	if(!isEmpty(data.youtube)){
		if (!Validator.isURL(data.youtube , {protocols: ['https'], require_protocol:true})) {
			errors.youtube = ' URL not a validate url'
		}
	}

	if(!isEmpty(data.twitter , {protocols: ['https'], require_protocol:true})){
		if (!Validator.isURL(data.twitter)) {
			errors.facebook = 'URL not a validate url'
		}
	}

	if(!isEmpty(data.facebook , {protocols: ['https'], require_protocol:true})){
		if (!Validator.isURL(data.facebook)) {
			errors.facebook = 'URL not a validate url'
		}
	}

	if(!isEmpty(data.linkedin , {protocols: ['https'], require_protocol:true})){
		if (!Validator.isURL(data.linkedin)) {
			errors.linkedin = 'URL not a validate url'
		}
	}
  
	if(!isEmpty(data.instagram , {protocols: ['https'], require_protocol:true})){
		if (!Validator.isURL(data.instagram)) {
			errors.instagram = 'URL not a validate url'
		}
	}


	return{
		errors,
		isValid:isEmpty(errors)
	};
}