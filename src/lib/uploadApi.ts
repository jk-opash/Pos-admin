import axiosInstance from "./axios";

export interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    url: string;
    filename: string;
    size: number;
    mimetype: string;
  };
}

export const uploadDocument = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axiosInstance.post<UploadResponse>("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Upload Error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to upload document"
    );
  }
};
