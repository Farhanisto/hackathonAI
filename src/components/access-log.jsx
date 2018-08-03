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
    };
  }

  componentDidMount() {
    this.getAllImages();
  }

    setRef = (webcam) => {
      this.webcam = webcam;
    }

    getAllImages = () => {
      axios.post('https://api.kairos.com/gallery/list_all', {
        gallery_name: this.state.username,
        image: '',
        subject_id: this.state.username,
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

    render() {
      const { classes } = this.props;
      const { logs } = this.state;
      return (
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Dessert (100g serving)</TableCell>
                <TableCell numeric>Calories</TableCell>
                <TableCell numeric>Fat (g)</TableCell>
                <TableCell numeric>Carbs (g)</TableCell>
                <TableCell numeric>Protein (g)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.gallery_ids && logs.gallery_ids.map(n => (
                <TableRow key={n.id}>
                  <TableCell component='th' scope='row'>
                    {n.name}
                  </TableCell>
                  <TableCell numeric>{n.calories}</TableCell>
                  <TableCell numeric>{n.fat}</TableCell>
                  <TableCell numeric>{n.carbs}</TableCell>
                  <TableCell numeric>{n.protein}</TableCell>
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
};

function mapStateToProps(state) {
  return {
    getImages: state.images,
  };
}

export default connect(mapStateToProps, { getAllImagesAction })(withStyles(styles)(AccessLogs));
