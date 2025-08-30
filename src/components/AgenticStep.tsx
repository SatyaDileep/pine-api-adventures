import React, { useState } from 'react';

interface AgenticStepProps {
  stepTitle: string;
  stepDescription: string;
  sampleData: any;
  onComplete: () => void;
}

export const AgenticStep: React.FC<AgenticStepProps> = ({
  stepTitle,
  stepDescription,
  sampleData,
  onComplete,
}) => {
  const [phase, setPhase] = useState<'details' | 'test' | 'complete'>('details');
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState<string | null>(null);

  const handleTest = () => {
    // Simulate agentic response (replace with real logic)
    setTestOutput(`Agent response to: ${testInput}`);
    setPhase('complete');
  };

  return (
    <div className="agentic-step border rounded-lg p-4 shadow-md bg-white max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-2">{stepTitle}</h2>
      {phase === 'details' && (
        <div>
          <p className="mb-4">{stepDescription}</p>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setPhase('test')}
          >
            Try with Sample Data
          </button>
        </div>
      )}
      {phase === 'test' && (
        <div className="test-phase">
          <div className="mb-2">
            <span className="font-semibold">Sample Data:</span>
            <pre className="bg-gray-100 p-2 rounded text-sm mt-1">{JSON.stringify(sampleData, null, 2)}</pre>
          </div>
          <div className="mb-2">
            <input
              type="text"
              className="border px-2 py-1 rounded w-full"
              placeholder="Type your test input..."
              value={testInput}
              onChange={e => setTestInput(e.target.value)}
            />
          </div>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleTest}
            disabled={!testInput}
          >
            Test Step
          </button>
        </div>
      )}
      {phase === 'complete' && (
        <div className="complete-phase">
          <div className="mb-2">
            <span className="font-semibold">Agent Output:</span>
            <div className="bg-gray-100 p-2 rounded text-sm mt-1">{testOutput}</div>
          </div>
          <button
            className="bg-purple-500 text-white px-4 py-2 rounded"
            onClick={onComplete}
          >
            Complete Step
          </button>
        </div>
      )}
    </div>
  );
};
