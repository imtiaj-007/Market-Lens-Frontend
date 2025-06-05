import React from 'react'
import { motion } from 'framer-motion';
import { CheckCircle2, SquareCheckBig } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { colorMap } from '@/types/upload';
import { cn } from '@/lib/utils';
import { FileType } from '@/types/enum';


const FileTips: React.FC = () => {

    const bestPractices = [
        {
            title: 'Include clear, descriptive column headers',
            description: 'This helps the AI understand the data structure and perform better.'
        },
        {
            title: 'Use consistent date formats (YYYY-MM-DD recommended)',
            description: 'This helps the AI understand the data structure and perform better.'
        },
        {
            title: 'Remove or replace empty cells with appropriate values',
            description: 'This helps the AI understand the data structure and perform better.'
        },
        {
            title: 'Ensure unique identifiers for each record',
            description: 'This helps the AI understand the data structure and perform better.'
        }
    ];

    const performanceTips = [
        {
            title: 'Files under 5MB process faster',
            description: 'This helps the AI understand the data structure and perform better.'
        },
        {
            title: 'CSV format typically has best compatibility',
            description: 'This helps the AI understand the data structure and perform better.'
        },
        {
            title: 'Remove unnecessary columns before upload',
            description: 'This helps the AI understand the data structure and perform better.'
        },
        {
            title: 'Our AI will auto-detect and clean your data',
            description: 'This helps the AI understand the data structure and perform better.'
        }
    ];

    return (
        <motion.div
            className="mt-8 space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
        >
            <div className="data-tips space-y-6">
                <div className="flex items-center gap-2">
                    <SquareCheckBig className="size-6 text-emerald-500" />
                    <h3 className="text-lg font-medium">Data Preparation Tips</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className={cn('border-2', colorMap[FileType.SALES_DATA]?.border)}>
                        <CardHeader>
                            <CardTitle className='font-medium text-emerald-700 dark:text-emerald-300'>Best Practices</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="ps-4 md:ps-8 space-y-2 text-sm">
                                {bestPractices.map((practice, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                                        <span>{practice.title}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className={cn('border-2', colorMap[FileType.CUSTOMER_DATA]?.border)}>
                        <CardHeader>
                            <CardTitle className='font-medium text-blue-700 dark:text-blue-300'>Performance Tips</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="ps-4 md:ps-8 space-y-2 text-sm">
                                {performanceTips.map((tip, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                                        <span>{tip.title}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </motion.div>
    )
}

export default FileTips;
