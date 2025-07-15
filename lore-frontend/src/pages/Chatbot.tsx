import React, { useState, useRef, useEffect } from 'react';

const mockMessages = [
  {
    role: 'bot',
    text: 'Hi! Ask me any biology question or NCERT topic.',
    source: 'textbook',
    context: 'NCERT Biology Chapter 1',
  },
];

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState(mockMessages);
  const [input, setInput] = useState('');
  const [showContext, setShowContext] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((msgs) => [
      ...msgs,
      { role: 'user', text: input, source: '', context: '' },
      {
        role: 'bot',
        text: 'This is a mock answer. (Replace with real API call)',
        source: 'Q&A',
        context: 'Sample context from NCERT or retrieved docs.',
      },
    ]);
    setInput('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 px-2 py-4">
      <div className="max-w-2xl mx-auto flex flex-col flex-1 w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 space-y-4 h-[80vh]">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 text-center mb-2">Lore Chatbot</h2>
        <div className="flex-1 overflow-y-auto space-y-4 pb-2">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-2 rounded-2xl shadow ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-md'}`}>
                <div>{msg.text}</div>
                {msg.role === 'bot' && (
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Source:</span> {msg.source}
                    <button
                      className="ml-2 underline text-blue-500 hover:text-blue-700"
                      onClick={() => setShowContext((v) => !v)}
                    >
                      {showContext ? 'Hide Context' : 'Show Context'}
                    </button>
                    {showContext && (
                      <div className="mt-1 bg-gray-50 dark:bg-gray-800 p-2 rounded text-xs border border-gray-200 dark:border-gray-600">
                        {msg.context}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={handleSend} className="flex gap-2 mt-2">
          <input
            type="text"
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Ask a biology question..."
            value={input}
            onChange={e => setInput(e.target.value)}
            autoFocus
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-colors duration-200"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot; 