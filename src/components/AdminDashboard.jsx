import React, { useState, useEffect } from 'react';
import '../styles/css.css';

const ProjectsDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    status: 'ongoing'
  });

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://10.168.254.5/form_project/api/form.php');
      const data = await response.json();
      
      if (data.success) {
        setProjects(data.data);
      } else {
        setError('Failed to fetch projects');
      }
    } catch (err) {
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Add new project
  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://10.168.254.5/form_project/api/form.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowAddForm(false);
        setFormData({ title: '', category: '', status: 'ongoing' });
        fetchProjects(); // Refresh the list
      } else {
        setError('Failed to add project');
      }
    } catch (err) {
      setError('Error adding project');
    }
  };

  // Update project
  const handleUpdateProject = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://10.168.254.5/form_project/api/form.php?id=${editingProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setEditingProject(null);
        setFormData({ title: '', category: '', status: 'ongoing' });
        fetchProjects(); // Refresh the list
      } else {
        setError('Failed to update project');
      }
    } catch (err) {
      setError('Error updating project');
    }
  };

  // Delete project
  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      const response = await fetch(`http://10.168.254.5/form_project/api/form.php?id=${id}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        fetchProjects(); // Refresh the list
      } else {
        setError('Failed to delete project');
      }
    } catch (err) {
      setError('Error deleting project');
    }
  };

  // Start editing a project
  const startEditing = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      category: project.category,
      status: project.status
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (dateString === '0000-00-00 00:00:00') return 'Not set';
    
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) return <div className="loading">Loading projects...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="projects-dashboard">
      <header className="dashboard-header">
        <h1>Projects Admin Dashboard</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          Add New Project
        </button>
      </header>

      {/* Add Project Form */}
      {showAddForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Project</h2>
            <form onSubmit={handleAddProject}>
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category:</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Status:</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Add Project</button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Form */}
      {editingProject && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Project</h2>
            <form onSubmit={handleUpdateProject}>
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category:</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Status:</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Update Project</button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setEditingProject(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Projects List */}
      <div className="projects-list">
        <h2>Projects</h2>
        {projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          <table className="projects-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project.id}>
                  <td>{project.title}</td>
                  <td>{project.category}</td>
                  <td>
                    <span className={`status-badge ${project.status}`}>
                      {project.status}
                    </span>
                  </td>
                  <td>{formatDate(project.date)}</td>
                  <td>{formatDate(project.updated_at)}</td>
                  <td className="actions">
                    <button 
                      className="btn btn-sm btn-edit"
                      onClick={() => startEditing(project)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-delete"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ProjectsDashboard;