import api from "./axios";

export const getComments = async (projectId, taskId) => {
  const response = await api.get(`/projects/${projectId}/tasks/${taskId}/comments`);
  return response.data;
};

export const createComment = async (projectId, taskId, content) => {
  const response = await api.post(`/projects/${projectId}/tasks/${taskId}/comments`, { content });
  return response.data;
}

export const deleteComment = async (projectId, taskId, commentId) => {
  await api.delete(`/projects/${projectId}/tasks/${taskId}/comments/${commentId}`);
}