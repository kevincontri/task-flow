import { CommentBase } from "../types/comment_types.ts";
import api from "./axios.ts";

export const getComments = async (projectId: number, taskId: number): Promise<CommentBase[]> => {
  const response = await api.get(`/projects/${projectId}/tasks/${taskId}/comments`);
  return response.data;
};

export const createComment = async (projectId: number, taskId: number, content: string): Promise<CommentBase> => {
  console.log(projectId, taskId, content);
  const response = await api.post(`/projects/${projectId}/tasks/${taskId}/comments`, { content });
  return response.data;
}

export const deleteComment = async (projectId: number, taskId: number, commentId: number): Promise<void> => {
  await api.delete(`/projects/${projectId}/tasks/${taskId}/comments/${commentId}`);
}