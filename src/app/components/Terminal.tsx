'use client';
import React, { useState, useRef, useEffect } from 'react';

import Prompt from './Prompt';

const Terminal = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<any[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null); // Changed to HTMLTextAreaElement
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  const [isThinking, setIsThinking] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => { // Changed event type
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

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'; // Reset height
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px'; // Set to scroll height
    }
  }, [input]);

  const handleInputKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => { // Changed event type
    if (e.key === 'Enter' && !e.shiftKey) { // Added !e.shiftKey to allow Shift+Enter for new lines
      e.preventDefault(); // Prevent default Enter behavior (new line in textarea)
      const newOutput = [...output, { type: 'prompt', input }];
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
        {output.map((line, index) => {
          if (typeof line === 'string') {
            return <div key={index} className={line.startsWith('Kayque:') ? 'text-purple-400' : ''}>{line}</div>;
          } else if (line.type === 'prompt') {
            return <Prompt key={index} input={line.input} />;
          }
          return null;
        })}
        {isThinking && <div className="text-purple-400">Kayque is thinking...</div>}
        <div>
          <Prompt input="" />
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className="bg-transparent outline-none w-full resize-none"
            rows={1}
            style={{ overflowY: 'hidden', wordBreak: 'break-all' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;