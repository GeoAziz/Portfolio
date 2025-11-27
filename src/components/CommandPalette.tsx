
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { FileText, Laptop, Cpu, FlaskConical, Github, User, Home } from 'lucide-react';
import { projectsData, hardwareData } from '@/lib/content';

const pages = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Systems', path: '/systems', icon: Laptop },
  { name: 'AI', path: '/ai', icon: Cpu },
  { name: 'Hardware', path: '/hardware', icon: Cpu },
  { name: 'Research', path: '/research', icon: FlaskConical },
  { name: 'Open Source', path: '/open-source', icon: Github },
  { name: 'Resume', path: '/resume', icon: User },
];

const allProjects = [
  ...projectsData.map(p => ({ name: p.name, group: p.category, path: `/${p.category.toLowerCase().replace(' ', '-')}` })),
  ...hardwareData.map(p => ({ name: p.name, group: 'Hardware', path: '/hardware' })),
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => unknown) => {
    setOpen(false);
    command();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0 shadow-lg bg-card border-border">
      <DialogTitle className="sr-only">Command Palette</DialogTitle>
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Pages">
              {pages.map(page => (
                <CommandItem
                  key={page.path}
                  onSelect={() => runCommand(() => router.push(page.path))}
                  value={`page-${page.path}`}
                >
                  <page.icon className="mr-2 h-4 w-4" />
                  <span>{page.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Projects">
              {allProjects.map(project => (
                <CommandItem
                  key={`${project.group}-${project.name}`}
                  onSelect={() => runCommand(() => router.push(project.path))}
                  value={`project-${project.name}`}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <span>{project.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{project.group}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
