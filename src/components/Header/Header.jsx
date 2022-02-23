import React from 'react';
import { Container } from '@material-ui/core';
import { observer } from 'mobx-react';

import Menu from '../Menu/Menu';
import Drawer from '../Drawer/Drawer';
import Logo from '../Logo/Logo';

import './styles.scss';

const Header = () => {
  return (
    <header className='header'>
      <Container maxWidth='lg'>
        <div className='header__content'>
          <Logo />
          <div className='header__menu'>
            <Menu />
          </div>
          <div className='header__drawer'>
            <Drawer />
          </div>
        </div>
      </Container>
    </header>
  );
};

export default observer(Header);
