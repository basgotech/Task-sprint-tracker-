import client from "./client";

export const authApi = {
  login: (username, password) => client.post("/auth/login/", { username, password }),
  register: (payload) => client.post("/auth/register/", payload),
  me: () => client.get("/auth/me/"),
};

export const projectsApi = {
  list: () => client.get("/projects/"),
  create: (payload) => client.post("/projects/", payload),
  get: (id) => client.get(`/projects/${id}/`),
  members: (id) => client.get(`/projects/${id}/members/`),
  addMember: (id, payload) => client.post(`/projects/${id}/members/add/`, payload),
};

export const boardsApi = {
  list: (projectId) => client.get("/boards/", { params: { project: projectId } }),
  create: (projectId) => client.post("/boards/", { project: projectId }),
};

export const columnsApi = {
  list: (boardId) => client.get("/columns/", { params: { board: boardId } }),
};

export const tasksApi = {
  list: (params) => client.get("/tasks/", { params }),
  create: (payload) => client.post("/tasks/", payload),
  update: (id, payload) => client.patch(`/tasks/${id}/`, payload),
  remove: (id) => client.delete(`/tasks/${id}/`),
  move: (id, payload) => client.post(`/tasks/${id}/move/`, payload),
};

export const sprintsApi = {
  list: (projectId) => client.get("/sprints/", { params: { project: projectId } }),
  create: (payload) => client.post("/sprints/", payload),
  update: (id, payload) => client.patch(`/sprints/${id}/`, payload),
  velocity: (projectId, limit = 8) =>
    client.get("/sprints/velocity/", { params: { project: projectId, limit } }),
};
