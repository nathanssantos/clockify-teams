import React, { useState } from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';

import Menu from '../Menu/Menu';

import './styles.scss';

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
        anchor="right"
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
