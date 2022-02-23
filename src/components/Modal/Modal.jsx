import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import PropTypes from 'prop-types';

// import { makeStyles } from '@material-ui/core/styles';

// const useStyles = makeStyles((theme) => ({
//   modal: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   paper: {
//     backgroundColor: theme.palette.background.paper,
//     boxShadow: theme.shadows[5],
//     padding: 20,
//     borderRadius: 4,
//   },
// }));

const CustomModal = (props) => {
  const { buttonVariant, buttonContent, buttonClassName, children } = props;

  // const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant={buttonVariant}
        className={buttonClassName}
        onClick={handleOpen}
      >
        {buttonContent}
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        // className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div /* className={classes.paper} */>{children}</div>
        </Fade>
      </Modal>
    </div>
  );
};

CustomModal.propTypes = {
  buttonVariant: PropTypes.oneOf(['text', 'outlined', 'contained']),
  buttonContent: PropTypes.node,
  buttonClassName: PropTypes.string,
  children: PropTypes.node.isRequired,
};

CustomModal.defaultProps = {
  buttonVariant: 'text',
  buttonContent: null,
  buttonClassName: '',
};

export default CustomModal;
