import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'
import jwt_decode from 'jwt-decode'
import {GET_ERRORS} from './types'
import {SET_CURRENT_USER} from './types'


//Register user
export const registerUser = (userData , history)=> dispatch =>{
axios.post('/api/users/register' , userData)
   .then(res => history.push('/login'))
		.catch(err => dispatch({
			type:GET_ERRORS,
			payload:err.response.data
	     }))
}



//login --get user token 
export const loginUser = (userData)=> dispatch =>{
 axios.post('/api/users/login' , userData)
   .then(res => {
   	//save to localstorage
   	const {token} = res.data
   	//set token to ls
   	localStorage.setItem('jwtToken', token);
   	//set token to auth header
   	setAuthToken(token);
   	//decode token to get user data
   	const decoded = jwt_decode(token);
   	//set current user
   	dispatch(setCurrentUser(decoded))
   })
		.catch(err => dispatch({
			type:GET_ERRORS,
			payload:err.response.data
	     }))
}

//set logged in user
export const setCurrentUser = (decoded) => {
	return{
		type:SET_CURRENT_USER,
		payload:decoded
	}
}

//logout user
export const logoutUser = (userData , history)=> dispatch =>{
//remove token from localstorage
localStorage.removeItem('jwtToken');
//remove auth header for future requests
setAuthToken(false);
//set the current user to {} which will set isAuthenticated to false
dispatch(setCurrentUser({}));

}
 