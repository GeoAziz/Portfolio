
'use client';

import { MotionFade } from '@/components/MotionFade';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function SplashPage() {
    const router = useRouter();
    const [autoRedirect, setAutoRedirect] = useState(true);

    // Check if user has seen splash before
    useEffect(() => {
        const hasSeenSplash = localStorage.getItem('hasSeenSplash');
        if (hasSeenSplash === 'true') {
            router.push('/');
            return;
        }

        const header = document.querySelector('header');
        const footer = document.querySelector('footer');
        if (header) header.style.display = 'none';
        if (footer) footer.style.display = 'none';

        // Auto redirect after 3 seconds if not skipped
        const timer = setTimeout(() => {
            if (autoRedirect) {
                localStorage.setItem('hasSeenSplash', 'true');
                router.push('/');
            }
        }, 3000);

        return () => {
            clearTimeout(timer);
            if (header) header.style.display = '';
            if (footer) footer.style.display = '';
        }
    }, [router, autoRedirect]);

    const handleSkip = () => {
        setAutoRedirect(false);
        localStorage.setItem('hasSeenSplash', 'true');
        router.push('/');
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
            {/* Skip Button */}
            <Button
                variant="ghost"
                size="icon"
                onClick={handleSkip}
                className="absolute top-8 right-8 z-50 rounded-full hover:bg-accent/20"
                aria-label="Skip splash"
            >
                <X className="h-6 w-6" />
            </Button>

            <MotionFade className="w-full">
                <div className="flex flex-col items-center text-center space-y-8 px-4">
                    <div className="flex items-center space-x-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 256 256"
                            className="h-12 w-12 md:h-16 md:w-16 fill-foreground"
                        >
                            <path d="M128,24a104,104,0,1,0,104,104A104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a48,48,0,1,1-48-48A48.05,48.05,0,0,1,176,128Z" />
                        </svg>
                        <h1 className="font-headline text-4xl md:text-6xl font-bold">
                            Personal OS
                        </h1>
                    </div>

                    <p className="text-xl md:text-2xl text-muted-foreground">
                        A futuristic engineer-builder with human depth.
                    </p>

                    <Button 
                        asChild 
                        size="lg" 
                        className="bg-accent text-accent-foreground hover:bg-accent/90"
                        onClick={() => localStorage.setItem('hasSeenSplash', 'true')}
                    >
                        <Link href="/">Enter Universe</Link>
                    </Button>
                    
                    <p className="text-xs text-muted-foreground/60 mt-4">
                        Auto-redirecting in 3 seconds...
                    </p>
                </div>
            </MotionFade>
        </div>
    );
}
