
'use client';
import React, { useState, useRef, useEffect } from 'react';

const Terminal = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  const [isThinking, setIsThinking] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const [userId, setUserId] = useState('');

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setOutput([
      'Bem-vindo ao meu site! Fale comigo.',
    ]);
    setUserId(Math.random().toString(36).substring(7));
  }, []);

  const handleInputKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newOutput = [...output, `kayque-site ~ % ${input}`];
      setOutput(newOutput);
      setInput('');
      setIsThinking(true);

      const newHistory = [...history, input];
      setHistory(newHistory);

      try {
        const response = await fetch('/api/gemini', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: newHistory.join('\n'), userId }),
        });

        if (!response.ok) {
          setOutput([...newOutput, `Error: Something went wrong.`]);
          return;
        }

        const data = await response.json();
        const geminiResponse = data.message;

        setOutput([...newOutput, `${geminiResponse}`]);
        setHistory([...newHistory, geminiResponse]);
      } catch (error) {
        if (error instanceof Error) {
          setOutput([...newOutput, `Error: ${error.message}`]);
        }
      } finally {
        setIsThinking(false);
      }
    }
  };

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [output]);

  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div
      className="w-full h-[600px] bg-[#282a36] text-white font-mono rounded-lg shadow-lg flex flex-col"
      onClick={handleTerminalClick}
    >
      <div className="flex items-center justify-between bg-[#21222c] p-2 rounded-t-lg">
        <div className="flex items-center w-20">
          <span className="h-3 w-3 bg-red-500 rounded-full mr-2"></span>
          <span className="h-3 w-3 bg-yellow-500 rounded-full mr-2"></span>
          <span className="h-3 w-3 bg-green-500 rounded-full"></span>
        </div>
        <div className="text-sm text-center">zsh</div>
        <div className="w-20"></div>
      </div>
      <div ref={terminalBodyRef} className="p-4 flex-grow overflow-y-auto">
        {output.map((line, index) => (
          <div
            key={index}
            className={line.startsWith('Gemini:') ? 'text-purple-400' : ''}
          >
            {line}
          </div>
        ))}
        {isThinking && <div className="text-purple-400">Gemini is thinking...</div>}
        <div className="flex items-center">
          <span className="text-cyan-400 pr-2 whitespace-nowrap">kayque-site</span>
          <span className="text-gray-500"> in </span>
          <span className="text-yellow-400">~</span>
          <span className="text-green-400"> took </span>
          <span className="text-gray-500">1s</span>
          <span className="text-red-500"> ❯ </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className="bg-transparent outline-none w-full ml-2"
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;
