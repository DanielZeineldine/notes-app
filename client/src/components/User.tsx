import React, { useState, useEffect } from "react";
import axios from "axios";
import useStore from "../useStore";
import "../App.css";

// interface user {
//   username: string;
//   email: string;
//   password: string;
// }
export default function User() {
  const { token, setToken } = useStore();
  // const [userData, setUserData] = useState<user>({
  //   username: "",
  //   email: "",
  //   password: "",
  // });
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signingup, setSigningup] = useState(true);
  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setUserData({
  //     ...userData,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  // const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setUsername();
  // };
  // const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setEmail({
  //     ...userData,
  //     [e.target.name]: e.target.value,
  //   });
  // };
  // const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setPassword({
  //     ...userData,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  const signup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/register",
        { username, email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      console.log(response.status);

      if (response.status >= 200 && response.status < 300) {
        setSigningup(false);
        setUsername("");
        setEmail("");
        setPassword("");
      } else {
        console.log(`Signup failed with status code: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
      console.log(`signup failed for some fkd up reason`);
    }
  };
  const login = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/login",
        { email, password }
      );

      const receivedToken = response.data.token;
      setToken(response.data.token);
      localStorage.setItem("authtoken", JSON.stringify(receivedToken));
    } catch (error) {
      console.error(error);
      console.log(`login failed for some fkd up reason`);
    }
  };
  function changeForm() {
    setSigningup(!signingup);
  }
  return (
    <div className="userpage">
      {signingup ? (
        <div className="signup">
          <div className="signup__header">
            <h1>WELCOME!</h1>
            <br />
            <h2>To NoteX</h2>
          </div>
          <form className="form" action="" onSubmit={signup}>
            <label htmlFor="username"></label>
            <input
              className="input"
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <label htmlFor="email"></label>
            <input
              className="input"
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <label htmlFor="password"></label>
            <input
              className="input"
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button type="submit" className="signupbtn">
              Sign Up
            </button>
            <a className="link" onClick={() => changeForm()} href="#">
              Have an account?
            </a>
          </form>
        </div>
      ) : (
        <div className="login">
          <div className="login__header">
            <h1>WELCOME BACK!</h1>
            <br />
            <h2>To NoteX</h2>
          </div>
          <form className="form" action="" onSubmit={login}>
            <label htmlFor="email"></label>
            <input
              className="input"
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <label htmlFor="password"></label>
            <input
              className="input"
              type="password"
              name="password"
              id="password"
              value={password}
              placeholder="Password"
              onChange={(event) => setPassword(event.target.value)}
            />
            <button type="submit" className="loginbtn" >
              Login
            </button>
            <a className="link" onClick={() => changeForm()} href="#">
              New to NoteX?
            </a>
          </form>
        </div>
      )}
    </div>
  );
}
