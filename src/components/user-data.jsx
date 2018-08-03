import React, { Component } from 'react';

/* eslint-disable */
class UserData extends Component {
  render() {
    console.log(this.props);

    if (!this.props.user.data) {
      return (
        <p><b>...</b></p>
      );
    }

    if (this.props.user.data.Errors) {
      return (
        <p><b>Error: </b>No records found, please try again!</p>
      );
    }

    if (this.props.user.data.images['0'].transaction.status === 'failure') {
      return (
        <p>Access denied <b>failed</b><br />Please contact admin</p>
      );
    }

    return (
      <div className='userData'>
        <p><b>Profile Name: </b>{this.props.user.data.images['0'].transaction.subject_id}</p>
        <p><b>Face ID: </b>{this.props.user.data.images['0'].transaction.face_id}</p>
      </div>
    );
  }
}

export default UserData;
