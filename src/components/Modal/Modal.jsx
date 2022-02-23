import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Modal, Backdrop, Button, Fade } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: 20,
    borderRadius: 4,
  },
}));

const TransitionsModal = ({
  buttonVariant = "",
  buttonContent = "",
  buttonClassName = "",
  children = null,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {
        <Button
          variant={buttonVariant}
          className={buttonClassName}
          onClick={handleOpen}
        >
          {buttonContent}
        </Button>
      }
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>{children}</div>
        </Fade>
      </Modal>
    </div>
  );
};

export default TransitionsModal;
