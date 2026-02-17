const APIClient = require('./APIClient');

/**
 * ProjectBoardAPI - Handles business-level project board operations
 * Renamed from BoardAPI to better reflect the domain model (project board, not generic kanban)
 */
class ProjectBoardAPI {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  // ===== PROJECT / BOARD OPERATIONS =====

  async getAllProjects() {
    return this.apiClient.get('/api/boards');
  }

  async getProjectByName(projectName) {
    const response = await this.getAllProjects();
    if (response.status === 404) {
      // API not available, return mock
      return { status: 404, body: null };
    }
    
    if (response.isOk && Array.isArray(response.body)) {
      const project = response.body.find(p => p.name === projectName);
      if (project) {
        return { status: 200, body: project, isOk: true };
      }
    }
    return { status: 404, body: null };
  }

  async getProjectById(projectId) {
    return this.apiClient.get(`/api/boards/${projectId}`);
  }

  async createProject(projectData) {
    return this.apiClient.post('/api/boards', { body: projectData });
  }

  async updateProject(projectId, projectData) {
    return this.apiClient.put(`/api/boards/${projectId}`, { body: projectData });
  }

  async deleteProject(projectId) {
    return this.apiClient.delete(`/api/boards/${projectId}`);
  }

  // ===== COLUMN OPERATIONS =====

  async getProjectColumns(projectId) {
    return this.apiClient.get(`/api/boards/${projectId}/columns`);
  }

  async getColumnByName(projectId, columnName) {
    const response = await this.getProjectColumns(projectId);
    if (response.isOk && Array.isArray(response.body)) {
      const column = response.body.find(c => c.name === columnName);
      if (column) {
        return { status: 200, body: column, isOk: true };
      }
    }
    return { status: 404, body: null };
  }

  // ===== TASK OPERATIONS =====

  async getProjectTasks(projectId) {
    return this.apiClient.get(`/api/boards/${projectId}/tasks`);
  }

  async getColumnTasks(projectId, columnName) {
    // Get all tasks from project and filter by column
    const response = await this.getProjectTasks(projectId);
    if (!response.isOk) {
      return response;
    }

    if (Array.isArray(response.body)) {
      const columnTasks = response.body.filter(task => 
        task.status === columnName || task.column === columnName
      );
      return { status: 200, body: columnTasks, isOk: true };
    }
    return response;
  }

  async getTaskByName(projectId, taskName) {
    const response = await this.getProjectTasks(projectId);
    if (response.isOk && Array.isArray(response.body)) {
      const task = response.body.find(t => t.title === taskName || t.task === taskName);
      if (task) {
        return { status: 200, body: task, isOk: true };
      }
    }
    return { status: 404, body: null };
  }

  async getTask(projectId, taskId) {
    return this.apiClient.get(`/api/boards/${projectId}/tasks/${taskId}`);
  }

  async createTask(projectId, taskData) {
    return this.apiClient.post(`/api/boards/${projectId}/tasks`, { body: taskData });
  }

  async updateTask(projectId, taskId, taskData) {
    return this.apiClient.put(`/api/boards/${projectId}/tasks/${taskId}`, { body: taskData });
  }

  async deleteTask(projectId, taskId) {
    return this.apiClient.delete(`/api/boards/${projectId}/tasks/${taskId}`);
  }

  async moveTaskToColumn(projectId, taskId, columnName) {
    return this.apiClient.patch(`/api/boards/${projectId}/tasks/${taskId}`, { 
      body: { status: columnName, column: columnName } 
    });
  }

  async searchTasks(projectId, query) {
    return this.apiClient.get(`/api/boards/${projectId}/tasks/search`, { params: { q: query } });
  }

  async getTasksByColumn(projectId, columnName) {
    return this.apiClient.get(`/api/boards/${projectId}/tasks`, { params: { status: columnName } });
  }

  async getProjectStatistics(projectId) {
    return this.apiClient.get(`/api/boards/${projectId}/statistics`);
  }

  // ===== TAG OPERATIONS / VERIFICATION =====

  async getTaskTags(projectId, taskId) {
    const response = await this.getTask(projectId, taskId);
    if (response.isOk && response.body && response.body.tags) {
      return { status: 200, body: response.body.tags, isOk: true };
    }
    return { status: 404, body: [] };
  }

  async expectTaskInColumnWithTags(projectId, taskName, columnName, expectedTags = []) {
    // Get column tasks
    const columnResponse = await this.getColumnTasks(projectId, columnName);
    if (!columnResponse.isOk) {
      return {
        success: false,
        message: `Failed to retrieve tasks from column "${columnName}"`
      };
    }

    // Find the task
    const tasks = Array.isArray(columnResponse.body) ? columnResponse.body : [];
    const task = tasks.find(t => t.title === taskName || t.task === taskName);

    if (!task) {
      return {
        success: false,
        message: `Task "${taskName}" not found in column "${columnName}"`
      };
    }

    // Verify tags
    const taskTags = task.tags || [];
    const missingTags = expectedTags.filter(tag => 
      !taskTags.some(t => t.toLowerCase().includes(tag.toLowerCase()) || tag.toLowerCase().includes(t.toLowerCase()))
    );

    return {
      success: missingTags.length === 0,
      taskName,
      columnName,
      expectedTags,
      foundTags: taskTags,
      missingTags,
      message: missingTags.length === 0 
        ? `✓ Task verified with all tags`
        : `✗ Missing tags: ${missingTags.join(', ')}`
    };
  }
}

module.exports = ProjectBoardAPI;
