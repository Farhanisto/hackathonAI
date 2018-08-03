import React, { Component } from 'react';

/* eslint-disable */
class UserRecognize extends Component {
  render() {
		if (this.props.detect.message === "error") {
			return (<p>There a problem in recognizing your face, please try again!</p>);
		} else if (this.props.detect.message === "failure") {
			return (<p>Access denied, please contact admin</p>);
		} else if (this.props.detect.message === "success") {
			return (
				<div>
					<p><b>Profile name: </b>{this.props.detect.name}</p>
					<p><b>Face ID: </b>{this.props.detect.faceID}</p>
				</div>);
		} 
			return <p>...</p>;
		
	}
}

export default UserRecognize;
