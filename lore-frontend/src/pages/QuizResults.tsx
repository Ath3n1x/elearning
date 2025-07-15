import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const mockQuestions = [
  { question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Chloroplast'], answer: 1, explanation: 'Mitochondria generate most of the cell’s energy.' },
  { question: 'What is the process of making food in plants called?', options: ['Respiration', 'Photosynthesis', 'Transpiration', 'Digestion'], answer: 1, explanation: 'Photosynthesis is the process by which plants make food.' },
];

const QuizResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const answers: (number | null)[] = location.state?.answers || [];

  const correct = answers.filter((a, i) => a === mockQuestions[i].answer).length;
  const wrong = answers.length - correct;

  const pieData = {
    labels: ['Correct', 'Wrong'],
    datasets: [
      {
        data: [correct, wrong],
        backgroundColor: ['#22C55E', '#EF4444'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-8">
      <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700 space-y-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400 mb-2">Quiz Results</h2>
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-4 w-full">
          <div className="w-48 h-48 flex-shrink-0 mx-auto">
            <Pie data={pieData} />
          </div>
          <div className="text-center md:text-left flex-1">
            <div className="text-3xl font-bold text-green-500 mb-2">Score: {correct} / {answers.length}</div>
            <div className="text-lg text-gray-700 dark:text-gray-200">Correct: <span className="font-semibold">{correct}</span></div>
            <div className="text-lg text-gray-700 dark:text-gray-200">Wrong: <span className="font-semibold">{wrong}</span></div>
            <button
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition"
              onClick={() => navigate('/quiz/live')}
            >
              Retry Incorrect Questions
            </button>
          </div>
        </div>
        <div className="mt-4 w-full">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100 text-center">Question Review</h3>
          <ul className="space-y-6">
            {mockQuestions.map((q, i) => (
              <li key={q.question} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  {answers[i] === q.answer ? (
                    <span className="text-green-500 text-xl">✅</span>
                  ) : (
                    <span className="text-red-500 text-xl">❌</span>
                  )}
                  <span className="font-semibold text-gray-800 dark:text-gray-100">{q.question}</span>
                </div>
                <div className="ml-7">
                  <div className="mb-1 text-gray-700 dark:text-gray-200">
                    <span className="font-semibold">Your answer:</span> {answers[i] !== null ? q.options[answers[i]!] : 'No answer'}
                  </div>
                  <div className="mb-1 text-gray-700 dark:text-gray-200">
                    <span className="font-semibold">Correct answer:</span> {q.options[q.answer]}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm">
                    <span className="font-semibold">Explanation:</span> {q.explanation}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QuizResults; 