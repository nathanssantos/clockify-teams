/* eslint-disable react/prop-types */
import React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

import './styles.scss';

const menuButtons = [
  {
    route: '/',
    label: 'Collaborators',
  },
  {
    route: '/teams',
    label: 'Teams',
  },
  {
    route: '/projects',
    label: 'Projects',
  },
];

const Menu = ({ vertical, drawer }) => {
  const navigate = useNavigate();

  const handleClick = (route) => {
    navigate(route);
    if (drawer) drawer.close();
  };

  return (
    <nav className={`menu ${vertical ? 'vertical' : ''}`}>
      <ul className="menu__list">
        {menuButtons.map((item) => (
          <li className="menu__list__item" key={item.route}>
            <Button
              className="menu__list__item__button"
              fullWidth={vertical}
              color="primary"
              onClick={() => handleClick(item.route)}
            >
              {item.label}
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Menu;
