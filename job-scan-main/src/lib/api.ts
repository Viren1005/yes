import axios from 'axios';

// Get the backend URL from environment variables, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Analyzes a resume by sending it to the backend API.
 * This is a named export, so it must be imported with { analyzeResume }.
 */
export const analyzeResume = async (formData: FormData) => {
  const endpoint = `${API_BASE_URL}/api/analyze_resume`;
  console.log(`Sending request to: ${endpoint}`);

  try {
    const response = await axios.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("API call failed:", error);
    // Re-throw the error so the component can see it
    throw error;
  }
};