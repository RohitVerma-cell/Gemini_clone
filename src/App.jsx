import React, { useState, useRef, useEffect } from 'react';
import Answer from './components/Answer';
const Key = import.meta.env.VITE_API_KEY;

const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${Key}`;

function App() {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState([]);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [result]);

  const askQuestion = async () => {
    if (!question.trim()) return;
    setIsLoading(true);

    const payload = {
      contents: [{ parts: [{ text: question }] }],
    };

    try {
      const res = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const splitAnswers = text.split('* ').map((item) => item.trim()).filter(Boolean);

      const newChat = [
        { type: 'q', text: question },
        { type: 'a', text: splitAnswers },
      ];

      setResult((prev) => [...prev, ...newChat]);
      setHistory((prev) => [...prev, { id: Date.now(), title: question, chat: newChat }]);
      setQuestion('');
    } catch (err) {
      console.error('API Error:', err);
      alert('Something went wrong. Try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadHistory = (chat) => {
    setResult(chat);
    setShowSidebar(false); // close sidebar on mobile
  };

  const clearHistory = () => {
    setHistory([]);
    setResult([]);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-black text-white">
      {/* Mobile Sidebar Toggle Button */}
      <div className="md:hidden flex justify-between items-center p-4 bg-zinc-900">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="bg-zinc-700 px-4 py-2 rounded"
        >
          {showSidebar ? 'Close' : 'History'}
        </button>
        <h1 className="text-lg font-bold">Gemini Chat</h1>
      </div>

      {/* Sidebar */}
      <div
        className={`bg-zinc-800 p-4 text-left overflow-auto md:static fixed top-0 left-0 h-full z-10 w-64 transition-transform duration-300 md:translate-x-0 ${
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        } md:block`}
      >
        <h2 className="text-xl font-bold mb-4">History</h2>
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => loadHistory(item.chat)}
            className="block w-full text-left p-2 mb-2 bg-zinc-700 rounded hover:bg-zinc-600 transition"
          >
            {item.title.length > 30 ? item.title.slice(0, 30) + '...' : item.title}
          </button>
        ))}
        <button
          onClick={clearHistory}
          className="bg-red-600 hover:bg-red-500 text-white p-2 rounded transition mt-4"
        >
          Clear History
        </button>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col justify-between p-4 md:p-10 relative">
        {/* Chat List */}
        <div
          className={`overflow-auto ${
            result.length === 0 ? 'flex-1 flex items-center justify-center' : 'max-h-[80vh]'
          }`}
        >
          {result.length === 0 ? (
            <p className="text-zinc-400 text-xl">Ask something to get started</p>
          ) : (
            <ul className="space-y-2 text-zinc-200">
              {result.map((item, index) =>
                item.type === 'q' ? (
                  <li
                    key={`q-${index}`}
                    className="text-right pr-4 bg-zinc-700 border-zinc-700 rounded-3xl w-fit ml-auto p-2 transition-all duration-300"
                  >
                    <Answer ans={item.text} index={index} totalresult={1} />
                  </li>
                ) : (
                  item.text.map((ansItem, ansIndex) => (
                    <li
                      key={`a-${index}-${ansIndex}`}
                      className="text-left p-2 bg-zinc-900 rounded-xl w-fit transition-all duration-300 animate-fadeIn"
                    >
                      <Answer ans={ansItem} index={ansIndex} totalresult={item.text.length} />
                    </li>
                  ))
                )
              )}
              <div ref={chatEndRef} />
            </ul>
          )}
        </div>

        {/* Input Bar */}
        <div className="bg-zinc-800 w-full md:w-1/2 p-1 pr-3 text-white mx-auto rounded-3xl border border-zinc-400 flex h-14 mt-4">
          <input
            type="text"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask anything..."
            className="w-full h-full px-4 py-2 text-sm md:text-base bg-transparent outline-none"
            onKeyDown={(e) => e.key === 'Enter' && askQuestion()}
            disabled={isLoading}
          />
          <button
            onClick={askQuestion}
            disabled={isLoading}
            className={`px-4 text-sm md:text-base transition ${
              isLoading ? 'text-zinc-500' : 'hover:text-zinc-400'
            }`}
          >
            {isLoading ? (
              <span className="animate-spin inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full"></span>
            ) : (
              'Ask'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;


