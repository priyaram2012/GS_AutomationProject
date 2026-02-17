const APIClient = require('./APIClient');

/**
 * BoardAPI (JavaScript)
 */

class BoardAPI {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async getAllBoards() {
    return this.apiClient.get('/api/boards');
  }

  async getBoardById(boardId) {
    return this.apiClient.get(`/api/boards/${boardId}`);
  }

  async createBoard(boardData) {
    return this.apiClient.post('/api/boards', { body: boardData });
  }

  async updateBoard(boardId, boardData) {
    return this.apiClient.put(`/api/boards/${boardId}`, { body: boardData });
  }

  async deleteBoard(boardId) {
    return this.apiClient.delete(`/api/boards/${boardId}`);
  }

  async getBoardTasks(boardId) {
    return this.apiClient.get(`/api/boards/${boardId}/tasks`);
  }

  async getTask(boardId, taskId) {
    return this.apiClient.get(`/api/boards/${boardId}/tasks/${taskId}`);
  }

  async createTask(boardId, taskData) {
    return this.apiClient.post(`/api/boards/${boardId}/tasks`, { body: taskData });
  }

  async updateTask(boardId, taskId, taskData) {
    return this.apiClient.put(`/api/boards/${boardId}/tasks/${taskId}`, { body: taskData });
  }

  async deleteTask(boardId, taskId) {
    return this.apiClient.delete(`/api/boards/${boardId}/tasks/${taskId}`);
  }

  async moveTask(boardId, taskId, newStatus) {
    return this.apiClient.patch(`/api/boards/${boardId}/tasks/${taskId}`, { body: { status: newStatus } });
  }

  async getBoardColumns(boardId) {
    return this.apiClient.get(`/api/boards/${boardId}/columns`);
  }

  async searchTasks(boardId, query) {
    return this.apiClient.get(`/api/boards/${boardId}/tasks/search`, { params: { q: query } });
  }

  async getTasksByStatus(boardId, status) {
    return this.apiClient.get(`/api/boards/${boardId}/tasks`, { params: { status } });
  }

  async getTaskStatistics(boardId) {
    return this.apiClient.get(`/api/boards/${boardId}/statistics`);
  }
}

module.exports = BoardAPI;
