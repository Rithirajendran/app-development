import { useEffect, useState } from "react";
import "./App.css";

const colors = [
  "#ffffff",
  "#fff3b0",
  "#d9f7e8",
  "#dceeff",
  "#ffdce5",
  "#eadcff",
];

function App() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("#ffffff");

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Safe API request
  const request = async (url, options = {}) => {
    try {
      const response = await fetch(url, options);

      const text = await response.text();

      let data = {};

      if (text.trim()) {
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(
            `Server returned an invalid response (${response.status})`
          );
        }
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Request failed with status ${response.status}`
        );
      }

      return data;
    } catch (err) {
      if (err.name === "TypeError") {
        throw new Error(
          "Cannot connect to backend. Make sure the Express server is running on port 5000."
        );
      }

      throw err;
    }
  };

  // Load notes
  const loadNotes = async () => {
    try {
      setLoading(true);
      setError("");

      const url = search.trim()
        ? `/api/notes?search=${encodeURIComponent(search)}`
        : "/api/notes";

      const data = await request(url);

      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  // Search with small delay
  useEffect(() => {
    const timer = setTimeout(() => {
      loadNotes();
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // New note
  const newNote = () => {
    setSelectedNote(null);
    setTitle("");
    setContent("");
    setColor("#ffffff");
    setError("");
  };

  // Edit note
  const editNote = (note) => {
    setSelectedNote(note);
    setTitle(note.title || "");
    setContent(note.content || "");
    setColor(note.color || "#ffffff");
    setError("");
  };

  // Save note
  const saveNote = async () => {
    if (!title.trim()) {
      setError("Please enter a note title.");
      return;
    }

    if (!content.trim()) {
      setError("Please enter note content.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const url = selectedNote
        ? `/api/notes/${selectedNote._id}`
        : "/api/notes";

      const method = selectedNote ? "PUT" : "POST";

      const data = await request(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          color,
        }),
      });

      await loadNotes();

      setSelectedNote(data);
      setTitle(data.title || "");
      setContent(data.content || "");
      setColor(data.color || "#ffffff");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete note
  const deleteNote = async () => {
    if (!selectedNote) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmDelete) return;

    try {
      setError("");

      await request(`/api/notes/${selectedNote._id}`, {
        method: "DELETE",
      });

      setSelectedNote(null);
      setTitle("");
      setContent("");
      setColor("#ffffff");

      await loadNotes();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="logo">
          <div className="logo-icon">📝</div>

          <div>
            <h1>NoteFlow</h1>
            <p>Smart Notes</p>
          </div>
        </div>

        <button className="new-btn" onClick={newNote}>
          + New Note
        </button>

        <div className="sidebar-info">
          <p>📚 Total Notes</p>
          <strong>{notes.length}</strong>
        </div>

        <div className="sidebar-footer">
          <p>MongoDB Notes App</p>
          <small>React + Express + MongoDB</small>
        </div>

      </aside>

      {/* Main */}
      <main className="main">

        {/* Header */}
        <header className="header">

          <div>
            <h2>My Notes</h2>
            <p>Create, edit and manage your notes</p>
          </div>

          <input
            className="search"
            type="text"
            placeholder="🔍 Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </header>

        {/* Error */}
        {error && (
          <div className="error">
            ⚠️ {error}
          </div>
        )}

        <div className="content">

          {/* Notes List */}
          <section className="notes-section">

            <div className="section-title">
              <h3>All Notes</h3>
              <span>{notes.length}</span>
            </div>

            {loading ? (

              <div className="empty">
                <div className="spinner"></div>
                <p>Loading notes...</p>
              </div>

            ) : notes.length === 0 ? (

              <div className="empty">
                <div className="empty-icon">📝</div>

                <h3>No notes found</h3>

                <p>
                  Create your first note using the button above.
                </p>
              </div>

            ) : (

              <div className="notes-list">

                {notes.map((note) => (

                  <div
                    key={note._id}
                    className={`note-card ${
                      selectedNote?._id === note._id
                        ? "active"
                        : ""
                    }`}
                    style={{
                      backgroundColor:
                        note.color || "#ffffff",
                    }}
                    onClick={() => editNote(note)}
                  >

                    <h3>{note.title}</h3>

                    <p>
                      {note.content?.length > 100
                        ? note.content.substring(0, 100) + "..."
                        : note.content}
                    </p>

                    <small>
                      {note.updatedAt
                        ? new Date(
                            note.updatedAt
                          ).toLocaleDateString()
                        : ""}
                    </small>

                  </div>

                ))}

              </div>
            )}

          </section>

          {/* Editor */}
          <section className="editor">

            <div className="editor-header">

              <h3>
                {selectedNote
                  ? "Edit Note"
                  : "Create Note"}
              </h3>

              {selectedNote && (
                <button
                  className="delete-btn"
                  onClick={deleteNote}
                >
                  🗑 Delete
                </button>
              )}

            </div>

            <input
              className="title-input"
              type="text"
              placeholder="Note title..."
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />

            <textarea
              className="content-input"
              placeholder="Write your note here..."
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
            />

            <div className="editor-bottom">

              <div className="colors">

                <span>Color:</span>

                {colors.map((item) => (

                  <button
                    key={item}
                    className={`color-btn ${
                      color === item
                        ? "selected"
                        : ""
                    }`}
                    style={{
                      backgroundColor: item,
                    }}
                    onClick={() =>
                      setColor(item)
                    }
                  />

                ))}

              </div>

              <button
                className="save-btn"
                onClick={saveNote}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "💾 Save Note"}
              </button>

            </div>

          </section>

        </div>

      </main>

    </div>
  );
}

export default App;