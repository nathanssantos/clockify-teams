import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import { observer } from 'mobx-react';

import Menu from '../Menu/Menu';
import Drawer from '../Drawer/Drawer';
import Logo from '../Logo/Logo';

import './styles.scss';

const Header = () => {
  const [headerShown, setHeaderShown] = useState(true);
  let lastScrollTop = 0;

  const detectScrollDirection = () => {
    const st = window.pageYOffset || document.documentElement.scrollTop;

    if (st > lastScrollTop) {
      setHeaderShown(false);
    } else {
      setHeaderShown(true);
    }

    lastScrollTop = st <= 0 ? 0 : st;
  };

  useEffect(() => {
    window.addEventListener('scroll', detectScrollDirection, false);

    return () => {
      window.removeEventListener('scroll', detectScrollDirection, false);
    };
  }, []);
  return (
    <AppBar
      className="header"
      position="sticky"
      style={{
        transform: headerShown
          ? 'none'
          : 'translate3d(0, calc(-100% - 2rem),0)',
        transition: 'transform 0.25s cubic-bezier(0.645,0.045,0.355,1)',
      }}
    >
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
