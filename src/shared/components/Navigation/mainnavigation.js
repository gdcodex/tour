import React, { useState } from "react";
import { Link } from "react-router-dom";

import Mainheader from "./mainheader";
import Navlinks from "./navlinks";
import Sidedrawer from "./sidedrawer";
import Backdrop from "../UIElements/Backdrop";
import "./mainnavigation.css";

function Mainnavigation() {
  const [drawerIsOpen, setdrawerIsOpen] = useState(false);
  const [Open, setOpen] = useState(false);
  return (
    <>
      {drawerIsOpen && <Backdrop onClick={() => setdrawerIsOpen(false)} />}

      <Sidedrawer open={Open} onClick={drawerIsOpen}>
        <nav className="main-navigation__drawer-nav">
          <Navlinks onClick={() => setdrawerIsOpen(false)} />
        </nav>
      </Sidedrawer>

      <Mainheader>
        <button
          className="main-navigation__menu-btn"
          onClick={() => {
            setdrawerIsOpen((p) => !p);
            setOpen(true);
          }}
        >
          <img src="/ham.png" alt="open" />
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">
            Tour{" "}
            <span role="img" aria-label="jsx-a11y/accessible-emoji">
              🌴
            </span>
          </Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <Navlinks />
        </nav>
      </Mainheader>
    </>
  );
}

export default Mainnavigation;
