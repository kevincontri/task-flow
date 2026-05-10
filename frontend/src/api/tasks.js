import api from './axios';

export const getTasks = async (projectId) => {
  const response = await api.get(`/projects/${projectId}/tasks`)
  return response.data
}

export const createTask = async (projectId, data) => {
  const response = await api.post(`/projects/${projectId}/tasks`, data)
  return response.data
}

export const updateTask = async (projectId, taskId, data) => {
  const response = await api.put(`/projects/${projectId}/tasks/${taskId}`, data)
  return response.data
}

export const deleteTask = async (projectId, taskId) => {
  await api.delete(`/projects/${projectId}/tasks/${taskId}`)
}

export const moveTask = async (projectId, taskId, newStatus) => {
  const response = await api.patch(`/projects/${projectId}/tasks/${taskId}/move`, { status: newStatus })
  return response.data
}