import React from 'react';
import { motion } from 'framer-motion';
import {
    CheckCircle, AlertTriangle, Clock, Database, TrendingUp,
    AlertCircle, Lightbulb, BarChart3, Activity, Target
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ReportData } from '@/types/data-quality';
import { cn } from '@/lib/utils';


interface DataQualityReportProps {
    data: ReportData;
}


// Mock data for demonstration
const DataQualityReport: React.FC<DataQualityReportProps> = ({ data }) => {
    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
        if (score >= 70) return 'text-amber-700 bg-amber-50 border-amber-200';
        return 'text-rose-700 bg-rose-50 border-rose-200';
    };

    const getScoreGradient = (score: number) => {
        if (score >= 90) return 'from-emerald-500 to-emerald-600';
        if (score >= 70) return 'from-amber-500 to-amber-600';
        return 'from-rose-500 to-rose-600';
    };

    const getColumnStatusColor = (score: number) => {
        if (score >= 90) return 'bg-emerald-500';
        if (score >= 70) return 'bg-amber-500';
        return 'bg-rose-500';
    };

    const { report } = data;

    return (
        <div className="space-y-6">
            {/* Quality Score Hero Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                <Card className={cn(
                    'relative',
                    !report.can_process && 'bg-gradient-to-b from-rose-300 to-rose-400 dark:from-rose-500/80 dark:to-rose-600/70'
                )}>
                    <CardHeader className="flex flex-col md:grid grid-cols-12 gap-6">
                        <div className="md:col-span-9 text-left space-y-4">
                            <div className="flex items-center justify-center lg:justify-start space-x-4">
                                <div className={cn(
                                    'flex items-center justify-center shadow-lg',
                                    'size-12 rounded-2xl bg-gradient-to-r',
                                    getScoreGradient(report.summary.data_quality_score)
                                )}>
                                    <Target className="size-6 text-white" />
                                </div>
                                <div className='space-y-1'>
                                    <h2 className="text-xl font-bold">Overall Quality Score</h2>
                                    <p className="text-sm">Check your data quality metrices</p>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-3 flex flex-col items-center m-auto">
                            <div className="relative">
                                <div className={cn(
                                    'size-32 rounded-full border-8',
                                    'flex items-center justify-center shadow-2xl',
                                    getScoreColor(report.summary.data_quality_score)
                                )}>
                                    <span className="text-3xl font-black">{report.summary.data_quality_score}%</span>
                                </div>
                                <div className="absolute bottom-0 right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                                    {report.summary.data_quality_score >= 90 ? (
                                        <CheckCircle className="size-5   text-emerald-600" />
                                    ) : report.summary.data_quality_score >= 70 ? (
                                        <AlertTriangle className="size-5     text-amber-600" />
                                    ) : (
                                        <AlertCircle className="size-5   text-rose-600" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    {/* Key Metrics */}
                    <CardContent className="border-t border-gray-300 pt-8">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="text-center space-y-2">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto">
                                    <Database className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className={cn(
                                        "text-xl font-bold capitalize",
                                        !report.can_process ? '' : 'text-blue-600'
                                    )}>
                                        {report.summary.file_type.replace('_', ' ')}
                                    </p>
                                    <p className="text-sm text-accent-foreground font-semibold">File Type</p>
                                </div>
                            </div>

                            <div className="text-center space-y-2">
                                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto">
                                    <BarChart3 className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <p className={cn(
                                        "text-xl font-bold capitalize",
                                        !report.can_process ? '' : 'text-emerald-600'
                                    )}>
                                        {report.summary.final_shape[0].toLocaleString()}
                                    </p>
                                    <p className="text-sm text-accent-foreground font-semibold">Rows × {report.summary.final_shape[1]} Cols</p>
                                </div>
                            </div>

                            <div className="text-center space-y-2">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto">
                                    <Clock className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className={cn(
                                        "text-xl font-bold capitalize",
                                        !report.can_process ? '' : 'text-purple-600'
                                    )}>
                                        {(report.summary.processing_time_seconds * 1000).toFixed(0)}ms
                                    </p>
                                    <p className="text-sm text-accent-foreground font-semibold">Processing Time</p>
                                </div>
                            </div>

                            <div className="text-center space-y-2">
                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto">
                                    <Activity className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                <p className={cn(
                                        "text-xl font-bold capitalize",
                                        !report.can_process ? '' : 'text-orange-600'
                                    )}>
                                        {report.summary.rows_processed.toLocaleString()}
                                    </p>
                                    <p className="text-sm text-accent-foreground font-semibold">Rows Processed</p>
                                </div>
                            </div>
                        </div>

                        {/* Warnings integrated here */}
                        {report.warnings.length > 0 && (
                            <div className={cn(
                                "mt-6 rounded-xl p-4 space-y-2 border",
                                report?.can_process ? 'bg-amber-50 border-amber-300 dark:bg-amber-100' : 'bg-rose-50 border-rose-300'
                            )}>
                                <div className="flex items-center space-x-2 text-red-600">
                                    <AlertTriangle className="size-4" />
                                    <span className="font-medium text-sm">Quality Alerts</span>
                                </div>
                                <ul className="space-y-1 list-disc pl-8">
                                    {report.warnings.map((warning, index) => (
                                        <li key={index} className="text-sm text-red-500">
                                            {warning}
                                        </li>
                                    ))}                                    
                                </ul>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Accordion Sections */}
            <Accordion type="single" defaultValue={"suggestions"} collapsible className="space-y-4">
                {/* Suggestions Section */}
                {report.suggestions.length > 0 && (
                    <AccordionItem value="suggestions" className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-700 rounded-xl shadow-lg overflow-hidden">
                        <AccordionTrigger className="px-6 py-5 hover:bg-blue-50 dark:hover:bg-blue-900/30">
                            <div className="flex items-center space-x-4">
                                <div className="size-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Lightbulb className="size-6 text-white" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Smart Recommendations</h3>
                                    <p className="text-blue-600 dark:text-blue-400 font-medium">{report.suggestions.length} optimization suggestions</p>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 pt-2">
                            <div className="space-y-2 pt-2">
                                {report.suggestions.map((suggestion, index) => (
                                    <Card key={`suggestions_${index}`}>
                                        <CardContent className='flex items-start space-x-4'>
                                            <div className="size-6 bg-blue-500 rounded-md flex items-center justify-center flex-shrink-0">
                                                <span className="text-white text-xs font-bold">{index + 1}</span>
                                            </div>
                                            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{suggestion}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}
            </Accordion>

            <Accordion type="single" defaultValue={"columns"} collapsible className="space-y-4">
                {/* Column Health Section */}
                <AccordionItem value="columns" className="bg-emerald-50 border border-emerald-100 rounded-lg shadow-sm overflow-hidden dark:bg-emerald-900/20 dark:border-emerald-800">
                    <AccordionTrigger className="px-6 py-5 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 [&_[data-chevron]]:hover:no-underline">
                        <div className="flex items-center space-x-3">
                            <div className="size-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow">
                                <TrendingUp className="size-6 text-white" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-emerald-100">Column Health Analysis</h3>
                                <p className="text-emerald-500 dark:text-emerald-400 font-medium text-sm">{Object.keys(report.column_health).length} columns analyzed</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-1">
                            {Object.entries(report.column_health).map(([columnName, health]) => (
                                <Card key={columnName}>
                                    <CardContent>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-2">
                                                <div
                                                    className={cn(
                                                        'size-2 rounded-full shadow-sm',
                                                        getColumnStatusColor(health.overall_score)
                                                    )}
                                                ></div>
                                                <span className="font-mono font-medium text-gray-800 dark:text-emerald-100 text-base">{columnName}</span>
                                            </div>
                                            <div className={cn(
                                                'px-3 py-1 rounded-full text-xs font-bold border',
                                                getScoreColor(health.overall_score)
                                            )}>
                                                {health.overall_score}%
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3 pt-2 border-t">
                                            <div className="text-center p-2">
                                                <div className="text-lg font-bold text-blue-500 dark:text-blue-400">{health.completeness_score}%</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Completeness</div>
                                            </div>
                                            <div className="text-center p-2">
                                                <div className="text-lg font-bold text-purple-500 dark:text-purple-400">{health.uniqueness_score}%</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Uniqueness</div>
                                            </div>
                                            <div className="text-center p-2">
                                                <div className="text-lg font-bold text-emerald-500 dark:text-emerald-400">{health.validity_score}%</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Validity</div>
                                            </div>
                                        </div>

                                        {(health.issues.length > 0 || health.warnings.length > 0) && (
                                            <div className="mt-3 p-3 bg-white dark:bg-emerald-900/30 rounded border border-gray-100 dark:border-emerald-800 space-y-1.5">
                                                {health.issues.map((issue, idx) => (
                                                    <div key={idx} className="flex items-center space-x-2 text-xs">
                                                        <AlertCircle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                                                        <span className="text-rose-600 dark:text-rose-400">{issue}</span>
                                                    </div>
                                                ))}
                                                {health.warnings.map((warning, idx) => (
                                                    <div key={idx} className="flex items-center space-x-2 text-xs">
                                                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                                                        <span className="text-amber-600 dark:text-amber-400">{warning}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};

export default DataQualityReport;