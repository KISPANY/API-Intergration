// components/ProjectList.jsx
import React from 'react';

function ProjectList({ projects, onEdit, onDelete }) {
  if (projects.length === 0) {
    return (
      <div className="empty-state">
        <p>No projects found. Create your first project!</p>
      </div>
    );
  }

  return (
    <div className="project-list">
      <div className="table-responsive">
        <table className="projects-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(project => (
              <tr key={project.id}>
                <td>
                  <div className="project-info">
                    {project.image && (
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="project-thumbnail"
                      />
                    )}
                    <span>{project.title}</span>
                  </div>
                </td>
                <td>{project.category}</td>
                <td>
                  <span className={`status-badge status-${project.status}`}>
                    {project.status}
                  </span>
                </td>
                <td>{new Date(project.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-edit"
                      onClick={() => onEdit(project)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => onDelete(project.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProjectList;