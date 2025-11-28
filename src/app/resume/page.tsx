
import { MotionFade } from '@/components/MotionFade';
import { SectionHeader } from '@/components/SectionHeader';
import { resumeData } from '@/lib/content';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Mail, Github } from 'lucide-react';

const Section = ({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) => (
  <section className={className}>
    <h2 className="text-2xl font-headline font-bold mb-8 text-center text-foreground/90">{title}</h2>
    {children}
  </section>
);

export default function ResumePage() {
  const { header, expertise, experience, projectsHighlight, education, recognition, contact, downloadable } = resumeData;

  return (
    <MotionFade>
      <div className="max-w-4xl mx-auto space-y-20">
        
        {/* Header */}
        <header className="text-center border-b border-border/50 pb-10">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground">{header.title}</h1>
          <p className="text-lg md:text-xl text-accent mt-2">{header.subtitle}</p>
          <p className="text-md text-muted-foreground max-w-2xl mx-auto mt-4">{header.statement}</p>
        </header>

        {/* Expertise */}
        <Section title="Core Expertise">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                <Card className="bg-card/50">
                    <CardHeader><CardTitle className="text-lg font-headline">Core Skills</CardTitle></CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {expertise.coreSkills.map(skill => <Badge variant="secondary" key={skill}>{skill}</Badge>)}
                    </CardContent>
                </Card>
                 <Card className="bg-card/50">
                    <CardHeader><CardTitle className="text-lg font-headline">Languages</CardTitle></CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {expertise.languages.map(lang => <Badge variant="outline" key={lang}>{lang}</Badge>)}
                    </CardContent>
                </Card>
                 <Card className="bg-card/50">
                    <CardHeader><CardTitle className="text-lg font-headline">Frameworks & Platforms</CardTitle></CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {expertise.frameworks.map(fw => <Badge variant="outline" key={fw}>{fw}</Badge>)}
                    </CardContent>
                </Card>
                 <Card className="bg-card/50">
                    <CardHeader><CardTitle className="text-lg font-headline">Tools & Environments</CardTitle></CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {expertise.tools.map(tool => <Badge variant="outline" key={tool}>{tool}</Badge>)}
                    </CardContent>
                </Card>
            </div>
        </Section>
        
        {/* Experience */}
        <Section title="Experience Timeline">
          <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-border/50">
            {experience.map((job) => (
              <div key={job.title} className="relative pl-12">
                 <div className="absolute left-[-2px] top-1 h-3 w-3 rounded-full bg-accent animate-pulse"></div>
                 <p className="text-sm text-muted-foreground -mt-1 mb-1">{job.period}</p>
                <h3 className="text-xl font-headline font-bold text-foreground">{job.title}</h3>
                <p className="text-muted-foreground mt-2">{job.description}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Project Highlights */}
        <Section title="Project Highlights">
            <div className="grid md:grid-cols-2 gap-6">
                {projectsHighlight.map(proj => (
                    <Card key={proj.name} className="bg-card text-left">
                        <CardHeader>
                            <CardTitle className="text-lg font-headline">{proj.name}</CardTitle>
                            <CardDescription>{proj.role}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm">{proj.impact}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </Section>

        {/* Education & Recognition */}
        <div className="grid md:grid-cols-2 gap-12">
            <Section title="Education">
                <Card className="bg-card/50 text-center h-full">
                    <CardHeader>
                        <CardTitle className="text-lg font-headline">{education.mode}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground text-sm italic">{education.notes}</p>
                    </CardContent>
                </Card>
            </Section>
            <Section title="Recognition">
                 <ul className="space-y-2 text-center">
                    {recognition.map(rec => (
                        <li key={rec} className="text-foreground/90 text-sm">{rec}</li>
                    ))}
                </ul>
            </Section>
        </div>


        {/* Contact & Availability */}
        <Section title="Contact & Collaboration">
          <Card className="bg-card/50 text-center">
             <CardContent className="p-6 space-y-4">
                <p className="text-accent font-semibold">{contact.availability}</p>
                <div className="flex justify-center gap-4">
                    {contact.preferredChannels.map(channel => {
                        let icon = null;
                        if (channel === 'GitHub') icon = <Github className="w-4 h-4 mr-2"/>;
                        if (channel === 'Email') icon = <Mail className="w-4 h-4 mr-2"/>
                        return (
                             <Button variant="secondary" key={channel} asChild>
                                <a href="#">{icon}{channel}</a>
                            </Button>
                        )
                    })}
                </div>
                <div className="pt-6">
                    <Button asChild>
                        <a href={downloadable.file} download>
                            <Download className="w-4 h-4 mr-2"/>
                            {downloadable.label}
                        </a>
                    </Button>
                </div>
             </CardContent>
          </Card>
        </Section>
      </div>
    </MotionFade>
  );
}
