import axios from "axios";
import { useRef } from "react";
import "./register.css";
import { useNavigate } from "react-router";

export default function Register() {
   const username = useRef();
   const email = useRef();
   const password = useRef();
   const confirmPassword = useRef();
   const navigate = useNavigate();

   const handleClick = async (e) => {
      e.preventDefault();
      if (confirmPassword.current.value !== password.current.value) {
         confirmPassword.current.setCustomValidity("Passwords don't match!");
      } else {
         const user = {
            username: username.current.value,
            email: email.current.value,
            password: password.current.value,
         };
         try {
            await axios.post("https://pgee-social-media.herokuapp.com/api/auth/register", user);
            navigate("/login");
         } catch (err) {
            console.log(err);
         }
      }
   };
   const handleNavigate = (e)=>{
      // e.preventDefault();
      navigate("/login");
   }

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
                     placeholder="Име"
                     required
                     ref={username}
                     className="loginInput"
                  />
                  <input
                     type="email"
                     placeholder="E-mail"
                     required
                     ref={email}
                     className="loginInput"
                  />
                  <input
                     type="password"
                     placeholder="Парола"
                     required
                     ref={password}
                     className="loginInput"
                     minLength="6"
                  />
                  <input
                     type="password"
                     placeholder="Потвърди паролата"
                     required
                     ref={confirmPassword}
                     className="loginInput"
                  />
                  <button className="loginButton" type="submit">
                     Запиши се
                  </button>
                  <button className="loginRegisterButton" onClick={handleNavigate}>
                     Влез в акаунт
                  </button>
               </form>
            </div>
         </div>
      </div>
   );
}
