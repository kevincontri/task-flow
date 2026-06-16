import { ProjectBase, ProjectCreate, ProjectUpdate } from "../types/project_types.ts";
import api from "./axios.ts";

export const getProjects = async (): Promise<ProjectBase[]> => {
  const response = await api.get("/projects");
  return response.data;
}

export const createProject = async (data: ProjectCreate): Promise<ProjectBase> => {
  const response = await api.post("/projects", data);
  return response.data;
}

export const updateProject = async (id: number, data: ProjectUpdate): Promise<ProjectBase> => {
  const response = await api.put(`/projects/${id}`, data);
  return response.data
}

export const deleteProject = async (id: number): Promise<void> => {
  await api.delete(`/projects/${id}`);
}