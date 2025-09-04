import axios from 'axios';

// Get the backend URL from environment variables.
// VITE_API_URL is set in your Vercel project settings for the live site.
// We fall back to a local address for development on your own computer.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Analyzes a resume by sending it and a job description to the backend API.
 * @param {FormData} formData - The form data containing the resume file and job description.
 * @returns {Promise<any>} The analysis result from the API.
 * @throws {Error} Throws an error if the API call fails.
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
    if (axios.isAxiosError(error)) {
      console.error('Error during API call:', error.message);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Server responded with:', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      }
    } else {
      console.error('An unexpected error occurred:', error);
    }
    // Re-throw the error to be caught by the component
    throw error;
  }
};

