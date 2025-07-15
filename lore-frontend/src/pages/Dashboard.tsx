import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../api/apiClient';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const mockChapters = [
  { name: 'Sexual Reproduction in Flowering Plants', reviewScore: 62 },
  { name: 'Human Reproduction', reviewScore: 70 },
  { name: 'Reproductive Health', reviewScore: 55 },
  { name: 'Principles of Inheritance and Variation', reviewScore: 80 },
  { name: 'Molecular Basis of Inheritance', reviewScore: 60 },
  { name: 'Evolution', reviewScore: 50 },
  { name: 'Human Health and Disease', reviewScore: 65 },
  { name: 'Microbes in Human Welfare', reviewScore: 58 },
  { name: 'Biotechnology – Principles and Processes', reviewScore: 72 },
  { name: 'Biotechnology and Its Applications', reviewScore: 68 },
  { name: 'Organisms and Populations', reviewScore: 64 },
  { name: 'Ecosystem', reviewScore: 59 },
  { name: 'Biodiversity and Conservation', reviewScore: 73 },
];

const performanceData = {
  labels: mockChapters.map((c) => c.name),
  datasets: [
    {
      label: 'Review Score (%)',
      data: mockChapters.map((c) => c.reviewScore),
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
      borderRadius: 6,
    },
  ],
};

const performanceOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: false },
  },
  scales: {
    y: {
      min: 0,
      max: 100,
      ticks: { color: '#64748b', stepSize: 20 },
      grid: { color: '#e5e7eb' },
    },
    x: {
      ticks: { color: '#64748b', maxRotation: 60, minRotation: 30 },
      grid: { display: false },
    },
  },
};

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<{ name: string; grade: string; avatar: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/api/user/me');
        const name = res.data?.name || 'User';
        const grade = res.data?.grade || '';
        const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3B82F6&color=fff&size=128`;
        setUser({ name, grade, avatar });
      } catch {
        setUser({ name: 'User', grade: '', avatar: '' });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-blue-600 dark:text-blue-400 text-lg font-semibold animate-pulse">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* User Info Card */}
        <div className="flex flex-col sm:flex-row items-center gap-6 bg-white dark:bg-gray-800 rounded-2xl shadow p-6 mb-2">
          <img src={user?.avatar} alt={user?.name} className="w-20 h-20 rounded-full border-4 border-blue-500 shadow" />
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">Welcome, {user?.name}!</h1>
            {user?.grade && <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">Grade {user.grade}</span>}
          </div>
        </div>
        {/* Top Chapters to Review */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Top 10 Chapters to Review</h2>
          <ul className="space-y-5">
            {mockChapters.map((ch, i) => (
              <li key={ch.name} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="flex-1 font-medium text-gray-700 dark:text-gray-200">
                  {i + 1}. {ch.name}
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${ch.reviewScore}%` }}
                    />
                  </div>
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold w-12 text-right">{ch.reviewScore}%</span>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <button className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 font-semibold">Retake Quiz</button>
                  <button className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 font-semibold">Watch Video</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
        {/* Past Performance Chart */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Past Performance</h2>
          <div className="h-64">
            <Bar data={performanceData} options={performanceOptions} />
          </div>
        </section>
        {/* Streaks & Badges */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Streaks & Badges</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold shadow-sm">
              <span className="text-xl">🔥</span> 5-day Streak
            </div>
            <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold shadow-sm">
              <span className="text-xl">🏅</span> Quiz Master
            </div>
            <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg font-semibold shadow-sm">
              <span className="text-xl">⭐</span> Consistent Learner
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard; 