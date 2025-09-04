import { useState } from 'react';
// Correctly import the named export with a relative path
import { analyzeResume } from '../lib/api';

// Define a type for the analysis result for cleaner code
type AnalysisResult = {
  match_score: number;
  summary: string;
  missing_keywords: string[];
};

export default function ResumeAnalyzer() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setResumeFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!resumeFile || !jobDescription) {
      setError('Please provide both a resume file and a job description.');
      return;
    }

    // Reset state for a new request
    setError(null);
    setResult(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('job_description', jobDescription);

      const analysisResult = await analyzeResume(formData);
      setResult(analysisResult);

    } catch (apiError) {
      setError('Failed to get analysis. The backend server may be down.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Job Scan AI</h1>
          <p className="text-md text-gray-600 mt-2">Get an instant analysis of your resume.</p>
        </header>
        <main className="bg-white p-8 rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="resume-upload" className="block text-sm font-medium text-gray-700 mb-1">Upload Your Resume</label>
                <input id="resume-upload" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>
              <div>
                <label htmlFor="job-description" className="block text-sm font-medium text-gray-700 mb-1">Paste Job Description</label>
                <textarea id="job-description" rows={10} value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste the job description here..." className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
            </div>
            <div className="mt-6">
              <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400">
                {isLoading ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
          </form>
          {error && <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-md"><p>{error}</p></div>}
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
                    {result.missing_keywords.map((keyword, index) => <li key={index}>{keyword}</li>)}
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