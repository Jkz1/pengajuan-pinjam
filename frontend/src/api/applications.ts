import { apiClient } from "./client";

export interface Application {
  id: string;
  customerName: string;
  applicationType: "Sepeda Motor" | "Mobil" | "Multiguna";
  amount: string;
  tenor: number;
  monthlyIncome: string;
  monthlyPayment: string;
  notes: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
}

export const getApplications = async (): Promise<Application[]> => {
  const { data } = await apiClient.get("/applications");
  return data.data;
};

export const getApplication = async (id: string): Promise<Application> => {
  const { data } = await apiClient.get(`/applications/${id}`);
  return data.data;
};

export const createApplication = async (payload: {
  customerName: string;
  applicationType: string;
  amount: number;
  tenor: number;
  monthlyIncome: number;
  notes: string;
}) => {
  const { data } = await apiClient.post("/applications", payload);
  return data.data;
};

export const approveApplication = async (id: string) => {
  const { data } = await apiClient.patch(`/applications/${id}/approve`);
  return data.data;
};

export const rejectApplication = async (id: string) => {
  const { data } = await apiClient.patch(`/applications/${id}/reject`);
  return data.data;
};
