import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import TextFieldGroup from '../common/TextFieldGroup'
import TextAreaFieldGroup from '../common/TextAreaFieldGroup'
import InputGroup from '../common/InputGroup'
import SelectListGroup from '../common/SelectListGroup'
import {createProfile} from '../../actions/profileActions'


class CreateProfile extends Component {
    constructor(props) {
        super(props);
        this.state={
        	displaySocialInputs:false,
        	handle:'',
        	company:'',
        	website:'',
        	location:'',
        	status:'',
        	skills:'',
        	githubusername:'',
        	bio:'',
        	twitter:'',
        	facebook:'',
        	linkedin:'',
        	youtube:'',
        	intagram:'',
        	errors:{}
        }

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
        this.setState({
            errors:nextProps.errors
        })
    }
}
    onSubmit(e){
        e.preventDefault();
        const profileData = {
            handle:this.state.handle,
            company:this.state.company,
            website:this.state.website,
            location:this.state.location,
            status:this.state.status,
            skills:this.state.skills,
            githubusername:this.state.githubusername,
            bio:this.state.bio,
            twitter:this.state.twitter,
            facebook:this.state.facebook,
            linkedin:this.state.linkedin,
            youtube:this.state.youtube,
            instagram:this.state.instagram
        }

        this.props.createProfile(profileData, this.props.history)
    }


    onChange(e){
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    render() {
        const {errors , displaySocialInputs} = this.state;
       
        let socialInputs;

        if (displaySocialInputs) {
            socialInputs=(
            <div>
            <InputGroup
                placeholder="twitter profile url"
                name='twitter'
                icon='fab fa-twitter'
                value={this.state.twitter}
                onChange={this.onChange}
                error={errors.twitter}
             />
                
                <InputGroup
                placeholder="facebook profile url"
                name="facebook"
                icon="fab fa-facebook"
                value={this.state.facebook}
                onChange={this.onChange}
                error={errors.facebook}
             />
             <InputGroup
                placeholder="instagram profile url"
                name="instagram"
                icon="fab fa-instagram"
                value={this.state.instagram}
                onChange={this.onChange}
                error={errors.instagram}
             />
          

             <InputGroup
                placeholder="Youtube profile url"
                name="youtube"
                icon="fab fa-youtube"
                value={this.state.youtube}
                onChange={this.onChange}
                error={errors.youtube}
             />
             <InputGroup
                placeholder="linkedin profile url"
                name="linkedin"
                icon="fab fa-linkedin"
                value={this.state.linkedin}
                onChange={this.onChange}
                error={errors.linkedin}
             />
            </div>

         )
        }

        //select options for status

        const options = [
            {label:" * Select professional status" , value:0 },
            {label:" Developper" , value:'Developper' },
            {label:" Junior Developper" , value:'Junior Developper' },
            {label:" Senior Developper" , value:'Senior Developper'},
            {label:" Manager" , value:'Manager' },
            {label:" Student or Learning" , value:'Student or Learning' },
            {label:" Instructor or Teacher" , value:'Instructor or Teacher' },
            {label:" Intern" , value:'Intern' },
            {label:" Other" , value:'Other' }
        ];
        return (
            <div className="create-profile">
              <div className="container">
              <div className="row">
               <div className="col-md-8 m-auto">
                <h1 className="display-4 text center">Create your profile</h1>
                <p className="lead text-center">
                let's get some information to make your profile 
                </p>
                <small className="d-block pb-3"> * = Required fields</small>
                <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                    placeholder="profile Handle"
                    name="handle"
                    value={this.state.handle}
                    onChange={this.onChange}
                    error={errors.handle}
                    info="Give us an idea of where you at un your carrer"
                    />

                     <SelectListGroup
                    placeholder="Status"
                    name="status"
                    value={this.state.status}
                    onChange={this.onChange}
                    options={options}
                    error={errors.status}
                    info="A unique handle for your profile Url , your full name,company name, nickname"
                    />


                    <TextFieldGroup
                    placeholder="Company"
                    name="company"
                    value={this.state.company}
                    onChange={this.onChange}
                    error={errors.company}
                    info="Could be your own Company or one you work for"
                    />


                     <TextFieldGroup
                    placeholder="Website"
                    name="website"
                    value={this.state.website}
                    onChange={this.onChange}
                    error={errors.website}
                    info="Could be your own Website or a company one"
                    />


                     <TextFieldGroup
                    placeholder="location"
                    name="location"
                    value={this.state.location}
                    onChange={this.onChange}
                    error={errors.location}
                    info="City or city & state suggested (ex:Paris , FR)"
                    />
                    

                     <TextFieldGroup
                    placeholder="skills"
                    name="skills"
                    value={this.state.skills}
                    onChange={this.onChange}
                    error={errors.skills}
                    info="Please use commma to separate skills (ex:java,javascript,python)"
                    />  

                     <TextFieldGroup
                    placeholder="GithubUser"
                    name="githubusername"
                    value={this.state.githubusername}
                    onChange={this.onChange}
                    error={errors.githubusername}
                    info="If you want your latest repos and a github link , include your username"
                    />
                    

                     <TextAreaFieldGroup
                    placeholder="Short Bio"
                    name="bio"
                    value={this.state.bio}
                    onChange={this.onChange}
                    error={errors.bio}
                    info="tell us a little about yourself"
                    />

                    <div className="mb-3">
                        <button type="button" onClick={()=>{
                            this.setState(
                                prevState =>({
                                    displaySocialInputs:!prevState.displaySocialInputs
                                }))

                        }} className="btn btn-light">Add Social Network Links</button>
                        <span className="text-muted">optional</span>
                    </div>
                    {socialInputs}
                    <input type='submit' value ='submit' className='btn btn-info btn-block mt-4'/>
                </form>
              </div>
              </div>
               </div>

            </div>
            
        );
    }
}

CreateProfile.propTypes = {
  profile:PropTypes.object.isRequired,
  errors:PropTypes.object.isRequired
}

const mapStateToProps = state =>({
	profile:state.profile,
	errors:state.errors
})
export default connect(mapStateToProps, {createProfile})(withRouter(CreateProfile));
