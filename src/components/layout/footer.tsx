'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { Container } from '@/components/ui/container';

const Footer: React.FC = () => {
    const year = new Date().getFullYear();

    return (
        <motion.footer
            className="border-t border-border/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
        >
            <Container>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-6">
                    <div className="flex flex-col items-center md:items-start">
                        <p className="text-center text-sm text-muted-foreground md:text-left">
                            &copy; {year} Market Lens. All rights reserved.
                        </p>
                        <p className="text-center text-xs text-muted-foreground/60 md:text-left">
                            Advanced analytics for e-commerce businesses
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <motion.a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Github className="h-5 w-5" />
                            <span className="sr-only">GitHub</span>
                        </motion.a>
                        <motion.a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Twitter className="h-5 w-5" />
                            <span className="sr-only">Twitter</span>
                        </motion.a>
                        <motion.a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Linkedin className="h-5 w-5" />
                            <span className="sr-only">LinkedIn</span>
                        </motion.a>
                    </div>
                </div>
            </Container>
        </motion.footer>
    );
};

export default Footer;