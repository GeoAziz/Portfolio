'use client';

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MotionFade } from "@/components/MotionFade";

interface Philosophy {
    title: string;
    description: string;
}

interface CorePhilosophiesProps {
    philosophies: Philosophy[];
}

const CorePhilosophies: React.FC<CorePhilosophiesProps> = ({ philosophies }) => {
    return (
        <section className="max-w-5xl mx-auto py-12">
            <MotionFade delay={0.2}>
                <h2 className="text-2xl font-headline text-center text-primary mb-8">Core Tenets</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {philosophies.slice(0, 3).map((philosophy, index) => (
                        <Card key={index} className="bg-card border-border/50 hover:border-accent/80 transition-colors duration-300">
                            <CardHeader>
                                <CardTitle className="font-headline text-lg text-accent">{philosophy.title}</CardTitle>
                                <CardDescription className="pt-2 text-base">{philosophy.description}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </MotionFade>
        </section>
    );
};

export default CorePhilosophies;