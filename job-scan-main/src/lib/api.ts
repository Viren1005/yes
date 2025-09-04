import axios from 'axios';

// Get the backend URL from environment variables.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Analyzes a resume by sending it and a job description to the backend API.
 * This is a NAMED EXPORT, not a default export.
 */
export const analyzeResume = async (formData: FormData) => {
  const endpoint = `${API_BASE_URL}/api/analyze_resume`;
  
  try {
    const response = await axios.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("API call failed:", error);
    // Re-throw the error so the component can catch it
    throw error;
  }
};

