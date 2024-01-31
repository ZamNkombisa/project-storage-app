import React, { useEffect, useState } from "react";
import axios from "axios";

const WebProjects = () => {
  // State for storing the list of projects
  const [projects, setProjects] = useState([]);

  // State for handling new project input fields
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    url: "",
  });

  // State for handling edit popup visibility and data
  const [editPopup, setEditPopup] = useState({
    isOpen: false,
    projectId: null,
    updatedTitle: "",
    updatedDescription: "",
    updatedURL: "",
  });

  // Fetch projects from the server on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:5050/api/projects");
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  // Toggle edit popup visibility and set initial values
  const toggleEditPopup = (projectId) => {
    setEditPopup({
      isOpen: !editPopup.isOpen,
      projectId: projectId.id,
      updatedTitle: projectId.title,
      updatedDescription: projectId.description,
      updatedUrl: projectId.url,
    });
  };

  const handleEditChange = (field, value) => {
    setEditPopup((prevPopup) => ({
      ...prevPopup,
      [field]: value,
    }));
  };

  // Handle changes in the edit popup input fields
  const editProject = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5050/api/projects/${editPopup.projectId}`,
        {
          title: editPopup.updatedTitle,
          description: editPopup.updatedDescription,
          url: editPopup.updatedUrl,
        }
      );
      console.log(response.data.message);

      // Update the local state
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === editPopup.projectId
            ? {
                ...project,
                title: editPopup.updatedTitle,
                description: editPopup.updatedDescription,
                url: editPopup.updatedUrl,
              }
            : project
        )
      );

      // Close the edit popup
      toggleEditPopup({
        id: editPopup.projectId,
        title: editPopup.updatedTitle,
        description: editPopup.updatedDescription,
        url: editPopup.updatedUrl,
      });
    } catch (error) {
      console.error("Error editing project:", error);
    }
  };

  const deleteProject = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5050/api/projects/${id}`
      );
      console.log(response.data.message);

      // Update the local state
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== id)
      );
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const addProject = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5050/api/projects",
        newProject
      );

      // Log the entire response for further analysis
      console.log("Server Response:", response);

      // Check if the response status is 201
      if (response.status === 201) {
        console.log(response.data.message);

        // Check if the server provided a project in the response
        const newProjectFromServer = response.data;
        if (newProjectFromServer) {
          // Update the local state with the new project
          setProjects((prevProjects) => [
            ...prevProjects,
            newProjectFromServer,
          ]);

          // Clear the newProject state for the next entry
          setNewProject({ title: "", description: "", url: "" });
        } else {
          console.error(
            "Invalid response from server - missing project:",
            response
          );
        }
      } else {
        console.error("Invalid response from server:", response);
      }
    } catch (error) {
      console.error("Error adding project:", error);

      // Log any errors that occur during state update
      console.error("Error updating state:", error);
    }
  };

  return (
    <div className="web-projects-container">
      <h1 className="web-projects-heading">Web Projects</h1>
      <div className="web-projects-content">
        <ul className="web-projects-list">
          {projects.map((project) => (
            <li key={project.id} className="web-project-item">
              <h2>{project.title || "Default title"}</h2>
              <p>{project.description || "No Description"}</p>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="web-project-link"
              >
                View Project
              </a>
              <button
                onClick={() => toggleEditPopup(project)}
                className="web-project-edit"
              >
                Edit
              </button>
              <button
                onClick={() => deleteProject(project.id)}
                className="web-project-delete"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        {/* Edit Project Popup */}
        {editPopup.isOpen && (
          <div className="edit-popup">
            <h2 className="edit-popup-heading">Edit Project</h2>
            <label className="edit-popup-label">
              Title:
              <input
                type="text"
                value={editPopup.updatedTitle}
                onChange={(e) =>
                  handleEditChange("updatedTitle", e.target.value)
                }
                className="edit-popup-input"
              />
            </label>
            <label className="edit-popup-label">
              Description:
              <textarea
                value={editPopup.updatedDescription}
                onChange={(e) =>
                  handleEditChange("updatedDescription", e.target.value)
                }
                className="edit-popup-input"
              />
            </label>
            <label className="edit-popup-label">
              URL:
              <input
                type="text"
                value={editPopup.updatedUrl}
                onChange={(e) => handleEditChange("updatedUrl", e.target.value)}
                className="edit-popup-input"
              />
            </label>
            <button onClick={editProject} className="edit-popup-save">
              Save
            </button>
            <button
              onClick={() => toggleEditPopup(null)}
              className="edit-popup-cancel"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Form for adding a new project */}
      <div className="add-project-form-container">
        <h2 className="add-project-heading">Add New Project</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addProject();
          }}
          className="add-project-form"
        >
          <label className="add-project-label">
            Title:
            <input
              type="text"
              value={newProject.title}
              onChange={(e) =>
                setNewProject({ ...newProject, title: e.target.value })
              }
              className="add-project-input"
            />
          </label>
          <label className="add-project-label">
            Description:
            <textarea
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
              className="add-project-input"
            />
          </label>
          <label className="add-project-label">
            URL:
            <input
              type="text"
              value={newProject.url}
              onChange={(e) =>
                setNewProject({ ...newProject, url: e.target.value })
              }
              className="add-project-input"
            />
          </label>
          <button type="submit" className="add-project-button">
            Add Project
          </button>
        </form>
      </div>
    </div>
  );
};

export default WebProjects;
