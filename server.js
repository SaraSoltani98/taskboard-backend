const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
const db = new Database("tasks.db");
db.prepare(
  `
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    assignee TEXT NOT NULL,
    category TEXT NOT NULL,
    priority TEXT NOT NULL,
    status TEXT NOT NULL
  )
`,
).run();
app.use(cors());
app.use(express.json());

app.get("/tasks", (req, res) => {
  const tasks = db.prepare("SELECT * FROM tasks").all();
  res.json(tasks);
});
app.post("/tasks", (req, res) => {
  const newTask = {
    ...req.body,
    id: Date.now(),
  };
  db.prepare(
    `
    INSERT INTO tasks
    (id, title, description, assignee, category, priority, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    newTask.id,
    newTask.title,
    newTask.description,
    newTask.assignee,
    newTask.category,
    newTask.priority,
    newTask.status,
  );
  res.status(201).json(newTask);
});

app.listen(3001, () => {
  console.log("Servern kör på port 3001");
});
