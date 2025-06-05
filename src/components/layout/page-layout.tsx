'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/container';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import AcceptCookies from '@/components/accept-cookies';


interface PageLayoutProps {
    children: ReactNode;
    className?: string;
    fullWidth?: boolean;
}

export function PageLayout({
    children,
    className = '',
    fullWidth = false
}: PageLayoutProps) {
    return (
        <>
            <div className="flex min-h-screen flex-col">
                <Header />

                <motion.main
                    className={`flex-1 py-8 ${className}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.4,
                        ease: "easeInOut"
                    }}
                >
                    {fullWidth ? (
                        children
                    ) : (
                        <Container>{children}</Container>
                    )}
                </motion.main>

                <Footer />
            </div>
            <AcceptCookies />
        </>
    );
} 