// services/projectService.js
const API_BASE_URL = 'http://10.168.254.5/form_project/api/form.php';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Request failed');
  }
  
  const data = await response.json();
  
  // Handle different API response structures
  if (Array.isArray(data)) {
    return data; // Direct array response
  } else if (data.data && Array.isArray(data.data)) {
    return data.data; // { data: [...] } format
  } else if (data.results && Array.isArray(data.results)) {
    return data.results; // { results: [...] } format
  } else if (data.items && Array.isArray(data.items)) {
    return data.items; // { items: [...] } format
  } else {
    // If it's a single object, wrap it in an array for consistency
    return [data];
  }
};

export const projectService = {
  // Get all projects
  getAllProjects: async () => {
    const response = await fetch(API_BASE_URL, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  // Get single project
  getProject: async (id) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      headers: getAuthHeaders()
    });
    const data = await handleResponse(response);
    return data[0]; // Return the first item for single project
  },

  // Create new project
  createProject: async (projectData) => {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData)
    });
    const data = await handleResponse(response);
    return data[0] || data; // Return the created project
  },

  // Update project
  updateProject: async (id, projectData) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(projectData)
    });
    const data = await handleResponse(response);
    return data[0] || data; // Return the updated project
  },

  // Delete project
  deleteProject: async (id) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};