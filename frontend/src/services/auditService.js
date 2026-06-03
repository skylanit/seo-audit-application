import axios from "axios";

const API_URL =
import.meta.env.VITE_API_URL;

export const runAudit = async (url) => {

  const response =
    await axios.post(
      `${API_URL}/audit`,
      { url }
    );

  return response.data;
};

export const downloadReport = async (url) => {

  const response =
    await axios.post(
      `${API_URL}/download-report`,
      { url },
      {
        responseType: "blob"
      }
    );

  return response.data;
};