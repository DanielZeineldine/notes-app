import { useState } from "react";
import { useEffect } from "react";
import "../App.css";

export default function TextArea({ notes, setNotes, selectedNoteIndex }: any) {
  const [isNoteSelected, setIsNoteSelected] = useState(false);

  const handleContentChange = async (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    try {
      if (!selectedNoteIndex) {
        console.error("Invalid note?");
        return;
      }
      setNotes((prevNotes: any) => {
        const updatedNotes = [...prevNotes];
        const updatedNote = updatedNotes.find(
          (note) => note.id === selectedNoteIndex.id
        );
        updatedNote.content = event.target.value;
        return updatedNotes;
      });
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
        console.error("Failed to update note content on the server");
      }
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleTitleChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      if (!selectedNoteIndex) {
        console.error("Invalid note?");
        return;
      }
      setNotes((prevNotes: any) => {
        const updatedNotes = [...prevNotes];
        const updatedNote = updatedNotes.find(
          (note) => note.id === selectedNoteIndex.id
        );
        updatedNote.title = event.target.value;
        return updatedNotes;
      });
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
        console.log(response);
      if (!response.ok) {
        console.error("Failed to update note on the server");
      }
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleCategoryChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    try {
      setNotes((prevNotes: any) => {
        const updatedNotes = [...prevNotes];
        const updatedNote = updatedNotes.find(
          (note) => note.id === selectedNoteIndex.id
        );
        updatedNote.category = event.target.value;
        return updatedNotes;
      });
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
        console.error("Failed to update note category on the server");
      }
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  useEffect(() => {
    setIsNoteSelected(
      selectedNoteIndex !== null && selectedNoteIndex !== undefined
    );
  }, [selectedNoteIndex]);

  if (notes.length === 0) {
    return null;
  }
  return (
    <>
      {isNoteSelected === true ? (
        <div className="textAreaDiv">
          <div className="textareatop">
            <input
              className="textTitle"
              type="text"
              value={selectedNoteIndex?.title || ""}
              onChange={handleTitleChange}
              placeholder="Title"
            />
            <select
              className="categories"
              onChange={handleCategoryChange}
              name="categories"
              id="categories"
              value={selectedNoteIndex?.category || "general"}
            >
              <option value="general">general</option>
              <option value="work">Work</option>
              <option value="life">Life</option>
              <option value="school">School</option>
            </select>
          </div>
          <textarea
            className="textArea"
            name="noteContent"
            cols={30}
            rows={15}
            value={selectedNoteIndex.content || ""}
            onChange={handleContentChange}
          ></textarea>
        </div>
      ) : null}
    </>
  );
}
