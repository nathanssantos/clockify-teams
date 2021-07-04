import React, { useState } from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Button from "@material-ui/core/Button";
import MenuIcon from "@material-ui/icons/Menu";

import Menu from "../Menu/Menu";

import "./styles.scss";

const Drawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  return (
    <div className="drawer">
      <Button onClick={open}>
        <MenuIcon color="primary" />
      </Button>
      <SwipeableDrawer
        anchor={"left"}
        open={isOpen}
        onClose={close}
        onOpen={open}
      >
        <div className="drawer__content">
          <Menu vertical drawer={{ close }} />
        </div>
      </SwipeableDrawer>
    </div>
  );
};

export default Drawer;
