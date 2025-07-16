import React, { useEffect, useState } from 'react';
import api from '../api/apiClient';

interface Reminder {
  id: number;
  title: string;
  task_type: string;
  scheduled_date: string;
  completed: boolean;
}

const Reminders: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', task_type: '', scheduled_date: '' });
  const [adding, setAdding] = useState(false);

  const fetchReminders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/reminders/');
      setReminders(res.data);
    } catch (err: any) {
      setError('Failed to load reminders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.task_type.trim() || !form.scheduled_date.trim()) return;
    setAdding(true);
    setError(null);
    try {
      await api.post('/reminders/add', {
        title: form.title,
        task_type: form.task_type,
        scheduled_date: form.scheduled_date,
      });
      setForm({ title: '', task_type: '', scheduled_date: '' });
      fetchReminders();
    } catch (err: any) {
      setError('Failed to add reminder');
    } finally {
      setAdding(false);
    }
  };

  const handleDone = async (id: number) => {
    try {
      await api.put(`/reminders/${id}/done`);
      fetchReminders();
    } catch {
      setError('Failed to mark as done');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/reminders/${id}`);
      fetchReminders();
    } catch {
      setError('Failed to delete reminder');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-xl mx-auto space-y-8">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 text-center mb-6">Reminders & Study Tasks</h2>
        <form onSubmit={handleAdd} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col gap-3">
          <input
            type="text"
            placeholder="Title (e.g. Revise Ch 2)"
            className="input input-bordered"
            value={form.title}
            onChange={e => handleChange('title', e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Task Type (quiz, video, review)"
            className="input input-bordered"
            value={form.task_type}
            onChange={e => handleChange('task_type', e.target.value)}
            required
          />
          <input
            type="date"
            className="input input-bordered"
            value={form.scheduled_date}
            onChange={e => handleChange('scheduled_date', e.target.value)}
            required
          />
          <button
            type="submit"
            className="btn btn-primary mt-2"
            disabled={adding}
          >
            {adding ? 'Adding...' : 'Add Reminder'}
          </button>
        </form>
        {error && <div className="text-red-500 text-center">{error}</div>}
        {loading ? (
          <div className="text-center text-blue-500">Loading reminders...</div>
        ) : reminders.length === 0 ? (
          <div className="text-center text-gray-500">No reminders yet. Add one above!</div>
        ) : (
          <ul className="space-y-3">
            {reminders.map(rem => (
              <li key={rem.id} className={`flex items-center justify-between bg-white dark:bg-gray-800 rounded shadow p-3 ${rem.completed ? 'opacity-60 line-through' : ''}`}>
                <div>
                  <div className="font-semibold">{rem.title}</div>
                  <div className="text-xs text-gray-500">{rem.task_type} &bull; {new Date(rem.scheduled_date).toLocaleDateString()}</div>
                </div>
                <div className="flex gap-2">
                  {!rem.completed && (
                    <button className="btn btn-xs btn-success" onClick={() => handleDone(rem.id)}>Done</button>
                  )}
                  <button className="btn btn-xs btn-error" onClick={() => handleDelete(rem.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Reminders; 