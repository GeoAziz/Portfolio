// Server component: perform content audit on the server to avoid importing server-only libs in a client bundle
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MotionFade } from '@/components/MotionFade';
import { AlertCircle, CheckCircle, FileText, Tag, Layers } from 'lucide-react';
import { getBlogPosts } from '@/lib/blog';
import { getResearchEntries } from '@/lib/research';
import { getAllProjects } from '@/lib/projects';
import { calculateReadingTime, getContentStats } from '@/lib/content-utils';

interface ContentAudit {
  type: 'blog' | 'research' | 'project';
  title: string;
  issues: string[];
  warnings: string[];
}

// Run audit server-side synchronously
export default function AdminContentPage() {
  const auditResults: ContentAudit[] = [];

  // Audit blog posts
  const blogs = getBlogPosts();
  blogs.forEach(post => {
    const issues: string[] = [];
    const warnings: string[] = [];

    if (!post.title) issues.push('Missing title');
    if (!post.date) issues.push('Missing date');
    if (!post.summary) issues.push('Missing summary');
    if (!post.tags || post.tags.length === 0) warnings.push('No tags');
    if (!post.featured && post.featured !== false) warnings.push('Featured status not set');

    if (issues.length > 0 || warnings.length > 0) {
      auditResults.push({
        type: 'blog',
        title: post.title || 'Unnamed blog post',
        issues,
        warnings,
      });
    }
  });

  const enrichedBlogs = blogs.map(b => ({
    ...b,
    readingTime: calculateReadingTime(b.content || ''),
  }));

  // Audit research
  const research = getResearchEntries();
  research.forEach(entry => {
    const issues: string[] = [];
    const warnings: string[] = [];

    if (!entry.title) issues.push('Missing title');
    if (!entry.publication) issues.push('Missing publication');
    if (!entry.date) issues.push('Missing date');
    if (!entry.authors || entry.authors.length === 0) issues.push('No authors');
    if (!entry.abstract) warnings.push('Missing abstract');

    if (issues.length > 0 || warnings.length > 0) {
      auditResults.push({
        type: 'research',
        title: entry.title || 'Unnamed research',
        issues,
        warnings,
      });
    }
  });

  // Audit projects
  const projects = getAllProjects();
  projects.forEach(proj => {
    const issues: string[] = [];
    const warnings: string[] = [];

    if (!proj.title) issues.push('Missing title');
    if (!proj.summary) issues.push('Missing summary');
    if (!proj.tech || proj.tech.length === 0) issues.push('No technologies');
    if (!proj.category) warnings.push('No category');

    if (issues.length > 0 || warnings.length > 0) {
      auditResults.push({
        type: 'project',
        title: proj.title || 'Unnamed project',
        issues,
        warnings,
      });
    }
  });

  const stats = {
    blog: getContentStats(enrichedBlogs),
    research: getContentStats(research),
    projects: getContentStats(projects),
  };

  const audits = auditResults;

  const issueCount = audits.reduce((sum, a) => sum + a.issues.length, 0);
  const warningCount = audits.reduce((sum, a) => sum + a.warnings.length, 0);

  return (
    <MotionFade>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Content Management</h1>
          <p className="text-muted-foreground mt-2">Audit and manage all site content</p>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Issues</p>
                <p className={`text-3xl font-bold ${issueCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                  {issueCount}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Warnings</p>
                <p className={`text-3xl font-bold ${warningCount > 0 ? 'text-yellow-600 dark:text-yellow-400' : 'text-foreground'}`}>
                  {warningCount}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Blog Posts</p>
                <p className="text-3xl font-bold text-foreground">{stats?.blog?.total || 0}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Avg Reading Time</p>
                <p className="text-3xl font-bold text-foreground">{Math.round(stats?.blog?.avgReadingTime || 0)} min</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Type Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          {stats?.blog && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Blog Posts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-bold">{stats.blog.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Featured</span>
                  <span className="font-bold">{stats.blog.featured}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Read Time</span>
                  <span className="font-bold">{Math.round(stats.blog.avgReadingTime)} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tags</span>
                  <span className="font-bold">{stats.blog.tags}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {stats?.research && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  Research
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-bold">{stats.research.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Categories</span>
                  <span className="font-bold">{stats.research.categories}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {stats?.projects && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-bold">{stats.projects.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Featured</span>
                  <span className="font-bold">{stats.projects.featured}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Audit Results */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Content Audit</h2>

          {audits.length === 0 ? (
            <Card className="bg-green-500/10 border-green-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <p className="text-green-600 dark:text-green-400 font-medium">All content metadata is valid!</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {audits.map((audit, idx) => (
                <Card key={idx} className="bg-card border-border">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold text-foreground">{audit.title}</p>
                          <p className="text-xs text-muted-foreground capitalize">{audit.type}</p>
                        </div>
                      </div>

                      {audit.issues.length > 0 && (
                        <div className="space-y-2">
                          {audit.issues.map((issue, i) => (
                            <div key={i} className="flex items-start gap-2 text-red-600 dark:text-red-400">
                              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{issue}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {audit.warnings.length > 0 && (
                        <div className="space-y-2">
                          {audit.warnings.map((warning, i) => (
                            <div key={i} className="flex items-start gap-2 text-yellow-600 dark:text-yellow-400">
                              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{warning}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </MotionFade>
  );
}
