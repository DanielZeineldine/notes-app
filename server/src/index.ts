import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import UserController from "../controllers/UserController";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.use('/api/user', UserController);

app.get("/api/notes", async (req, res) => {
  const notes = await prisma.note.findMany();  
  res.json(notes);
});

app.post("/api/notes", async (req, res) => {
  const { id, title, dateCreated, content, priority, category, userId } = req.body;
  if (!title || !priority) {
    return res.status(400).send("Some shit are missing.");
  }
  try {
    const newNote = await prisma.note.create({
      data: { id, title, dateCreated, content, priority, category, userId },
    });
    res.json(newNote);
  } catch (error) {
    console.error(error);
    res.status(500).send("Oops, something went wrong");
  }
});

app.put("/api/notes/:id", async (req, res) => {
  const { title, content, priority, category } = req.body;
  const id = req.params.id;

  if (!title) {
    return res.status(400).send("title field required");
  }

  if (!id) {
    return res.status(400).send("ID must be a valid number");
  }

  try {
    const updatedNote = await prisma.note.update({
      where: { id },
      data: { title, content, priority, category },
    });
    res.json(updatedNote);
  } catch (error) {
    res.status(500).send("Oops, something went wrong");
  }
});

app.delete("/api/notes/:id", async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).send("ID field required");
  }

  try {
    await prisma.note.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).send("Oops, something went wrong");
  }
});

app.listen(5000, () => {
  console.log("Frez iz running on port 5000");
});
