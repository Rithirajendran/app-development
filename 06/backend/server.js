const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/notes_app";

// Middleware
app.use(cors());

app.use(express.json({ limit: "10kb" }));

// Note Schema
const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 100
    },

    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true
    },

    color: {
      type: String,
      default: "#ffffff"
    }
  },
  {
    timestamps: true
  }
);

const Note = mongoose.model("Note", noteSchema);

// --------------------------------------------------
// GET HEALTH
// --------------------------------------------------

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Notes API is running"
  });
});

// --------------------------------------------------
// GET ALL NOTES + SEARCH
// --------------------------------------------------

app.get("/api/notes", async (req, res) => {
  try {
    const search = req.query.search || "";

    const query = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { content: { $regex: search, $options: "i" } }
          ]
        }
      : {};

    const notes = await Note.find(query).sort({
      updatedAt: -1
    });

    res.json(notes);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch notes"
    });
  }
});

// --------------------------------------------------
// GET ONE NOTE
// --------------------------------------------------

app.get("/api/notes/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found"
      });
    }

    res.json(note);
  } catch (error) {
    res.status(400).json({
      message: "Invalid note ID"
    });
  }
});

// --------------------------------------------------
// CREATE NOTE
// --------------------------------------------------

app.post("/api/notes", async (req, res) => {
  try {
    const { title, content, color } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Title is required"
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Content is required"
      });
    }

    const note = await Note.create({
      title: title.trim(),
      content: content.trim(),
      color: color || "#ffffff"
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create note"
    });
  }
});

// --------------------------------------------------
// UPDATE NOTE
// --------------------------------------------------

app.put("/api/notes/:id", async (req, res) => {
  try {
    const { title, content, color } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Title is required"
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        message: "Content is required"
      });
    }

    const note = await Note.findByIdAndUpdate(
      req.params.id,
      {
        title: title.trim(),
        content: content.trim(),
        color: color || "#ffffff"
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!note) {
      return res.status(404).json({
        message: "Note not found"
      });
    }

    res.json(note);
  } catch (error) {
    res.status(400).json({
      message: "Invalid note ID"
    });
  }
});

// --------------------------------------------------
// DELETE NOTE
// --------------------------------------------------

app.delete("/api/notes/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found"
      });
    }

    res.json({
      message: "Note deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid note ID"
    });
  }
});

// --------------------------------------------------
// UNKNOWN API ROUTE
// --------------------------------------------------

app.use("/api", (req, res) => {
  res.status(404).json({
    message: "API route not found"
  });
});

// --------------------------------------------------
// ERROR HANDLER
// --------------------------------------------------

app.use((err, req, res, next) => {
  console.error(err);

  if (err instanceof SyntaxError) {
    return res.status(400).json({
      message: "Invalid JSON request"
    });
  }

  res.status(500).json({
    message: "Internal server error"
  });
});

// --------------------------------------------------
// MONGODB CONNECTION
// --------------------------------------------------

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:");
    console.error(error.message);
  });