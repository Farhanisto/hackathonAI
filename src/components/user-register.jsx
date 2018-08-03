import React, { Component } from 'react';

/* eslint-disable */
class UserRegister extends Component {
  render() {
		if (this.props.detect.message === "error") {
			return (<p>There a problem in recognizing your face, please try again!</p>);
		} else if (this.props.detect.message === "failure") {
			return (<p>Access denied, please contact admin</p>);
		} else if (this.props.detect.message === "success") {
			return (
				<div>
					<p>
                        User successfully <b>registered</b>
					</p>
				</div>);
		} 
			return <p>...</p>;
		
	}
}

export default UserRegister;
