
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const models = [
  "Astreaus-Alpha",
  "Atlas-32B",
  "Vision-Embedder V2",
  'Cognitive Agent "MIND"',
];

export function InteractiveModelDemo() {
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    // In a real scenario, you would make an API call here.
    // For this demo, we'll use static responses.
    const staticResponses: { [key: string]: { [key: string]: string } } = {
      "Astreaus-Alpha": {
        "How many different protocols exist for IoT networking?": "The model enumerated 12 core protocols grouped by reliability & power constraints...",
      },
      "Atlas-32B": {
        "How many different protocols exist for IoT networking?": "Based on a comprehensive review of academic and industry literature, there are over 50 protocols that could be considered for IoT networking, but they can be broadly categorized into the following key families...",
      },
      "Vision-Embedder V2": {
        "A picture of a cat": "embedding: [0.123, 0.456, ...]",
      },
      'Cognitive Agent "MIND"': {
        "What are the ethical implications of using AI in hiring?": "The use of AI in hiring presents a complex ethical landscape. While it can reduce human bias, it also risks introducing new, algorithmic biases...",
      },
    };

    const response =
      staticResponses[selectedModel]?.[prompt] ||
      "I'm sorry, I don't have a pre-recorded response for that prompt and model combination.";

    // Simulate typing animation
    let i = 0;
    const typingInterval = setInterval(() => {
      setOutput(response.substring(0, i));
      i++;
      if (i > response.length) {
        clearInterval(typingInterval);
        setIsGenerating(false);
      }
    }, 20);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-card/50 backdrop-blur-sm border border-border/20 rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <label htmlFor="prompt" className="block text-sm font-medium text-muted-foreground mb-2">
              Enter a prompt:
            </label>
            <div className="relative">
              <input
                type="text"
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-background/80 border border-border/30 rounded-md px-4 py-2 text-foreground font-mono focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="e.g., How many different protocols exist for IoT networking?"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <motion.div
                  animate={{ opacity: isGenerating ? [0.5, 1, 0.5] : 0 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2 h-4 bg-cyan-400 rounded-full"
                />
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-muted-foreground mb-2">
              Select a model:
            </label>
            <select
              id="model"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full bg-background/80 border border-border/30 rounded-md px-4 py-2 text-foreground font-mono focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              {models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>
          <div className="self-end">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-600"
            >
              {isGenerating ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-muted-foreground mb-2">Output:</label>
          <div className="bg-background/80 border border-border/30 rounded-md p-4 min-h-[100px] text-foreground font-mono">
            {output}
            <motion.div
              animate={{ opacity: isGenerating ? [0, 1, 0] : 0 }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
              className="inline-block w-2 h-4 bg-cyan-400 rounded-full ml-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
