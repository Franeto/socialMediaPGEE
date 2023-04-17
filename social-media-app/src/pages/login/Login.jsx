import { useRef } from "react";
import "./login.css";
import { loginCall } from "../../apiCalls";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router";

export default function Login() {
   const email = useRef();
   const password = useRef();
   const { user, isFetching, error, dispatch } = useContext(AuthContext);
   const navigate = useNavigate();

   const handleClick = (e) => {
      e.preventDefault();
      loginCall(
         { email: email.current.value, password: password.current.value },
         dispatch
      );
   };
   const handleNavigate = (e) => {
      e.preventDefault();
      navigate("/register");
   };

   return (
      <div className="login">
         <div className="loginWrapper">
            <div className="loginLeft">
               <h3 className="loginLogo">ПГЕЕ</h3>
               <span className="loginDesc">
                  Свържи се с приятели и съученици в ПГЕЕ
               </span>
            </div>
            <div className="loginRight">
               <form className="loginBox" onSubmit={handleClick}>
                  <input
                     placeholder="E-mail"
                     type="email"
                     required
                     className="loginInput"
                     ref={email}
                  />
                  <input
                     placeholder="Парола"
                     type="password"
                     required
                     minLength="6"
                     className="loginInput"
                     ref={password}
                  />
                  <button
                     className="loginButton"
                     type="submit"
                     disabled={isFetching}
                  >
                     {isFetching ? (
                        <CircularProgress color="inherit" size="25px" />
                     ) : (
                        "Влез"
                     )}
                  </button>
                  <button
                     formNoValidate
                     className="loginRegisterButton"
                     onClick={handleNavigate}
                  >
                     {isFetching ? (
                        <CircularProgress color="inherit" size="25px" />
                     ) : (
                        "Създай нов акаунт"
                     )}
                  </button>
               </form>
            </div>
         </div>
      </div>
   );
}
