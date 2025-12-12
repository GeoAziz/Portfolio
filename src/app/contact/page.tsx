'use client';

import { ContactForm } from '@/components/ContactForm';
import { SectionHeader } from '@/components/SectionHeader';
import { MotionFade } from '@/components/MotionFade';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MessageSquare, Clock, Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      description: 'Fastest way to reach me',
      value: 'contact@geoaziz.dev',
      href: 'mailto:contact@geoaziz.dev',
    },
    {
      icon: Github,
      title: 'GitHub',
      description: 'Check out my projects',
      value: '@GeoAziz',
      href: 'https://github.com/GeoAziz',
    },
    {
      icon: Linkedin,
      title: 'LinkedIn',
      description: 'Professional network',
      value: 'Geo Aziz',
      href: 'https://linkedin.com/in/geoaziz',
    },
    {
      icon: Twitter,
      title: 'Twitter/X',
      description: 'Share ideas and updates',
      value: '@GeoAzizDev',
      href: 'https://twitter.com/GeoAzizDev',
    },
  ];

  return (
    <MotionFade>
      <div className="space-y-16">
        {/* Header */}
        <div className="space-y-4">
          <SectionHeader title="Get in Touch" />
          <p className="text-lg text-muted-foreground max-w-2xl">
            Have a question or project idea? Let's talk! I'm always interested in learning about new projects and opportunities. Feel free to reach out with any inquiries.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Send me a message</h2>
                <p className="text-muted-foreground">
                  Fill out the form below and I'll get back to you as soon as possible.
                </p>
              </div>

              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <ContactForm />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Methods Sidebar */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4">Other ways to connect</h3>
              <div className="space-y-4">
                {contactMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <Link
                      key={method.title}
                      href={method.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group"
                    >
                      <Card className="bg-card border-border hover:border-accent transition-colors">
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            <Icon className="w-5 h-5 text-accent mt-1 flex-shrink-0 group-hover:text-accent-research transition-colors" />
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground text-sm">{method.title}</p>
                              <p className="text-xs text-muted-foreground">{method.description}</p>
                              <p className="text-sm font-mono text-accent mt-2 truncate group-hover:text-accent-research">
                                {method.value}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Response Time */}
            <Card className="bg-blue-500/10 border-blue-500/20">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-blue-600 dark:text-blue-400 text-sm">
                      Response Time
                    </p>
                    <p className="text-xs text-blue-600/80 dark:text-blue-400/80 mt-1">
                      I typically respond to messages within 24 hours, sometimes faster.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Message Guidelines */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Message Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <ul className="space-y-2">
                  <li className="flex gap-2">
                    <span className="text-accent font-bold">✓</span>
                    <span>Be clear about your inquiry</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent font-bold">✓</span>
                    <span>Include relevant details</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent font-bold">✓</span>
                    <span>Check spam folder for replies</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent font-bold">✓</span>
                    <span>Include your contact info</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Availability Section */}
        <Card className="bg-gradient-to-r from-accent/10 to-accent-research/10 border-accent/20">
          <CardContent className="pt-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">Open to Opportunities</h3>
                <p className="text-muted-foreground mb-4">
                  I'm always interested in:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-accent">→</span>
                    <span>Collaborative projects & partnerships</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">→</span>
                    <span>Technical consulting & architecture</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">→</span>
                    <span>Speaking engagements & workshops</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent">→</span>
                    <span>Research & technical writing</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">My Interests</h3>
                <p className="text-muted-foreground mb-4">
                  I focus on:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-accent-research">→</span>
                    <span>Systems design & distributed computing</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent-research">→</span>
                    <span>AI ethics & responsible AI</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent-research">→</span>
                    <span>Performance optimization & hardware acceleration</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent-research">→</span>
                    <span>Complexity science & emergent systems</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MotionFade>
  );
}
