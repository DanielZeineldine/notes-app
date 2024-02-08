import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
import useStore from "../useStore";
import "../App.css";

export default function SideBar({
  notes,
  setNotes,
  selectedNoteIndex,
  setSelectedNoteIndex,
  searchTerm,
  // apiBaseUrl,
}: any) {
  const [showColorOptions, setShowColorOptions] = useState(false);
  const [priorityColor, setPriorityColor] = useState("#041776");
  const [sortBy, setSortBy] = useState("dateCreated");
  const customPriorityOrder = ["#FF0000", "#FFA500", "#FFFF00"];
  const {token}=useStore()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/notes`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setNotes(data);
        } else {
          console.error('Failed to fetch notes:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };
    // Call fetchData whenever apiBaseUrl changes or the component mounts
    fetchData();
  }, ['http://localhost:5000']);

  function sort() {
    const filteredNotes = notes.filter((note: any) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    switch (sortBy) {
      case "dateCreated":
        /* @ts-ignore */
        return filteredNotes.slice().sort((a, b) => a.dateCreated - b.dateCreated);
      case "dateCreatedReverse":
        /* @ts-ignore */
        return filteredNotes.slice().sort((a, b) => b.dateCreated - a.dateCreated);
      case "title":
        /* @ts-ignore */
        return filteredNotes.slice().sort((a, b) => a.title.localeCompare(b.title));
      case "titleReverse":
        /* @ts-ignore */
        return filteredNotes.slice().sort((a, b) => b.title.localeCompare(a.title));
      case "priority":
        /* @ts-ignore */
        return filteredNotes.slice().sort((a, b) => {
          const priorityA = customPriorityOrder.indexOf(a.priority);
          const priorityB = customPriorityOrder.indexOf(b.priority);
          return priorityB - priorityA;
        });
      case "priorityReverse":
        /* @ts-ignore */
        return filteredNotes.slice().sort((a, b) => {
          const priorityA = customPriorityOrder.indexOf(a.priority);
          const priorityB = customPriorityOrder.indexOf(b.priority);
          return priorityA - priorityB;
        });
      default:
        return filteredNotes;
    }
  }
  
  async function newNote() {
    try {
      const response = await fetch('http://localhost:5000/api/notes', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: `Untitled-${notes.length + 1}`,
          dateCreated: new Date(),
          content: "",
          priority: "#000",
          category: "general",
          userId: "danyzid",
        }),
      });

      if (response.ok) {
        const newNote = await response.json();
        setNotes([...notes, newNote]);
        setSelectedNoteIndex(newNote);
      } else {
        console.error('Failed to create a new note:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating new note:', error);
    }
  }

  function generateUniqueId() {
    return uuidv4();
  }

  function handleNoteClick(noteId: string) {
    /* @ts-ignore */
    const clickedNote = notes.find((note) => note.id === noteId);
    // if (clickedNote !== undefined) {
    // }
    setSelectedNoteIndex(() => {
      // console.log(selectedNoteIndex.id);
      return clickedNote;
    });
    console.log(selectedNoteIndex);
  }

  async function deleteNote() {
    if (selectedNoteIndex !== null) {
      try {
        const response = await fetch(`http://localhost:5000/api/notes/${selectedNoteIndex.id}`, {
          method: "DELETE",
        });
  
        if (response.ok) {
          const newNotes = notes.filter((note:any) => note.id !== selectedNoteIndex.id);
          setNotes(newNotes);
          setSelectedNoteIndex(null);
        } else {
          console.error('Failed to delete note:', response.statusText);
        }
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  }
  
  // function deleteNote() {
  //   let newNotes = [...notes];
  //   if (selectedNoteIndex !== null) {
  //     const indexToDelete = newNotes.findIndex(
  //       (note) => note.id === selectedNoteIndex.id
  //     );
  //     newNotes.splice(indexToDelete, 1);
  //   }
  //   setNotes(newNotes);
  //   setSelectedNoteIndex(null);
  // }

  function showPriorities() {
    setShowColorOptions(!showColorOptions);
  }

  async function changePriority(color: any) {
    try {
      setPriorityColor(color);
      if (selectedNoteIndex !== null && notes.length > 0) {
        const selectedNote = notes.find(
          (note: any) => note.id === selectedNoteIndex.id
        );
        if (selectedNote) {
          selectedNote.priority = color;
          setNotes([...notes]);
        }
      }
      const response = await fetch(
        `http://localhost:5000/api/notes/${selectedNoteIndex.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedNoteIndex),
        }
      );
      if (!response.ok) {
        console.error("Failed to update note on the server");
      }

    } catch (error) {
      console.error("Error updating note:", error);
    }
  }

  function handleChange() {}
  return (
    <div className="sideBar">
      <div className="side__NotesList">
        <div className="list__top">
          <h3>All Notes</h3>
          <div className="icons">
            <div
              className={`sortdiv showSortdiv ${
                selectedNoteIndex !== null ? "showSortdiv" : ""
              }`}
            >
              <svg
                className={`sortIco showSort ${
                  selectedNoteIndex !== null ? "showSort" : ""
                }`}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="#000"
              >
                <path d="M8 16H4l6 6V2H8zm6-11v17h2V8h4l-6-6z"></path>
              </svg>
              <select
                className="sortdropdown"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="dateCreated">Date Created</option>
                <option value="dateCreatedReverse">
                  Date Created (Reverse)
                </option>
                <option value="title">Title</option>
                <option value="titleReverse">Title (Reverse)</option>
                <option value="priority">Priority</option>
                <option value="priorityReverse">Priority (Reverse)</option>
              </select>
            </div>
            <img
              className={`delete ${
                selectedNoteIndex !== null ? "showdelete" : ""
              }`}
              onClick={deleteNote}
              src="/delete.svg"
              alt="delete"
              title="delete"
              onChange={handleChange}
            />
            <svg
              className={`priority ${
                selectedNoteIndex !== null ? "showprio" : ""
              }`}
              onClick={showPriorities}
              width="24px"
              height="24px"
              version="1.1"
              viewBox="0 0 30 30"
              fill={
                selectedNoteIndex !== null
                  ? notes.find((note: any) => note.id === selectedNoteIndex.id)
                      ?.priority || "#041776"
                  : "#000"
              }
            >
              <path d="M27.483,13.752L16.248,2.517c-0.689-0.689-1.807-0.689-2.497,0L2.517,13.752c-0.689,0.689-0.689,1.807,0,2.497  l11.235,11.235c0.689,0.689,1.807,0.689,2.497,0l11.235-11.235C28.172,15.559,28.172,14.441,27.483,13.752z M16.212,8l-0.2,9h-2.024  l-0.2-9H16.212z M15.003,22.189c-0.828,0-1.323-0.441-1.323-1.182c0-0.755,0.494-1.196,1.323-1.196c0.822,0,1.316,0.441,1.316,1.196  C16.319,21.748,15.825,22.189,15.003,22.189z" />
            </svg>
            {showColorOptions && (
              <div className="prios">
                <div
                  className="prios__yellow"
                  onClick={() => changePriority("#FFFF00")}
                ></div>
                <div
                  className="prios__orange"
                  onClick={() => changePriority("#FFA500")}
                ></div>
                <div
                  className="prios__red"
                  onClick={() => changePriority("#FF0000")}
                ></div>
              </div>
            )}
          </div>
        </div>
        <ul className="side__NotesUL">
  {sort().map((note: any) => (
    <li
      className={`li ${
        selectedNoteIndex && selectedNoteIndex.id === note.id
          ? "selectedNote"
          : ""
      }`}
      key={note.id}
      onClick={() => handleNoteClick(note.id)}
    >
      <svg
        className="priority"
        width="24px"
        height="24px"
        version="1.1"
        viewBox="0 0 30 30"
        fill={note.priority || "#041776"}
      >
        <path d="M27.483,13.752L16.248,2.517c-0.689-0.689-1.807-0.689-2.497,0L2.517,13.752c-0.689,0.689-0.689,1.807,0,2.497  l11.235,11.235c0.689,0.689,1.807,0.689,2.497,0l11.235-11.235C28.172,15.559,28.172,14.441,27.483,13.752z M16.212,8l-0.2,9h-2.024  l-0.2-9H16.212z M15.003,22.189c-0.828,0-1.323-0.441-1.323-1.182c0-0.755,0.494-1.196,1.323-1.196c0.822,0,1.316,0.441,1.316,1.196  C16.319,21.748,15.825,22.189,15.003,22.189z" />
      </svg>
      <div className="upper">
        {note.title} <br />
        <p>Category: {note.category}</p>
      </div>
      <div className="notecontent">{note.content}</div>
    </li>
  ))}
</ul>

      </div>
      <div className="side__NewNote" onClick={newNote}>
        <p className="p">New Note</p>
      </div>
    </div>
  );
}
