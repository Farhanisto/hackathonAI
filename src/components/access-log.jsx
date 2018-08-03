import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { func, shape } from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';

import { getAllImagesAction } from '../actions';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

class AccessLogs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logs: [],
      load: false,
    };
  }

  componentDidMount() {
    this.getAllImages();
  }


  componentWillReceiveProps(nextProps) {
    this.setState({
      logs: nextProps.getImages && nextProps.getImages,
    });
  }

    setRef = (webcam) => {
      this.webcam = webcam;
    }

    getAllImages = () => {
      axios.post('https://api.kairos.com/gallery/view', {
        gallery_name: 'Andela',
      }, {
        headers: {
          app_id: '51079399',
          app_key: '141cd3f7d0661f8fc6aebb356ff37723',
        },
      }).then((response) => {
        this.props.getAllImagesAction(response.data);
      }).catch((err) => {
        console.log(err);
      });
    }

    resetGallery = (value) => {
      this.setState({
        load: true,
      });
      axios.post('https://api.kairos.com/gallery/remove', {
        gallery_name: 'Andela',
        subject_id: value,
      }, {
        headers: {
          app_id: '51079399',
          app_key: '141cd3f7d0661f8fc6aebb356ff37723',
        },
      }).then(() => {
        const initialState = this.state.logs;

        this.setState({
          load: false,
          logs: initialState.filter(subjectId => this.state.logs.subject_id !== subjectId),
        });
      });
    }

    deleteImage = (value) => {
      console.log(this.state.load);
      this.resetGallery(value);
    }

    /* eslint-disable */
    formartName = (name) => {
        const firstName = name.split('.')[0];
        let secondName = [];
        if(name.split('.')[1]) {
            secondName = name.split('.')[1].split('@')[0];
        }
        return [firstName, secondName];
    }

    render() {
      const { classes } = this.props;
      const { logs } = this.state;
      return (
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Second Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.subject_ids && logs.subject_ids.map((n, index) => (
                <TableRow key={index}>
                  <TableCell component='th' scope='row'>
                    {this.formartName(n)[0]}
                  </TableCell>
                  <TableCell>{this.formartName(n)[1]}</TableCell>
                  <TableCell>{n}</TableCell>
                  <TableCell>
                    <Button
                        onClick={ (n) => this.resetGallery(n) }
                    >
                        <DeleteIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      );
    }
}

AccessLogs.propTypes = {
  getAllImagesAction: func.isRequired,
  classes: shape({}).isRequired,
  getImages: shape({}).isRequired,
};

function mapStateToProps(state) {
  return {
    getImages: state.registeredUsers,
  };
}

export default connect(mapStateToProps, { getAllImagesAction })(withStyles(styles)(AccessLogs));
