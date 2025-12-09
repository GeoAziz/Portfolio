
'use client';

import { motion } from 'framer-motion';

interface ExampleOutputProps {
  prompt: string;
  modelReasoning: string;
  response: string;
}

export function ExampleOutput({ prompt, modelReasoning, response }: ExampleOutputProps) {
  const isCode = response.startsWith('```');

  return (
    <motion.div
      className="bg-card/40 backdrop-blur-sm border border-border/10 rounded-lg p-6 text-left space-y-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div>
        <p className="font-mono text-sm text-muted-foreground">Prompt:</p>
        <p className="text-foreground">{prompt}</p>
      </div>
      <div>
        <p className="font-mono text-sm text-muted-foreground">Model Reasoning:</p>
        <p className="text-foreground text-sm italic">{modelReasoning}</p>
      </div>
      <div>
        <p className="font-mono text-sm text-muted-foreground">Response:</p>
        {isCode ? (
          <pre className="bg-background/80 border border-border/30 rounded-md p-4 text-foreground font-mono text-sm whitespace-pre-wrap">
            <code>{response.replace(/```python\n|```/g, '')}</code>
          </pre>
        ) : (
          <p className="text-foreground">{response}</p>
        )}
      </div>
    </motion.div>
  );
}
