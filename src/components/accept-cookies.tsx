/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useCookie from '@/hooks/use-cookie';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { CookiePreferences } from '@/types/cookies';
import { Theme, Language } from '@/types/enum';


const AcceptCookies: React.FC = () => {
    const [showCookieBanner, setShowCookieBanner] = useState(false);
    const [cookiePreferences, setCookiePreferences] = useState<CookiePreferences>({
        user_preferences: {
            theme: Theme.SYSTEM,
            language: Language.EN_INDIA
        },
        necessary: true,
        analytics: true,
        marketing: true
    });
    const { cookies, loading, error, fetchCookies, setCookie } = useCookie();
    

    const handleSetCookie = async (necessary: boolean = true, analytics: boolean = true, marketing: boolean = true) => {
        try {
            const cookieBody = {
                ...cookiePreferences,
                necessary,
                analytics,
                marketing
            };
            setCookiePreferences(cookieBody);

            await setCookie(cookieBody);            
            toast('Cookie preferences updated', {
                description: 'Theme: System, Language: English(India)',
                icon: '🍪',
                duration: 5000
            });
        } catch (error) {
            console.error('Failed to set cookie:', error);
        }
    };

    useEffect(() => {
        if(error && error.status === 404) {
            setShowCookieBanner(true);
        } else if (!cookies && !loading && !error) {
            fetchCookies();
        } else {
            setShowCookieBanner(false);
        }
    }, [cookies, loading, error]);

    return (
        <AnimatePresence>
            {showCookieBanner && (
                <motion.div
                    className="fixed bottom-0 left-0 w-full z-50"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        duration: 0.4
                    }}
                >
                    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg p-4 md:p-6">
                        <div className="max-w-7xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                                <div className="col-span-1 md:col-span-5">
                                    <motion.h3
                                        className="text-lg font-semibold text-gray-900 dark:text-white mb-2"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        Cookie Preferences
                                    </motion.h3>
                                    <motion.p
                                        className="text-sm text-gray-600 dark:text-gray-300"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        We use cookies to ensure the best experience on our platform. <br />
                                        By clicking &quot;Accept All&quot;, you consent to all cookie categories. You can customize preferences via the settings in your profile. <br />
                                        <span className="block mt-2">
                                            <strong>Necessary cookies </strong>
                                            are required for core functionality like security and authentication.
                                        </span>
                                        
                                    </motion.p>
                                </div>
                                <motion.div
                                    className="col-span-1 md:col-span-1 flex flex-col gap-2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <Button
                                        variant="default"
                                        onClick={() => handleSetCookie(true, true, true)}
                                    >
                                        Accept All
                                    </Button>                                    
                                    <Button
                                        variant="outline"
                                        onClick={() => handleSetCookie(true, false, false)}
                                    >
                                        Necessary Only
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleSetCookie(false, false, false)}
                                    >
                                        Deny Cookies
                                    </Button>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AcceptCookies;