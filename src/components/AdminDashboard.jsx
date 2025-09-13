// components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { projectService } from './Service';
import ProjectList from './ProjectList';
import ProjectForm from './ProjectForm';

function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingProject, setEditingProject] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getAllProjects();
      setProjects(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Create new project
  const handleCreate = async (projectData) => {
    try {
      const newProject = await projectService.createProject(projectData);
      setProjects(prev => [...prev, newProject]);
      setShowForm(false);
      setError('');
    } catch (err) {
      setError('Failed to create project');
      console.error('Error creating project:', err);
    }
  };

  // Update project
  const handleUpdate = async (id, projectData) => {
    try {
      const updatedProject = await projectService.updateProject(id, projectData);
      setProjects(prev => prev.map(project => 
        project.id === id ? updatedProject : project
      ));
      setEditingProject(null);
      setError('');
    } catch (err) {
      setError('Failed to update project');
      console.error('Error updating project:', err);
    }
  };

  // Delete project
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await projectService.deleteProject(id);
      setProjects(prev => prev.filter(project => project.id !== id));
      setError('');
    } catch (err) {
      setError('Failed to delete project');
      console.error('Error deleting project:', err);
    }
  };

  // Start editing
  const startEditing = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  // Cancel editing/form
  const handleCancel = () => {
    setEditingProject(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Projects Admin Dashboard</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add New Project
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {showForm ? (
        <ProjectForm
          project={editingProject}
          onSubmit={editingProject ? handleUpdate : handleCreate}
          onCancel={handleCancel}
        />
      ) : (
        <ProjectList
          projects={projects}
          onEdit={startEditing}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default AdminDashboard;