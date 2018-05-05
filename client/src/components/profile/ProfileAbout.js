import React, { Component } from 'react';
import isEmpty from '../../validation/isEmpty'
import PropTypes from 'prop-types';
export class ProfileAbout extends Component {
	render() {
		const {profile} = this.props;

		//get first name
		//const firstName = profile.user.name.trim().split('')[0];
		//skills list
		const skills = profile.skills.map((skill, index) =>(
			<div key={index} className="p-3">
				<i className="fa fa-check" />{skill}
			</div>
		));
		return (
            <div className="col-md-12">
              <div className="card card-body bg-light mb-3">
                <h3 className="text-center text-info"> My Bio </h3>
                <p className="lead">
                 {isEmpty(profile.bio) ? (<span>Does not have a bio</span>) : (<span>{profile.bio}</span>)}
                </p>
                <hr />
                <h3 className="text-center text-info">Skill Set</h3>
               	{skills}
                </div>
              </div>
          
          
		);
	}
}

ProfileAbout.propTypes = {
  profile:PropTypes.object.isRequired
};


export default ProfileAbout;