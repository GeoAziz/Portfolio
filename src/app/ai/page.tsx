
import { ProjectInspector } from '@/components/ProjectInspector';
import { ProjectFilter } from '@/components/ProjectFilter';
import { SectionHeader } from '@/components/SectionHeader';
import { aiData } from '@/lib/content';
import { MotionFade } from '@/components/MotionFade';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { BrainCircuit, Cpu, FlaskConical, Microscope } from 'lucide-react';

export default function AiPage() {
  if (!aiData || !aiData.models || !aiData.experiments || !aiData.skills || !aiData.thoughtLog) {
    return null; // or a loading state
  }
  const { models, experiments, skills, thoughtLog } = aiData;
  return (
    <MotionFade>
      <div className="space-y-16">
        <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground flex items-center justify-center gap-4">
                <BrainCircuit className="w-10 h-10 text-accent-ai" /> AI / Machine Intelligence
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground">
                Explorations in language, reasoning & autonomous models.
            </p>
        </div>

        <section>
          <SectionHeader title="Model Gallery" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {models.map((model) => (
              <Dialog key={model.id}>
                <DialogTrigger asChild>
                   <Card className="bg-card border-border hover:border-accent-ai/50 transition-colors duration-300 text-left cursor-pointer h-full flex flex-col">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                           <CardTitle className="text-xl font-headline">{model.name}</CardTitle>
                           <Cpu className="w-6 h-6 text-accent-ai/80 flex-shrink-0" />
                        </div>
                        <CardDescription>{model.type}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow flex flex-col justify-between">
                         <p className="text-muted-foreground text-sm flex-grow">{model.description}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {model.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="font-mono text-xs">{tag}</Badge>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-headline">{model.name}</DialogTitle>
                    <DialogDescription>{model.type}</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4 text-sm">
                    <p>{model.description}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Parameters</h4>
                        <p className="text-muted-foreground">{model.parameters}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Framework</h4>
                        <p className="text-muted-foreground">{model.framework}</p>
                      </div>
                    </div>
                     <div>
                        <h4 className="font-semibold text-foreground mb-2">Strengths</h4>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                          {model.strengths?.map(s => <li key={s}>{s}</li>)}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Weaknesses</h4>
                         <ul className="list-disc list-inside text-muted-foreground space-y-1">
                          {model.weaknesses?.map(w => <li key={w}>{w}</li>)}
                        </ul>
                      </div>
                       <div>
                        <h4 className="font-semibold text-foreground mb-2">Sample Prompt</h4>
                        <code className="text-accent-ai bg-secondary p-2 rounded-md block text-xs">{model.sample_prompt}</code>
                      </div>
                       <div>
                        <h4 className="font-semibold text-foreground mb-2">Sample Output</h4>
                        <code className="text-muted-foreground bg-secondary p-2 rounded-md block text-xs">{model.sample_output}</code>
                      </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="AI Experiments" />
          <div className="mt-8">
            <ProjectFilter 
              projects={experiments}
              searchKeys={['title', 'method', 'observation']}
            >
              {(filteredProjects) => (
                <div className="grid gap-6 md:gap-8 mt-6">
                  {filteredProjects.map(project => (
                    <ProjectInspector key={project.title} project={project} />
                  ))}
                </div>
              )}
            </ProjectFilter>
          </div>
        </section>

        <section>
          <SectionHeader title="AI Competency Map" />
            <Card className="bg-card border-border mt-8">
                <CardContent className="p-6">
                <div className="flex flex-wrap justify-center gap-2">
                    {skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-md py-1 px-3 font-mono">{skill}</Badge>
                    ))}
                </div>
                </CardContent>
            </Card>
        </section>

        <section>
            <SectionHeader title="Thought Logs" />
            <div className="max-w-3xl mx-auto space-y-6 mt-8">
                {thoughtLog.map((log, index) => (
                    <div key={index} className="bg-card border border-border/50 rounded-lg p-4 text-sm relative">
                        <p className="absolute -top-3 left-4 bg-card px-2 text-xs text-muted-foreground">{log.date}</p>
                        <p className="text-foreground/90 italic">{log.entry}</p>
                    </div>
                ))}
            </div>
        </section>
      </div>
    </MotionFade>
  );
}
