import { useState } from "react";
import { useEffect } from "react";
import "./App.css";
import User from "./components/User";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import TextArea from "./components/TextArea";
import useStore from "./useStore";

function App() {
  const [notes, setNotes] = useState([]);
  const [userId, setUserId] = useState('');
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { token, setToken } = useStore();

  //! FETCH ON CHANGE
  useEffect(() => {
    fetch('http://localhost:5000/api/notes')
      .then((response) => response.json())
      .then((data) => {
        setNotes(data);
        // console.log(data);
      })
      .catch((error) => console.error("Error fetching notes:", error));
  }, []);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch('/api/notes');
        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    fetchNotes();
  }, []);

  function Title() {
    return (
      <div className="title">
        <h1>NoteX</h1>
      </div>
    );
  }
  const frez = 1
  return (
    <>
    {!token? (
      <div className="entryPage">
        <User />
      </div>
      ):(
        <div className="app">
        <div className="left">
          <Title />
          <SideBar
            notes={notes}
            setNotes={setNotes}
            selectedNoteIndex={selectedNoteIndex}
            setSelectedNoteIndex={setSelectedNoteIndex}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            // apiBaseUrl={API_BASE_URL}
          />
        </div>
        <div className="right">
          <NavBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            // apiBaseUrl={API_BASE_URL}
          />
          {selectedNoteIndex !== null && (
            <TextArea
              notes={notes}
              setNotes={setNotes}
              selectedNoteIndex={selectedNoteIndex}
              setSelectedNoteIndex={setSelectedNoteIndex}
              // apiBaseUrl={API_BASE_URL}
            />
          )}
        </div>
        <div className="noteSection"></div>
      </div>
      )}
    </>
  );
}

export default App;
