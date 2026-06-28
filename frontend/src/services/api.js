let baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/tasks';
if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
if (!baseUrl.endsWith('/api/tasks')) {
  baseUrl = `${baseUrl}/api/tasks`;
}
const API_URL = baseUrl;


class ApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}


const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    const errorMessage = data.message || `HTTP error! Status: ${response.status}`;
    throw new ApiError(errorMessage, response.status, data.errors);
  }
  
  return data;
};


export const taskApi = {
  
  async getTasks(params = {}) {
    let url;
    try {
      
      url = new URL(API_URL);
    } catch (e) {
      try {
        
        url = new URL(API_URL, window.location.origin);
      } catch (err) {
        console.warn("Failed to parse API_URL, falling back to default relative path", err);
        url = new URL('/api/tasks', window.location.origin);
      }
    }
    
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        url.searchParams.append(key, params[key]);
      }
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return handleResponse(response);
  },

  
  async getTaskById(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return handleResponse(response);
  },

  
  async createTask(taskData) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData)
    });

    return handleResponse(response);
  },

  
  async updateTask(id, taskData) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData)
    });

    return handleResponse(response);
  },

  
  async deleteTask(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return handleResponse(response);
  }
};
