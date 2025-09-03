import { useState } from 'react';
// Correctly import the analyzeResume function from your api.ts file
import { analyzeResume } from './lib/api';

// Define a type for the analysis result for better code safety
type AnalysisResult = {
  match_score: number;
  summary: string;
  missing_keywords: string[];
};

export default function App() {
  // State for the selected resume file
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  // State for the job description text
  const [jobDescription, setJobDescription] = useState('');
  // State to hold the analysis result
  const [result, setResult] = useState<AnalysisResult | null>(null);
  // State to track loading status
  const [isLoading, setIsLoading] = useState(false);
  // State to hold any error messages
  const [error, setError] = useState<string | null>(null);

  // Handler for file input changes
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setResumeFile(event.target.files[0]);
    }
  };

  // Handler for form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!resumeFile) {
      setError('Please upload a resume file.');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please paste the job description.');
      return;
    }

    // Reset state before new submission
    setError(null);
    setResult(null);
    setIsLoading(true);

    try {
      // Create a FormData object to send the file and text
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('job_description', jobDescription);

      // Call the API function
      const analysisResult = await analyzeResume(formData);
      setResult(analysisResult);

    } catch (apiError) {
      console.error('Failed to analyze resume:', apiError);
      setError('Failed to analyze resume. Please check the console for details.');
    } finally {
      // Ensure loading is set to false after the API call completes
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Job Scan AI</h1>
          <p className="text-md text-gray-600 mt-2">
            Analyze your resume against a job description to improve your chances.
          </p>
        </header>

        <main className="bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* File Upload Section */}
              <div>
                <label htmlFor="resume-upload" className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Your Resume
                </label>
                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              {/* Job Description Text Area */}
              <div>
                <label htmlFor="job-description" className="block text-sm font-medium text-gray-700 mb-1">
                  Paste Job Description
                </label>
                <textarea
                  id="job-description"
                  rows={10}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here..."
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
          </form>

          {/* Display Error Messages */}
          {error && (
            <div className="mt-6 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md">
              <p>{error}</p>
            </div>
          )}

          {/* Display Results */}
          {result && (
            <div className="mt-8 border-t pt-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Analysis Result</h2>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-bold text-blue-800">Match Score</h3>
                  <p className="text-3xl font-bold text-blue-600">{result.match_score}%</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-bold text-green-800">Summary</h3>
                  <p className="text-gray-700">{result.summary}</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h3 className="font-bold text-yellow-800">Missing Keywords</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {result.missing_keywords.map((keyword, index) => (
                      <li key={index}>{keyword}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

