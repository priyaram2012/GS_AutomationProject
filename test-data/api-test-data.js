exports.API_TEST_DATA = {
  boards: {
    valid: { name: 'Test Board', description: 'A test board for automation' },
    invalid: { name: '', description: 'Invalid board without name' },
    update: { name: 'Updated Test Board', description: 'Updated description' },
  },
  tasks: {
    valid: { title: 'Test Task', description: 'A test task for automation', status: 'To Do', priority: 'High', tags: ['testing', 'automation'] },
    invalidMissingTitle: { title: '', description: 'Task without title', status: 'To Do' },
    invalidStatus: { title: 'Test Task', status: 'Invalid Status' },
    updateData: { title: 'Updated Task', status: 'In Progress', priority: 'Medium' },
  },
  endpoints: {
    boards: '/api/boards',
    tasks: (boardId) => `/api/boards/${boardId}/tasks`,
    columns: (boardId) => `/api/boards/${boardId}/columns`,
    statistics: (boardId) => `/api/boards/${boardId}/statistics`,
  },
  expectedStatusCodes: { ok: 200, created: 201, noContent: 204, badRequest: 400, unauthorized: 401, forbidden: 403, notFound: 404, conflict: 409, internalError: 500 },
  headers: { json: { 'Content-Type': 'application/json' }, form: { 'Content-Type': 'application/x-www-form-urlencoded' }, multipart: { 'Content-Type': 'multipart/form-data' } },
  responseSchemas: {
    board: { required: ['id','name'], properties: { id: 'string', name: 'string', description: 'string', createdAt: 'string', updatedAt: 'string' } },
    task: { required: ['id','title','status'], properties: { id: 'string', title: 'string', description: 'string', status: 'string', priority: 'string', tags: 'array', assignee: 'string', dueDate: 'string' } },
    error: { required: ['status','message'], properties: { status: 'number', message: 'string', errors: 'array' } },
  },
  testScenarios: {
    createBoard: { description: 'Create a new board with valid data', method: 'POST', endpoint: '/api/boards', expectedStatus: 201, body: { name: 'New Board', description: 'A new test board' } },
    getBoards: { description: 'Retrieve all boards', method: 'GET', endpoint: '/api/boards', expectedStatus: 200 },
    updateBoard: { description: 'Update board information', method: 'PUT', endpoint: '/api/boards/{boardId}', expectedStatus: 200, body: { name: 'Updated Board Name' } },
    deleteBoard: { description: 'Delete a board', method: 'DELETE', endpoint: '/api/boards/{boardId}', expectedStatus: 204 },
    createTask: { description: 'Create a task in a board', method: 'POST', endpoint: '/api/boards/{boardId}/tasks', expectedStatus: 201, body: { title: 'New Task', status: 'To Do' } },
    moveTask: { description: 'Move task to different status', method: 'PATCH', endpoint: '/api/boards/{boardId}/tasks/{taskId}', expectedStatus: 200, body: { status: 'In Progress' } },
  },
  mockResponses: {
    boardsList: { status: 200, body: [ { id: 'board-1', name: 'Web Application', description: 'Main web application development', createdAt: '2024-01-01T00:00:00Z' }, { id: 'board-2', name: 'Mobile Application', description: 'Native mobile app development', createdAt: '2024-01-02T00:00:00Z' } ] },
    singleBoard: { status: 200, body: { id: 'board-1', name: 'Web Application', description: 'Main web application development', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-15T10:30:00Z' } },
    tasksList: { status: 200, body: [ { id: 'task-1', title: 'Implement user authentication', status: 'To Do', priority: 'High', tags: ['Feature','High Priority'] }, { id: 'task-2', title: 'Fix navigation bug', status: 'In Progress', priority: 'Medium', tags: ['Bug'] } ] },
    error: { status: 400, body: { status: 400, message: 'Bad Request', errors: ['Invalid board data'] } },
  },
};
