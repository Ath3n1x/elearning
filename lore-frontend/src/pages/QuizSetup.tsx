import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/apiClient';

const grades = ['6', '7', '8', '9', '10', '11', '12'];
const subjects = ['Biology', 'Physics', 'Chemistry', 'Math'];
const chapters = [
  'Sexual Reproduction in Flowering Plants',
  'Human Reproduction',
  'Reproductive Health',
  'Principles of Inheritance and Variation',
  'Molecular Basis of Inheritance',
  'Evolution',
  'Human Health and Disease',
  'Microbes in Human Welfare',
  'Biotechnology – Principles and Processes',
  'Biotechnology and Its Applications',
  'Organisms and Populations',
  'Ecosystem',
  'Biodiversity and Conservation',
];
const questionTypes = ['MCQ', 'Fill', 'Mixed'];
const difficulties = ['Beginner', 'Intermediate', 'Hard', 'Mixed'];
const modes = ['Standard Quiz', 'Weekly Challenge'];
const durations = [10, 25, 30, 45, 60];

const QuizSetup: React.FC = () => {
  const [form, setForm] = useState({
    grade: '', subject: '', chapter: '', type: '', difficulty: '', mode: '', duration: 25, customDuration: '', numQuestions: 10
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (field: string, value: string | number) => {
    setForm({ ...form, [field]: value });
  };

  const handleDurationChange = (value: string) => {
    if (value === 'custom') {
      setForm({ ...form, duration: '', customDuration: '' });
    } else {
      setForm({ ...form, duration: Number(value), customDuration: '' });
    }
  };

  const handleCustomDuration = (value: string) => {
    setForm({ ...form, customDuration: value, duration: Number(value) });
  };

  const handleNumQuestionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = Math.max(1, Math.min(50, Number(e.target.value)));
    setForm({ ...form, numQuestions: val });
  };

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const params = { ...form };
      const res = await api.post('/quizzes/generate', {
        num_questions: form.numQuestions,
        params,
      });
      navigate('/quiz/live', { state: { ...form, questions: res.data.questions, duration: form.duration } });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-lg border border-gray-200 dark:border-gray-700 space-y-6">
        <h2 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400 mb-2 tracking-tight">Quiz Setup</h2>
        <form className="space-y-5" onSubmit={handleStart}>
          <Dropdown label="Grade" options={grades} value={form.grade} onChange={val => handleChange('grade', val)} />
          <Dropdown label="Subject" options={subjects} value={form.subject} onChange={val => handleChange('subject', val)} />
          <Dropdown label="Chapter" options={chapters} value={form.chapter} onChange={val => handleChange('chapter', val)} />
          <Dropdown label="Question Type" options={questionTypes} value={form.type} onChange={val => handleChange('type', val)} />
          <Dropdown label="Difficulty" options={difficulties} value={form.difficulty} onChange={val => handleChange('difficulty', val)} />
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1 font-medium">Number of Questions</label>
            <input
              type="number"
              min={1}
              max={50}
              value={form.numQuestions}
              onChange={handleNumQuestionsChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1 font-medium">Quiz Duration</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={form.customDuration ? 'custom' : form.duration}
              onChange={e => handleDurationChange(e.target.value)}
              required
            >
              {durations.map(d => (
                <option key={d} value={d}>{d} minutes</option>
              ))}
              <option value="custom">Custom...</option>
            </select>
            {form.customDuration !== '' || form.duration === '' ? (
              <input
                type="number"
                min={1}
                max={180}
                placeholder="Enter custom duration (minutes)"
                className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                value={form.customDuration}
                onChange={e => handleCustomDuration(e.target.value)}
                required
              />
            ) : null}
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition-colors duration-200" disabled={loading}>{loading ? 'Starting...' : 'Start Quiz'}</button>
        </form>
      </div>
    </div>
  );
};

const Dropdown = ({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (val: string) => void }) => (
  <div>
    <label className="block text-gray-700 dark:text-gray-200 mb-1 font-medium">{label}</label>
    <select
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      value={value}
      onChange={e => onChange(e.target.value)}
      required
    >
      <option value="">Select {label}</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default QuizSetup; 