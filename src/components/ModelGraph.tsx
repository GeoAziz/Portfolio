
'use client';

import { motion } from 'framer-motion';

const nodes: { [key: string]: { x: number; y: number; label: string } } = {
  input: { x: 50, y: 200, label: 'User Input' },
  prompt: { x: 250, y: 200, label: 'Prompt Layer' },
  model: { x: 450, y: 200, label: 'Model' },
  embeddings: { x: 650, y: 100, label: 'Embeddings' },
  memory: { x: 650, y: 300, label: 'Memory' },
  output: { x: 850, y: 200, label: 'Output' },
};

const edges = [
  { from: 'input', to: 'prompt' },
  { from: 'prompt', to: 'model' },
  { from: 'model', to: 'embeddings' },
  { from: 'model', to: 'memory' },
  { from: 'embeddings', to: 'output' },
  { from: 'memory', to: 'output' },
];

export function ModelGraph() {
  return (
    <div className="w-full max-w-5xl mx-auto bg-card/50 backdrop-blur-sm border border-border/20 rounded-lg p-6">
      <svg viewBox="0 0 900 400" className="w-full h-full">
        {/* Edges */}
        {edges.map((edge, i) => (
          <motion.path
            key={i}
            d={`M${nodes[edge.from].x},${nodes[edge.from].y} L${nodes[edge.to].x},${nodes[edge.to].y}`}
            stroke="rgba(0, 255, 255, 0.3)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: i * 0.2 }}
          />
        ))}

        {/* Nodes */}
        {Object.values(nodes).map((node, i) => (
          <g key={i}>
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="10"
              fill="rgba(0, 255, 255, 0.8)"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
            />
            <motion.text
              x={node.x}
              y={node.y - 20}
              textAnchor="middle"
              fill="#fff"
              fontSize="14"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
            >
              {node.label}
            </motion.text>
          </g>
        ))}
      </svg>
    </div>
  );
}
