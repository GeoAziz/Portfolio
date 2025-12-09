'use client';

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MotionFade } from "@/components/MotionFade";

interface ResearchArea {
    area: string;
    focus: string;
    keywords: string[];
}

interface ResearchHubProps {
    researchAreas: ResearchArea[];
}

const ResearchHub: React.FC<ResearchHubProps> = ({ researchAreas }) => {
    return (
        <section className="max-w-5xl mx-auto py-12">
            <MotionFade delay={0.3}>
                <h2 className="text-2xl font-headline text-center text-primary mb-8">Research Hub</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {researchAreas.map((item, index) => (
                        <Card key={index} className="bg-card border-border/50 hover:border-accent/80 transition-colors duration-300">
                            <CardHeader>
                                <CardTitle className="font-headline text-lg text-accent">{item.area}</CardTitle>
                                <CardDescription className="pt-2 text-base">{item.focus}</CardDescription>
                                <div className="flex flex-wrap gap-2 pt-4">
                                    {item.keywords.map(keyword => (
                                        <Badge key={keyword} variant="secondary" className="font-mono text-xs">
                                            {keyword}
                                        </Badge>
                                    ))}
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </MotionFade>
        </section>
    );
};

export default ResearchHub;
