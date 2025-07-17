import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Fallback questions in case no questions are passed
const fallbackQuestions = [
  { question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Chloroplast'], answer: 1 },
  { question: 'What is the process of making food in plants called?', options: ['Respiration', 'Photosynthesis', 'Transpiration', 'Digestion'], answer: 1 },
];

const QuizLive: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get questions from location state, or use fallback
  const questions = location.state?.questions || fallbackQuestions;
  const duration = location.state?.duration || 25; // in minutes
  const quizConfig = location.state?.quizConfig;
  
  const [timeLeft, setTimeLeft] = useState(duration * 60); // seconds
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));

  useEffect(() => {
    if (timeLeft <= 0) {
      // Time's up! Submit quiz
      navigate('/quiz/results', { state: { answers, questions, quizConfig } });
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, answers, navigate, questions, quizConfig]);

  const handleAnswer = (idx: number) => {
    const updated = [...answers];
    updated[current] = idx;
    setAnswers(updated);
  };

  const handleNav = (dir: number) => {
    setCurrent((prev) => Math.max(0, Math.min(questions.length - 1, prev + dir)));
  };

  const handleSubmit = () => {
    navigate('/quiz/results', { state: { answers, questions, quizConfig } });
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  // If no questions are available, show error
  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-8">
        <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">No Questions Available</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            No questions were generated. Please go back and try again.
          </p>
          <button
            onClick={() => navigate('/quiz/setup')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
          >
            Back to Quiz Setup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-8">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700 space-y-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">Time Left: {mins}:{secs.toString().padStart(2, '0')}</span>
          <span className="text-gray-500 dark:text-gray-300">Question {current + 1} / {questions.length}</span>
        </div>
        
        {/* Show quiz source if available */}
        {quizConfig && (
          <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-2 rounded">
            <span>Chapter: {quizConfig.chapter}</span>
            {quizConfig.type && <span className="ml-2">Type: {quizConfig.type}</span>}
            {quizConfig.difficulty && <span className="ml-2">Difficulty: {quizConfig.difficulty}</span>}
          </div>
        )}
        
        <div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{questions[current].question}</h3>
          <div className="space-y-3">
            {questions[current].options.map((opt: string, idx: number) => (
              <button
                key={opt}
                className={`w-full text-left px-4 py-2 rounded-lg border transition font-medium ${answers[current] === idx ? 'bg-blue-500 text-white border-blue-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:bg-blue-100 dark:hover:bg-blue-600 hover:text-blue-900 dark:hover:text-white'}`}
                onClick={() => handleAnswer(idx)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center mt-6">
          <button
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold disabled:opacity-50"
            onClick={() => handleNav(-1)}
            disabled={current === 0}
          >
            Previous
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Submit Quiz
          </button>
          <button
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold disabled:opacity-50"
            onClick={() => handleNav(1)}
            disabled={current === questions.length - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizLive; 