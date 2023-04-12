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

  const dispatch = useDispatch();
  const handleDemo = (e) => {
    e.preventDefault();
    return dispatch(
      sessionActions.login({ credential: "Demo-lition", password: "password" })
    );
  };

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <>
        <li>
          <DarkMode />
        </li>
        <li className="sticky">
          <button className="createSpotButton">
            <Link to="/spots/new">Create A Spot</Link>
          </button>
        </li>
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      </>
    );
  } else {
    sessionLinks = (
      <>
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
        {!sessionUser ? (
          <li>
            <button onClick={handleDemo}>Demo Login</button>
          </li>
        ) : (
          <></>
        )}
      </ul>
    </div>
  );
}

export default Navigation;
