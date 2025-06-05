import React from 'react'
import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { colorMap } from '@/types/upload';
import { SampleDataCard } from '@/types/data-quality';


export interface SampleDataCardsProps {
    dataset: SampleDataCard
    index: number;
    uploading: boolean;
    handleUseSampleData: (key: string) => void;
}

const SampleDataCards: React.FC<SampleDataCardsProps> = (
    { dataset, index, uploading, handleUseSampleData }
) => {

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
            <Card className={cn(
                'h-full border-2 group cursor-pointer',
                colorMap[dataset.key].border, colorMap[dataset.key].background
            )}>
                <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                        <div className={cn('p-3 rounded-xl', colorMap[dataset.key].background)}>
                            <dataset.icon className={cn('h-6 w-6', colorMap[dataset.key].text)} />
                        </div>
                        <div className="flex gap-2">
                            <span className={cn('px-2 py-1 text-xs font-medium rounded-xl', colorMap[dataset.key].background, colorMap[dataset.key].text)}>
                                {dataset.rows} rows
                            </span>
                            <span className={cn('px-2 py-1 text-xs font-medium rounded-xl', colorMap[dataset.key].background, colorMap[dataset.key].text)}>
                                {dataset.columns} cols
                            </span>
                        </div>
                    </div>
                    <CardTitle className="text-lg group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                        {dataset.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                        {dataset.description}
                    </CardDescription>
                </CardHeader>
                <CardFooter className="pt-0 gap-2">
                    <Button
                        onClick={() => handleUseSampleData(dataset.key)}
                        disabled={uploading}
                        className={cn('flex-1 text-white border-0', colorMap[dataset.key].button)}
                    >
                        {uploading ? 'Loading...' : 'Use Dataset'}
                        {!uploading && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" className="shrink-0">
                                    <Download className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Download sample data</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </CardFooter>
            </Card>
        </motion.div>
    )
}

export default SampleDataCards;
