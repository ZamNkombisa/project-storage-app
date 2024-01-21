const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware setup
app.use(express.json()); // Parse incoming JSON data
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(bodyParser.json()); // Deprecated, since express.json() is used

// Sample projects
const projects = [
  {
    id: 1,
    title: "Hangman Game",
    description: "Hangman game created using Create React app.",
    url: "https://github.com/ZamNkombisa/My-Hangman",
  },
  {
    id: 2,
    title: "Spotify-clone",
    description: "Spotify-clone created using Create React app.",
    url: "https://github.com/ZamNkombisa/spotify-clone",
  },
];

// Get projects
app.get("/api/projects", (_req, res) => {
  res.json(projects);
});

// Add new project
app.post("/api/projects", (req, res) => {
  const project = {
    id: projects.length + 1,
    title: req.body.title,
    description: req.body.description,
    url: req.body.url,
  };

  // Push added project to the projects array
  projects.push(project);
  // Respond with the newly created project and a 201 status (Created)
  res.status(201).json(project);
});

// Update project by ID
app.put("/api/projects/:id", (req, res) => {
  // Extract project ID from the request parameters
  const id = parseInt(req.params.id);

  // Find the project in the projects array based on its ID
  const project = projects.find((p) => p.id === id);

  // If the project is not found, return a 404 status (Not Found)
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  // Update project data with information from the request body
  project.title = req.body.title;
  project.description = req.body.description;
  project.url = req.body.url;

  // Respond with the updated project and a 200 status (OK)
  res.status(200).json(project);
});

// Delete project by ID
app.delete("/api/projects/:id", (req, res) => {
  // Extract project ID from the request parameters
  const id = parseInt(req.params.id);
  // Find the index of the project in the projects array based on its ID
  const index = projects.findIndex((p) => p.id === id);

  // If the project is not found, return a 404 status (Not Found)
  if (index === -1) {
    return res.status(404).json({ message: "Project not found" });
  }

  // Remove the project from the projects array
  projects.splice(index, 1);
  // Respond with a 204 status (No Content) since the resource is deleted
  res.status(204).send();
});

// Server setup and start
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
