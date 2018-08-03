import React, { Component } from 'react';
import Webcam from 'react-webcam';
import { shape, func } from 'prop-types';

// material-ui component
import RaisedButton from 'material-ui/RaisedButton';
import RefreshIndicator from 'material-ui/RefreshIndicator';

import { Grid, Row, Col } from 'react-flexbox-grid';
import axios from 'axios';

import { connect } from 'react-redux';
import { recognizeUser, clearDisplayData } from '../actions';
import '../styles/register.css';
import UserRecognize from './user-recognize';

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

class Recognize extends Component {
  constructor(props) {
    super(props);

    this.state = {
      load: false,
    };
  }

  componentDidMount() {
    this.props.clearDisplayData();
  }

    setRef = (webcam) => {
      this.webcam = webcam;
    }

    capture = () => {
      this.setState({
        load: true,
      });

      const imageSrc = this.webcam.getScreenshot();

      axios.post('https://api.kairos.com/recognize', {
        gallery_name: 'Andela',
        image: imageSrc,
      }, {
        headers: {
          app_id: '51079399',
          app_key: '141cd3f7d0661f8fc6aebb356ff37723',
        },
      }).then((response) => {
        console.log('response', response);
        this.props.recognizeUser(response.data);
        this.setState({
          load: false,
        });
      }).catch((error) => {
        console.log(error);
      });
    };

    render() {
      return (
        <Grid fluid>
          <Row>
            <Col xs={12} md={4} mdOffset={4}>
              <div style={{ textAlign: 'center' }}>
                <h3>Please position your face in the middle of the frame, for better detection</h3>
                <Webcam
                  audio={false}
                  height={320}
                  ref={this.setRef}
                  screenshotFormat='image/png'
                  width={500}
                />
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
                <RaisedButton onClick={this.capture} label='DETECT' style={{ margin: 16 }} />
                <UserRecognize detect={this.props.detData} />
              </div>
            </Col>
          </Row>
        </Grid>
      );
    }
}

Recognize.propTypes = {
  detData: shape({}).isRequired,
  recognizeUser: func.isRequired,
  clearDisplayData: func.isRequired,
};

function mapStateToProps(state) {
  return {
    detData: state.detData,
  };
}

export default connect(mapStateToProps, { recognizeUser, clearDisplayData })(Recognize);
