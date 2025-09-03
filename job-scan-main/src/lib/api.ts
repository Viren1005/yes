import axios, { AxiosError } from 'axios';

// Get the backend URL from environment variables.
// Fallback to localhost for local development.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Analyzes a resume against a job description.
 * @param formData - The FormData object containing the resume file and job description text.
 * It should have two keys: 'resume' (the file) and 'job_description' (the text).
 * @returns The analysis result from the backend.
 * @throws Throws an error if the API call fails.
 */
export const analyzeResume = async (formData: FormData) => {
  try {
    // Construct the full URL for the API endpoint
    const url = `${API_BASE_URL}/api/analyze_resume`;

    console.log(`Sending request to: ${url}`);

    // Make the POST request with the form data
    const response = await axios.post(url, formData, {
      headers: {
        // The browser will automatically set the 'Content-Type' to 'multipart/form-data'
        // when you pass a FormData object, so you don't need to set it manually.
      },
    });

    // Return the data from the successful response
    return response.data;

  } catch (error) {
    // Handle potential errors
    const axiosError = error as AxiosError;
    console.error("Error during API call:", axiosError.message);

    // Provide more specific feedback for network errors
    if (axiosError.code === 'ERR_NETWORK') {
        console.error(
            'Network Error: Could not connect to the API server. ' +
            'Please check your internet connection and the backend server status.'
        );
    }
    
    // Re-throw the error so the component can handle it (e.g., show an error message)
    throw error;
  }
};
