import { TaskBase, TaskCreate, TaskUpdate } from '../types/task_types.ts';
import api from './axios.ts';

export const getTasks = async (projectId: number): Promise<TaskBase[]> => {
  const response = await api.get(`/projects/${projectId}/tasks`)
  return response.data
}

export const createTask = async (projectId: number, data: TaskCreate): Promise<TaskBase> => {
  const response = await api.post(`/projects/${projectId}/tasks`, data)
  return response.data
}

export const updateTask = async (projectId: number, taskId: number, data: TaskUpdate): Promise<TaskBase> => {
  const response = await api.put(`/projects/${projectId}/tasks/${taskId}`, data)
  return response.data
}

export const deleteTask = async (projectId: number, taskId: number): Promise<void> => {
  await api.delete(`/projects/${projectId}/tasks/${taskId}`)
}

export const moveTask = async (projectId: number, taskId: number, newStatus: string): Promise<TaskBase> => {
  const response = await api.patch(`/projects/${projectId}/tasks/${taskId}/move`, { status: newStatus })
  return response.data
}