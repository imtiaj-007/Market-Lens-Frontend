'use client'

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { BarChart4, Upload, Menu, X, LineChart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';

const Header: React.FC = () => {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const navItems = [
        {
            name: 'Analytics',
            href: '/analytics',
            icon: <BarChart4 className="mr-2 h-4 w-4" />
        },
        {
            name: 'Upload Data',
            href: '/upload',
            icon: <Upload className="mr-2 h-4 w-4" />
        },
    ];

    const navVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.1,
                duration: 0.3,
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0 }
    };

    const logoVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 25 }
        }
    };
    
    if (!isMounted) {
        return null; // Or a placeholder loader
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Container>
                <div className="flex h-16 items-center justify-between py-4">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={logoVariants}
                        className="flex items-center gap-2"
                    >
                        <Link href="/" className="flex items-center gap-2">
                            <LineChart className="h-6 w-6 text-primary" />
                            <span className="text-xl font-bold">
                                Market Lens
                            </span>
                        </Link>
                    </motion.div>

                    <div className="hidden md:flex items-center gap-2">
                        <motion.nav
                            className="flex items-center gap-1"
                            initial="hidden"
                            animate="visible"
                            variants={navVariants}
                        >
                            {navItems.map((item) => (
                                <motion.div key={item.name} variants={itemVariants}>
                                    <Button
                                        variant={pathname === item.href ? "secondary" : "ghost"}
                                        asChild
                                        size="sm"
                                        className="text-sm font-medium"
                                    >
                                        <Link href={item.href} className="flex items-center">
                                            {item.icon}
                                            {item.name}
                                        </Link>
                                    </Button>
                                </motion.div>
                            ))}
                        </motion.nav>
                        <ModeToggle />
                    </div>

                    <div className="flex items-center gap-2 md:hidden">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                </div>
            </Container>

            {mobileMenuOpen && (
                <motion.div
                    className="md:hidden absolute top-16 left-0 right-0 bg-background border-b shadow-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <Container>
                        <div className="container py-4 flex flex-col space-y-2 px-4">
                            {navItems.map((item) => (
                                <Button
                                    key={item.name}
                                    variant={pathname === item.href ? "secondary" : "ghost"}
                                    asChild
                                    className="w-full justify-start"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Link href={item.href} className="flex items-center py-2">
                                        {item.icon}
                                        {item.name}
                                    </Link>
                                </Button>
                            ))}
                            <div className="border-t pt-2 mt-2">
                               <ModeToggle />
                            </div>
                        </div>
                    </Container>
                </motion.div>
            )}
        </header>
    );
};

export default Header;