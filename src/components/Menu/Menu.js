import React from "react";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";

import "./styles.scss";

const menuButtons = [
  {
    route: "/",
    label: "Projetos",
  },
  {
    route: "/users",
    label: "Colaboradores",
  },
  {
    route: "/teams",
    label: "Equipes",
  },
];

const Menu = ({ vertical, drawer }) => {
  const history = useHistory();

  const handleClick = (route) => {
    history.push(route);
    if (drawer) drawer.close();
  };

  return (
    <nav className={`menu ${vertical ? "vertical" : ""}`}>
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
