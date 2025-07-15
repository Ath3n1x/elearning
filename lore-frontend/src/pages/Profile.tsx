import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/apiClient';

const grades = [
  '6', '7', '8', '9', '10', '11', '12'
];

const Profile: React.FC = () => {
  const [form, setForm] = useState({ name: '', age: '', grade: '' });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const nameInputRef = useRef<HTMLInputElement>(null);

  // On mount, check if profile is already complete
  useEffect(() => {
    const checkProfile = async () => {
      try {
        const res = await api.get('/api/user/me');
        const { name, age, grade } = res.data || {};
        if (name && age && grade) {
          navigate('/dashboard', { replace: true });
        } else {
          setForm({ name: name || '', age: age ? String(age) : '', grade: grade || '' });
        }
      } catch (err) {
        // If error, assume profile not complete (or not logged in)
      } finally {
        setChecking(false);
      }
    };
    checkProfile();
  }, [navigate]);

  // Focus on name input on mount (after checking)
  useEffect(() => {
    if (!checking) nameInputRef.current?.focus();
  }, [checking]);

  const validate = () => {
    if (!form.name.trim()) return 'Name is required.';
    if (!form.age.trim() || isNaN(Number(form.age)) || Number(form.age) < 5 || Number(form.age) > 25) return 'Please enter a valid age (5-25).';
    if (!form.grade) return 'Please select a grade.';
    return null;
  };

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      await api.post('/api/profile', {
        name: form.name.trim(),
        age: Number(form.age),
        grade: form.grade,
      });
      setSuccess('Profile saved! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Profile creation failed');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-blue-600 dark:text-blue-400 text-lg font-semibold animate-pulse">Checking profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-200 dark:border-gray-700 space-y-6">
        <h2 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400 mb-2 tracking-tight">
          Complete Your Profile
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-4 text-sm">This helps us personalize your learning experience.</p>
        {error && <div className="mb-2 text-red-600 text-center font-medium" role="alert">{error}</div>}
        {success && <div className="mb-2 text-green-600 text-center font-medium" role="status">{success}</div>}
        <form className="space-y-5" onSubmit={handleSubmit} aria-label="Profile form">
          <FormField
            label="Full Name"
            type="text"
            value={form.name}
            onChange={val => handleChange('name', val)}
            inputRef={nameInputRef}
            ariaLabel="Full Name"
          />
          <FormField
            label="Age"
            type="number"
            value={form.age}
            onChange={val => handleChange('age', val)}
            ariaLabel="Age"
            min={5}
            max={25}
          />
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1 font-medium" htmlFor="grade">Grade <span className="text-red-500">*</span></label>
            <select
              id="grade"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={form.grade}
              onChange={e => handleChange('grade', e.target.value)}
              required
              aria-label="Grade"
            >
              <option value="">Select your grade</option>
              {grades.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <span className="text-xs text-gray-400 dark:text-gray-500">Choose the grade you are currently studying in.</span>
          </div>
          <SubmitButton label={loading ? 'Saving...' : 'Save Profile'} disabled={loading} />
        </form>
      </div>
    </div>
  );
};

export default Profile;

const FormField = ({
  label,
  type,
  value,
  onChange,
  inputRef,
  ariaLabel,
  helper,
  min,
  max
}: {
  label: string;
  type: string;
  value: string;
  onChange: (val: string) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  ariaLabel?: string;
  helper?: string;
  min?: number;
  max?: number;
}) => (
  <div>
    <label className="block text-gray-700 dark:text-gray-200 mb-1 font-medium">{label} <span className="text-red-500">*</span></label>
    <input
      ref={inputRef}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      aria-label={ariaLabel || label}
      min={min}
      max={max}
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
    />
    {helper && <span className="text-xs text-gray-400 dark:text-gray-500">{helper}</span>}
  </div>
);

const SubmitButton = ({ label, disabled }: { label: string; disabled?: boolean }) => (
  <button
    type="submit"
    className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition-colors duration-200 ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
    disabled={disabled}
    aria-busy={disabled}
  >
    {label}
  </button>
); 