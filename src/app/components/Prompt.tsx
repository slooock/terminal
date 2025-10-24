
import React from 'react';

const Prompt = ({ input }: { input: string }) => {
  return (
    <div className="flex items-center">
      <span className="text-cyan-400 pr-2 whitespace-nowrap">kayque-site</span>
      <span className="text-gray-500"> in </span>
      <span className="text-yellow-400">~</span>
      <span className="text-green-400"> took </span>
      <span className="ml-2">{input}</span>
    </div>
  );
};

export default Prompt;
