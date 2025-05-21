import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Market Lens - E-Commerce Analytics Dashboard',
    description: 'Advanced analytics for your e-commerce business',
    twitter: {
        card: "summary_large_image",
        title: "Home",
        description: "Home page",
        images: ["/images/og-image.png"],
    },
    openGraph: {
        title: "Home",
        description: "Home page",
        images: ["/images/og-image.png"],
    },
    icons: {
        icon: "/images/favicon.ico",
    },
    robots: {
        index: true,
        follow: true,
    },
    category: "website",
    creator: "SK Imtiaj Uddin",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
