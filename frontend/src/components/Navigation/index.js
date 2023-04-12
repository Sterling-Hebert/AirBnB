import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { useModal } from "../../context/Modal";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import * as sessionActions from "../../store/session";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  // const { closeModal } = useModal();

  const dispatch = useDispatch();
  const handleDemo = (e) => {
    e.preventDefault();
    return dispatch(
      sessionActions.login({ credential: "Demo-lition", password: "password" })
    );
  };
  // const closeModClick = (e) => {
  //   e.preventDefault().then(dispatch(closeModal()));
  // };

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <>
        <li className="sticky">
          <button className="createSpotButton">
            <Link to="/spots/new">Create a New Spot</Link>
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
        <img src="https://res.cloudinary.com/duakjbyfi/image/upload/v1678545268/AirBnB%20Clone/logo_browser.psd_vhyhya.png" />
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
