
import { SectionHeader } from '@/components/SectionHeader';
import { resumeData } from '@/lib/content';
import { MotionFade } from '@/components/MotionFade';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ResumePage() {
  return (
    <MotionFade>
      <div className="space-y-16 max-w-4xl mx-auto">
        <SectionHeader title="Professional Timeline" />

        <div className="space-y-12">
          <div>
            <h2 className="text-2xl font-headline font-bold mb-6 text-center">Experience</h2>
            <div className="space-y-12">
              {resumeData.experience.map((job) => (
                <div key={job.company} className="relative pl-8">
                  <div className="absolute left-0 top-1 h-full w-px bg-border"></div>
                  <div className="absolute left-[-5px] top-1 h-3 w-3 rounded-full bg-accent"></div>

                  <div className="mb-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-xl font-headline font-bold text-foreground">{job.role}</h3>
                    <p className="text-sm text-muted-foreground">{job.period}</p>
                  </div>
                  <p className="text-md font-medium text-foreground/80 mb-4">{job.company}</p>

                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {job.description.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-headline font-bold mb-6 text-center">Education</h2>
            {resumeData.education.map((edu) => (
              <Card key={edu.school} className="bg-card border-border">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl font-headline">{edu.degree}</CardTitle>
                      <p className="text-muted-foreground">{edu.school}</p>
                    </div>
                    <p className="text-muted-foreground">{edu.year}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{edu.details}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div>
            <h2 className="text-2xl font-headline font-bold mb-6 text-center">Skills</h2>
            <div className="flex flex-wrap justify-center gap-2">
              {resumeData.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-lg py-1 px-4">{skill}</Badge>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-headline font-bold mb-6 text-center">Achievements</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground max-w-2xl mx-auto">
              {resumeData.achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </MotionFade>
  );
}
