import React from 'react';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import { observer } from 'mobx-react';

import Menu from '../Menu/Menu';
import Drawer from '../Drawer/Drawer';
import Logo from '../Logo/Logo';

import './styles.scss';

const Header = () => {
  return (
    <AppBar className="header" position="sticky">
      <Container maxWidth="lg">
        <div className="header__content">
          <Logo />
          <div className="header__menu">
            <Menu />
          </div>
          <div className="header__drawer">
            <Drawer />
          </div>
        </div>
      </Container>
    </AppBar>
  );
};

export default observer(Header);
