import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    text?: string;
    subText?: string;
    showIcon?: boolean;
    variant?: 'default' | 'gradient' | 'pulse' | 'dots';
    className?: string;
}

const sizeConfig = {
    sm: {
        circle: 'w-12 h-12',
        icon: 'w-4 h-4',
        text: 'text-sm',
        subText: 'text-xs',
        gap: 'gap-2'
    },
    md: {
        circle: 'w-16 h-16',
        icon: 'w-5 h-5',
        text: 'text-base',
        subText: 'text-sm',
        gap: 'gap-3'
    },
    lg: {
        circle: 'w-20 h-20',
        icon: 'w-6 h-6',
        text: 'text-lg',
        subText: 'text-base',
        gap: 'gap-4'
    },
    xl: {
        circle: 'w-24 h-24',
        icon: 'w-8 h-8',
        text: 'text-xl',
        subText: 'text-lg',
        gap: 'gap-5'
    }
};

const DotsLoader = ({ size }: { size: 'sm' | 'md' | 'lg' | 'xl' }) => {
    const dotSize = size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-1.5 h-1.5' : size === 'lg' ? 'w-2 h-2' : 'w-2.5 h-2.5';

    return (
        <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className={`${dotSize} bg-blue-600 rounded-full`}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.2
                    }}
                />
            ))}
        </div>
    );
};

const CustomLoader: React.FC<LoaderProps> = ({
    size = 'md',
    text = 'Processing...',
    subText = 'Please wait',
    showIcon = true,
    variant = 'default',
    className = ''
}) => {
    const config = sizeConfig[size];

    const circleVariants = {
        default: {
            animate: { rotate: 360 },
            transition: { duration: 1, repeat: Infinity, ease: "linear" }
        },
        gradient: {
            animate: { rotate: 360 },
            transition: { duration: 1.5, repeat: Infinity, ease: "linear" }
        },
        pulse: {
            animate: {
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8]
            },
            transition: { duration: 1.5, repeat: Infinity }
        }
    };

    const textVariants = {
        animate: {
            opacity: [0.6, 1, 0.6]
        },
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
        }
    };

    const renderLoader = () => {
        switch (variant) {
            case 'gradient':
                return (
                    <motion.div
                        className={`${config.circle} rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-0.5`}
                        {...circleVariants.gradient}
                    >
                        <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                            {showIcon && (
                                <Loader2 className={`${config.icon} text-blue-600 animate-spin`} />
                            )}
                        </div>
                    </motion.div>
                );

            case 'pulse':
                return (
                    <motion.div
                        className={`${config.circle} rounded-full border-4 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950 flex items-center justify-center`}
                        {...circleVariants.pulse}
                    >
                        {showIcon && (
                            <Loader2 className={`${config.icon} text-blue-600`} />
                        )}
                    </motion.div>
                );

            case 'dots':
                return (
                    <div className={`${config.circle} flex items-center justify-center`}>
                        <DotsLoader size={size} />
                    </div>
                );

            default:
                return (
                    <motion.div
                        className={`${config.circle} rounded-full border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 flex items-center justify-center`}
                        {...circleVariants.default}
                    >
                        {showIcon && (
                            <Loader2 className={`${config.icon} text-blue-600`} />
                        )}
                    </motion.div>
                );
        }
    };

    return (
        <motion.div
            className={`flex flex-col items-center justify-center ${config.gap} ${className}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {renderLoader()}

            <div className="text-center space-y-1">
                <motion.p
                    className={`${config.text} font-medium text-gray-800 dark:text-gray-200`}
                    {...textVariants}
                >
                    {text}
                </motion.p>

                <motion.p
                    className={`${config.subText} text-gray-600 dark:text-gray-400`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    transition={{ delay: 0.2 }}
                >
                    {subText}
                </motion.p>
            </div>
        </motion.div>
    );
};

export default CustomLoader;