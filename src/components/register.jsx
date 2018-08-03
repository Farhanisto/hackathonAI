import React, { Component } from 'react';
import Webcam from 'react-webcam';
import { shape, func } from 'prop-types';

import axios from 'axios';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { connect } from 'react-redux';

// material-ui components
import RaisedButton from 'material-ui/RaisedButton';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import Select from 'react-select';

import { registerUser, clearDisplayData } from '../actions';
import createUsers from '../utils';

import '../styles/register.css';
import UserRegister from './user-register';

// loader styling
const style = {
  container: {
    position: 'absolute',
  },
  refresh: {
    display: 'inline-block',
    position: 'absolute',
  },
  hide: {
    display: 'none',
    position: 'absolute',
  },
};

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      load: false,
      users: createUsers(),
    };
  }

  componentDidMount() {
    this.props.clearDisplayData();
  }

    setRef = (webcam) => {
      this.webcam = webcam;
    }

    capture = () => {
      if (this.state.email === '' || this.state.email === ' ') {
        alert('Email cannot be empty');
        return;
      }

      this.setState({
        load: true,
      });

      const imageSrc = this.webcam.getScreenshot();
      axios.post('https://api.kairos.com/enroll', {
        gallery_name: this.state.email,
        image: imageSrc,
        subject_id: this.state.email,
      }, {
        headers: {
          app_id: '51079399',
          app_key: '141cd3f7d0661f8fc6aebb356ff37723',
        },
      }).then((response) => {
        this.props.registerUser(response.data, this.state.email);
        this.setState({
          load: false,
        });
      });
    }

    handleUsername = (value) => {
      this.setState({
        email: value.value,
      });
    }

    render() {
      return (
        <Grid fluid>
          <Row>
            <Col xs={12} md={4} mdOffset={4}>
              <div style={{ textAlign: 'center' }}>
                <h3>REGISTER FACE</h3>
                <Webcam
                  audio={false}
                  height={320}
                  ref={this.setRef}
                  screenshotFormat='image/png'
                  width={320}
                />
                <br />
                <div style={{ margin: '0 auto!important' }}>
                  <Select
                    options={this.state.users}
                    onChange={this.handleUsername}
                  />
                </div>
                <br />
                <RefreshIndicator
                  className='css-loader'
                  size={50}
                  left={800}
                  top={100}
                  loadingColor='#ADD8E6'
                  status='loading'
                  style={(this.state.load === false) ? style.hide : style.refresh}
                />
                <br />
                <RaisedButton
                  className='register-button'
                  onClick={this.capture}
                  label='REGISTER'
                  success
                  style={{ margin: 16 }}
                />
                <UserRegister detect={this.props.regData} />
              </div>
            </Col>
          </Row>
        </Grid>
      );
    }
}

Register.propTypes = {
  regData: shape({}).isRequired,
  registerUser: func.isRequired,
  clearDisplayData: func.isRequired,
};

function mapStateToProps(state) {
  return {
    regData: state.regData,
  };
}

export default connect(mapStateToProps, { registerUser, clearDisplayData })(Register);
