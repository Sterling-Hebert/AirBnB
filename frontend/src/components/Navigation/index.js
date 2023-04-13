import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import * as sessionActions from "../../store/session";
import "./Navigation.css";
import logoImage from "./images/airbnb-2-logo-black-and-white.png";
import DarkMode from "../DarkMode";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <div className="loggedoutNavIndo">
        <>
          <li>
            <DarkMode />
          </li>
          <button>
            <Link to="/spots/new">Create A Spot</Link>
          </button>

          <li>
            <ProfileButton user={sessionUser} />
          </li>
        </>
      </div>
    );
  } else {
    sessionLinks = (
      <>
        <div className="loggedoutNavIndo">
          <li>
            <DarkMode />
          </li>
          <li>
            <OpenModalButton
              buttonText="Log In"
              modalComponent={<LoginFormModal />}
            />
          </li>
          <li>
            <OpenModalButton
              buttonText="Sign Up"
              modalComponent={<SignupFormModal />}
            />
          </li>
        </div>
      </>
    );
  }

  return (
    <div className="navBarHeader">
      <NavLink exact to="/" className="Icon">
        <img className="Icon" src={logoImage} />
      </NavLink>

      <ul className="actualNav">
        {isLoaded && sessionLinks}
        {!sessionUser ? <li></li> : <></>}
      </ul>
    </div>
  );
}

export default Navigation;
