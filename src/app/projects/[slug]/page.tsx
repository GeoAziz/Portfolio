import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getProjectBySlug, getAllProjects, getRelatedProjects, generateSlug } from '@/lib/projects';
import { MotionFade } from '@/components/MotionFade';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowUpRight, Github } from 'lucide-react';

interface ProjectDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The project you are looking for does not exist.',
    };
  }

  const description = project.summary || project.overview.substring(0, 160);

  return {
    title: `${project.title} | Projects`,
    description,
    keywords: project.keywords || project.tech,
    openGraph: {
      title: project.title,
      description,
      type: 'website',
      url: `/projects/${project.slug}`,
      images: project.image ? [`/images/projects/${project.image}.jpg`] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description,
      images: project.image ? [`/images/projects/${project.image}.jpg`] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map(project => ({
    slug: project.slug,
  }));
}

export default function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  const related = getRelatedProjects(params.slug, 3);

  return (
    <MotionFade>
      <div className="space-y-12">
        {/* Header with Back Button */}
        <div className="space-y-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">{project.category}</Badge>
              {project.featured && (
                <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                  Featured
                </Badge>
              )}
            </div>

            <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              {project.title}
            </h1>

            <p className="text-lg text-muted-foreground max-w-3xl">
              {project.summary}
            </p>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2 pt-4">
              {project.tech.map(tech => (
                <Badge key={tech} variant="outline" className="font-mono text-xs">
                  {tech}
                </Badge>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-6">
              {project.liveDemo && (
                <Button asChild>
                  <a href={project.liveDemo} target="_blank" rel="noopener noreferrer">
                    View Live Demo
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}
              {project.github && (
                <Button variant="outline" asChild>
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    View on GitHub
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Overview Section */}
        {project.overview && (
          <div className="border-t border-border/50 pt-12">
            <h2 className="font-headline text-2xl font-bold mb-6 text-foreground">
              Overview
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {project.overview}
              </p>
            </div>
          </div>
        )}

        {/* Features Section */}
        {project.features.length > 0 && (
          <div className="border-t border-border/50 pt-12">
            <h2 className="font-headline text-2xl font-bold mb-8 text-foreground">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.features.map((feature, idx) => (
                <Card key={idx} className="bg-card border-border hover:border-accent/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  {feature.impact && (
                    <CardContent>
                      <p className="text-sm text-accent font-semibold">
                        Impact: {feature.impact}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Architecture Section */}
        {project.architecture && project.architecture.description && (
          <div className="border-t border-border/50 pt-12">
            <h2 className="font-headline text-2xl font-bold mb-6 text-foreground">
              Architecture
            </h2>
            <div className="space-y-6">
              <div className="prose prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  {project.architecture.description}
                </p>
              </div>

              {project.architecture.components.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-foreground">
                    Key Components
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.architecture.components.map(component => (
                      <Badge key={component} variant="secondary">
                        {component}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {project.architecture.patterns.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-foreground">
                    Design Patterns
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.architecture.patterns.map(pattern => (
                      <Badge key={pattern} variant="outline">
                        {pattern}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results Section */}
        {project.results.length > 0 && (
          <div className="border-t border-border/50 pt-12">
            <h2 className="font-headline text-2xl font-bold mb-8 text-foreground">
              Results & Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.results.map((result, idx) => (
                <Card key={idx} className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-3xl font-bold text-accent">
                      {result.value}
                    </CardTitle>
                    <CardDescription className="text-base font-semibold text-foreground">
                      {result.metric}
                    </CardDescription>
                  </CardHeader>
                  {result.context && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {result.context}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Timeline Section */}
        {project.timeline.length > 0 && (
          <div className="border-t border-border/50 pt-12">
            <h2 className="font-headline text-2xl font-bold mb-8 text-foreground">
              Project Timeline
            </h2>
            <div className="space-y-6">
              {project.timeline.map((phase, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-accent/20 border border-accent flex items-center justify-center font-bold text-accent">
                      {idx + 1}
                    </div>
                    {idx < project.timeline.length - 1 && (
                      <div className="h-16 w-1 bg-border mt-2" />
                    )}
                  </div>
                  <div className="pt-2 pb-8">
                    <h3 className="text-lg font-semibold text-foreground">
                      {phase.phase}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {phase.duration}
                    </p>
                    <p className="text-muted-foreground">
                      {phase.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team Section */}
        {project.team && project.team.length > 0 && (
          <div className="border-t border-border/50 pt-12">
            <h2 className="font-headline text-2xl font-bold mb-8 text-foreground">
              Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.team.map((member, idx) => (
                <Card key={idx} className="bg-card border-border">
                  <CardHeader>
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription>{member.role}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Related Projects */}
        {related.length > 0 && (
          <div className="border-t border-border/50 pt-12">
            <h2 className="font-headline text-2xl font-bold mb-8 text-foreground">
              Related Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map(relProject => (
                <Link
                  key={relProject.slug}
                  href={`/projects/${relProject.slug}`}
                  className="block group"
                >
                  <Card className="bg-card border-border hover:border-accent/50 transition-colors h-full">
                    <CardHeader>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          {relProject.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg group-hover:text-accent transition-colors pt-2">
                        {relProject.title}
                      </CardTitle>
                      <CardDescription>
                        {relProject.summary}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {relProject.tech.slice(0, 3).map(tech => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {relProject.tech.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{relProject.tech.length - 3}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="border-t border-border/50 pt-12 flex justify-between items-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
          <span className="text-sm text-muted-foreground">
            {project.category} • {project.tech.length} technologies
          </span>
        </div>
      </div>
    </MotionFade>
  );
}
