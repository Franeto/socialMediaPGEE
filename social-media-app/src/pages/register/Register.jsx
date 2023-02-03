import axios from "axios";
import { useRef } from "react";
import "./register.css";
import { useNavigate } from "react-router"

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const confirmPassword = useRef();
  const navigate = useNavigate()

  const handleClick = async (e) => {
    e.preventDefault();
    if(confirmPassword.current.value !== password.current.value){
      confirmPassword.current.setCustomValidity("Passwords don't match!")
    } else{
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      }
      try{
        await axios.post("http://localhost:8800/api/auth/register", user);
        navigate("/login")
      }catch(err){
        console.log(err)
      }
    }
  };


  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">ПГЕЕ</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on PGEE
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              placeholder="Username"
              required
              ref={username}
              className="loginInput"
            />
            <input
              type="email"
              placeholder="Email"
              required
              ref={email}
              className="loginInput"
            />
            <input
              type="password"
              placeholder="Password"
              required
              ref={password}
              className="loginInput"
              minLength="6"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              required
              ref={confirmPassword}
              className="loginInput"
            />
            <button className="loginButton" type="submit">SignUp</button>
            <button className="loginRegisterButton">Log into Account</button>
          </form>
        </div>
      </div>
    </div>
  );
}
