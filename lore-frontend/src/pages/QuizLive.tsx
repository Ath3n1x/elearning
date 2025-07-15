import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const mockQuestions = [
  { question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Chloroplast'], answer: 1 },
  { question: 'What is the process of making food in plants called?', options: ['Respiration', 'Photosynthesis', 'Transpiration', 'Digestion'], answer: 1 },
];

const QuizLive: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const duration = location.state?.duration || 25; // in minutes
  const [timeLeft, setTimeLeft] = useState(duration * 60); // seconds
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(mockQuestions.length).fill(null));

  useEffect(() => {
    if (timeLeft <= 0) {
      // Time's up! Submit quiz
      navigate('/quiz/results', { state: { answers } });
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, answers, navigate]);

  const handleAnswer = (idx: number) => {
    const updated = [...answers];
    updated[current] = idx;
    setAnswers(updated);
  };

  const handleNav = (dir: number) => {
    setCurrent((prev) => Math.max(0, Math.min(mockQuestions.length - 1, prev + dir)));
  };

  const handleSubmit = () => {
    navigate('/quiz/results', { state: { answers } });
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-8">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700 space-y-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">Time Left: {mins}:{secs.toString().padStart(2, '0')}</span>
          <span className="text-gray-500 dark:text-gray-300">Question {current + 1} / {mockQuestions.length}</span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{mockQuestions[current].question}</h3>
          <div className="space-y-3">
            {mockQuestions[current].options.map((opt, idx) => (
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
            disabled={current === mockQuestions.length - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizLive; 