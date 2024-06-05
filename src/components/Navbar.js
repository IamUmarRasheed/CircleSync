import React, { useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import "../App.css";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import logoimg from '../assets/instagram.png'




export default function Navbar() {
    const navigate = useNavigate();
   const { state, dispatch } = useContext(UserContext);
  
  console.log("state", state);

  return (
    <nav className="navbar">
      <div>
        <Link to={state ? "/" : "/signin"} className="brand-logo left">
          <img src={logoimg} alt="Instalogo" />
        </Link>
        <span className="myspan">CircleSync</span>

        <ul id="nav-mobile" className="right hide-on-med-and-down">
          {state ? (
            <>
              <li>
                <Link to="/Profile">Profile</Link>
              </li>
              <li>
                <Link to="/CreatePost">Create Post</Link>
              </li>
              <li key="4">
                <Link to="/subpost">My following Posts</Link>
              </li>

              <li key="5">
                <button
                  className="btn-small bno  btn waves-effect waves-light  darken-3"
                  onClick={() => {
                    localStorage.clear();
                    dispatch({ type: "CLEAR" });
                    navigate("/signin");
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/SignIn">SignIn</Link>
              </li>
              <li>
                <Link to="/Signup">Signup</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );





}
