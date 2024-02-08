import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import useStore from "../useStore";
import "../App.css";
export default function NavBar({ setSearchTerm }: any) {
  const { setToken } = useStore();
  const [profileClick, setProfileClick] = useState(false);

  function sendSearchInput(event: any) {
    let searchinput = event.target.value;
    if (searchinput !== "") {
      setSearchTerm(searchinput);
      console.log(searchinput);
    } else if (searchinput == "") {
      setSearchTerm("");
    }
  }
  const toggleProfileDropdown = () => {
    setProfileClick((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("authtoken");
    setProfileClick(false);
    setToken("")
  };
  return (
    <div className="navbar">
      <div className="search">
        <img className="search__ico" src="/search.svg" alt="" />
        <input
          className="search__input"
          type="text"
          placeholder="Search"
          onChange={sendSearchInput}
        />
      </div>
      <div className="profile" onClick={() => toggleProfileDropdown()}>
        <h2>Hola Como Estas</h2>
        <img className="img" src="/prof.jpg" alt="" />
        {profileClick && (
          <div className={`dropdown ${profileClick ? "dropSlideDown" : ""}`}>
            <ul>
              <li>
                <a href="https://www.youtube.com/watch?v=xvFZjo5PgG0" target="_blank">
                  Profile
                </a>
              </li>
              <li onClick={handleLogout}>Logout</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
