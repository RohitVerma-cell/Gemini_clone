import React, { useState } from 'react';
import Answer from './components/Answer'; 
const API_KEY = 'AIzaSyBFB9VxqIEMmW5n734xe9ggvf7s1nFGfGc';
const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

function App() {
  const [question, SetQuestion] = useState('');
  const [result, SetResult] = useState([]);
  const [history, setHistory] = useState([]); 

  const Askquestion = async () => {
    if (!question.trim()) return;

    const Payload = {
      contents: [
        {
          parts: [{ text: question }],
        },
      ],
    };

    let response = await fetch(URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Payload),
    });

    response = await response.json();

    let dataString = response.candidates[0]?.content?.parts[0]?.text || '';
    const splitAnswers = dataString.split('* ').map((item) => item.trim()).filter(Boolean);

    const newChat = [
      { type: 'q', text: question },
      { type: 'a', text: splitAnswers },
    ];

    SetResult((prev) => [...prev, ...newChat]);

    // Save in history
    setHistory((prev) => [...prev, { id: Date.now(), title: question, chat: newChat }]);

    SetQuestion('');
  };

  const loadHistory = (chat) => {
    SetResult(chat);
  };

  const clearHistory = () => {
    setHistory([]);
    SetResult([]);
  };

  return (
    <div className='grid grid-cols-5 h-screen text-center'>
      {/* Sidebar */}
      <div className='col-span-1 bg-zinc-800 p-4 flex flex-col justify-between text-left text-white overflow-auto'>
        <div>
          <h2 className='text-xl font-bold mb-4'>History</h2>
          {history.map((item) => (
            <button
              key={item.id}
              onClick={() => loadHistory(item.chat)}
              className='block w-full text-left p-2 mb-2 bg-zinc-700 rounded hover:bg-zinc-600 transition'
            >
              {item.title.length > 30 ? item.title.slice(0, 30) + '...' : item.title}
            </button>
          ))}
        </div>
        <button
          onClick={clearHistory}
          className='bg-red-600 hover:bg-red-500 text-white p-2 rounded transition mt-4'
        >
          Clear History
        </button>
      </div>

      {/* Chat Area */}
      <div className='col-span-4 p-10 flex flex-col justify-between'>
        <div className='text-zinc-200 overflow-auto max-h-[80vh] scroll-smooth transition-all duration-500'>
          <ul className='space-y-2'>
            {result.map((item, index) => {
              if (item.type === 'q') {
                return (
                  <li
                    key={index + Math.random()}
                    className='text-right pr-4 bg-zinc-700 border-zinc-700 rounded-3xl w-fit ml-auto p-2 transition-all duration-300'
                  >
                    <Answer ans={item.text} index={index} totalresult={1} />
                  </li>
                );
              } else {
                return item.text.map((ansItem, ansIndex) => (
                  <li
                    key={ansIndex + Math.random()}
                    className='text-left p-2 bg-zinc-900 rounded-xl w-fit transition-all duration-300 animate-fadeIn'
                  >
                    <Answer ans={ansItem} index={ansIndex} totalresult={item.text.length} />
                  </li>
                ));
              }
            })}
          </ul>
        </div>

        {/* Input */}
        <div className='bg-zinc-800 w-1/2 p-1 pr-5 text-white m-auto rounded-3xl border border-zinc-400 flex h-16'>
          <input
            type='text'
            value={question}
            onChange={(event) => SetQuestion(event.target.value)}
            placeholder='Ask anything...'
            className='w-full h-full p-3 outline-none bg-transparent'
          />
          <button
            onClick={Askquestion}
            className='px-4  hover:text-zinc-600   transition'
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;



