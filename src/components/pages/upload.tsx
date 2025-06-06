/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    FileUp, Database, CheckCircle2, Info, ArrowRight,
    Wand2, HelpCircle, CircleHelp, Sparkles, Check, CircleCheckBig,
    CircleAlert,
} from 'lucide-react';
import { settings } from '@/core/config';
import { sampleData } from '@/core/sample-data';
import { FileType } from '@/types/enum';
import { colorMap, fileTypes, sampleFiles } from '@/types/upload';
import { cn, formatFileSize } from '@/lib/utils';
import { useFile } from '@/hooks/use-file';

// ShadCN UI components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageLayout } from '@/components/layout/page-layout';
import { toast } from 'sonner';

// Reusable components
import SupportedFormats from '@/components/file-upload/supported-formats';
import FileTips from '@/components/file-upload/file-tips';
import UploadZone from '@/components/file-upload/upload-zone';
import SampleDataCards from '@/components/file-upload/sample-data-cards';
import DataQualityReport from '@/components/file-upload/data-report';


const UploadPage: React.FC = () => {
    const router = useRouter();
    const { fileIds, fileResponse, setFile, processFile } = useFile();
    const [uploading, setUploading] = useState(false);

    const [files, setFiles] = useState<Record<FileType, File | null>>(() => {
        return Object.values(FileType).reduce((acc, fileType) => {
            acc[fileType] = null;
            return acc;
        }, {} as Record<FileType, File | null>);
    });

    const [loaders, setLoaders] = useState<Record<FileType, boolean>>(() => {
        return Object.values(FileType).reduce((acc, fileType) => {
            acc[fileType] = false;
            return acc;
        }, {} as Record<FileType, boolean>);
    });

    const handleFileSelect = (type: FileType) => async (file: File | null) => {
        // Check file sizes
        if (!file || file.size > settings.MAX_FILE_SIZE) {
            toast.error(
                'File Size Error',
                { description: `File size exceeds the maximum limit of ${formatFileSize(settings.MAX_FILE_SIZE)}. Please upload a smaller file.`, }
            );
            return;
        }
        setLoaders(prev => ({ ...prev, [type]: true }));

        try {
            const res = await processFile({
                file,
                fileType: type,
            });
            if (res?.data?.report?.can_process) {
                setFile(type, file);
                setFiles(prev => ({ ...prev, [type]: file }));
            }
        } catch (error) {
            console.error('File processing error:', error);
        } finally {
            setLoaders(prev => ({ ...prev, [type]: false }));
        }
    };

    const getUploadedFilesCount = () => {
        return Object.values(fileIds).filter(id => id !== null).length;
    };

    const getReportsTab = useMemo(() => {
        const reports = Object.entries(fileResponse).filter(([_, value]) => value !== null);
        if (reports.length == 0) return null;

        return (
            <Tabs defaultValue="sales_data">
                <TabsList className="my-4 flex justify-between h-12 gap-2">
                    {reports.map(([key, value]) => {
                        const item = sampleData.Data_Quality_Tabs[key as FileType];
                        const can_process = value?.report?.can_process;
                        if (!item) return null;

                        return (
                            <TabsTrigger
                                key={`${item.value}_quality`}
                                value={item.value}
                                className={cn(
                                    item.className,
                                    "lg:w-40 flex items-center gap-2 p-2 lg:p-4 rounded-lg relative",
                                )}
                            >
                                {item.icon}
                                <span className="font-medium capitalize">{item.value.replace('_', " ")}</span>

                                {/* Exclamation icon in top-right corner when can't process */}
                                {!can_process && (
                                    <span className="absolute -top-1 -right-1 w-6 h-6 flex">
                                        <CircleAlert className="size-6 text-red-500 m-auto" />
                                    </span>
                                )}
                            </TabsTrigger>
                        )
                    })}
                </TabsList>
                {reports.map(([key, value]) => {
                    if (value) {
                        return (
                            <TabsContent key={`${key}_data_quality`} value={key}>
                                <DataQualityReport data={value} />
                            </TabsContent>
                        )
                    }
                }
                )}
            </Tabs>
        )
    }, [fileResponse]);

    const handleUpload = async () => {
        setUploading(true);

        try {
            // TODO: Upload the processed files 
            toast.info(
                'Uploading files... Please wait',
                { description: 'Your data is being prepared for analysis.' }
            )

        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleUseSampleData = (datasetName: string) => {
        setUploading(true);
        console.log(datasetName);

        setTimeout(() => {
            setUploading(false);

            setTimeout(() => router.push('/analytics'), 1500);
        }, 1800);
    };

    return (
        <>
            <PageLayout>
                <motion.div
                    className="max-w-7xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    {/* Header */}
                    <motion.div
                        className="text-center space-y-4 mb-8"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-full border border-blue-200 dark:border-blue-800">
                            <Database className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Data Import</span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                            Import Your Data
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Upload your e-commerce data to unlock powerful analytics, discover trends, and gain actionable insights for your business.
                        </p>
                    </motion.div>

                    <motion.div
                        className="mt-8"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Tabs defaultValue="file-upload" className="space-y-6">
                            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto h-12">
                                <TabsTrigger value="file-upload" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white">
                                    <FileUp className="h-4 w-4" />
                                    Upload Files
                                </TabsTrigger>
                                <TabsTrigger value="sample-data" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                                    <Database className="h-4 w-4" />
                                    Sample Data
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="file-upload" className="space-y-8">
                                {/* Smart Upload Feature */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <Card className="border-t-4 border-t-cyan-300 dark:border-t-cyan-500 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-950/20 dark:to-purple-950/20">
                                        <CardHeader className="pb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                                                    <Wand2 className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-xl">Smart Data Upload</CardTitle>
                                                    <CardDescription className="text-base">
                                                        Our AI-powered system automatically maps your columns and optimizes data formats
                                                    </CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="space-y-6">
                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                {fileTypes.map((fileType, index) => (
                                                    <motion.div
                                                        key={fileType.key}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                                        className="h-full"
                                                    >
                                                        <UploadZone
                                                            {...fileType}
                                                            onFileSelect={handleFileSelect(fileType.key)}
                                                            selectedFile={files[fileType.key]}
                                                            loading={loaders[fileType.key]}
                                                        />
                                                    </motion.div>
                                                ))}
                                            </div>

                                            {getUploadedFilesCount() > 0 && (
                                                <motion.div
                                                    className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800"
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                                        <span className="font-medium text-emerald-800 dark:text-emerald-200">
                                                            {`${getUploadedFilesCount()} ${getUploadedFilesCount() === 1 ? 'file is' : 'files are'} processed successfully`}
                                                        </span>
                                                    </div>
                                                    <Button
                                                        variant="primary"
                                                        onClick={handleUpload}
                                                        disabled={uploading}
                                                    >
                                                        {uploading ? 'Uploading...' : 'Get Analytics'}
                                                        {!uploading && <ArrowRight className="ml-2 h-4 w-4" />}
                                                    </Button>
                                                </motion.div>
                                            )}

                                            {/* Processed File Reports */}
                                            {getReportsTab}

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <Card className="bg-blue-50/30 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                                                    <CardHeader>
                                                        <CardTitle className="text-lg flex items-center gap-2">
                                                            <HelpCircle className="h-5 w-5 text-blue-500" />
                                                            Common Questions
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                                                        {[
                                                            "Missing or extra columns in your data?",
                                                            "Unsure about your data format?",
                                                            "Different column names than expected?"
                                                        ].map((item, i) => (
                                                            <div key={i} className="flex items-start gap-2">
                                                                <CircleHelp className="size-4 mt-0.5 text-blue-400" />
                                                                <p>{item}</p>
                                                            </div>
                                                        ))}
                                                        <p className="flex items-center gap-2 font-medium text-base text-green-500 mt-4 md:mt-8">
                                                            Don&apos;t worry - we&apos;ve got you covered!
                                                            <CircleCheckBig className="hidden md:block size-6" />
                                                        </p>
                                                    </CardContent>
                                                </Card>

                                                <Card className="bg-purple-50/30 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
                                                    <CardHeader>
                                                        <CardTitle className="text-lg flex items-center gap-2">
                                                            <Sparkles className="h-5 w-5 text-purple-500" />
                                                            AI Capabilities
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <ul className="space-y-3 text-sm text-muted-foreground">
                                                            {[
                                                                "Automatically detect and map columns",
                                                                "Optimize data formats for performance",
                                                                "Handle missing/extra columns gracefully",
                                                                "Ensure data integrity and consistency",
                                                                "Provide clear error messages and fixes"
                                                            ].map((item, i) => (
                                                                <li key={i} className="flex items-start gap-2">
                                                                    <Check className="h-4 w-4 mt-0.5 text-purple-500" />
                                                                    {item}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </TabsContent>

                            <TabsContent value="sample-data" className="space-y-6">
                                <motion.div
                                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    {sampleData.Sample_Data_Cards.map((dataset, index) => (
                                        <SampleDataCards
                                            key={dataset.key}
                                            dataset={dataset}
                                            index={index}
                                            uploading={uploading}
                                            handleUseSampleData={handleUseSampleData}
                                        />
                                    ))}
                                </motion.div>

                                {/* Sample Data Info */}
                                <motion.div
                                    className="mt-8 space-y-6"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <div className="flex items-center gap-2">
                                        <Info className="size-6 text-blue-600" />
                                        <h3 className="text-lg font-semibold">Benifits of Sample Data</h3>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <Card className="border-2 border-blue-200 dark:border-blue-800">
                                            <CardContent className="pt-6">
                                                <div className="space-y-4">
                                                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">Instant Analytics</h4>
                                                    <p className="text-sm text-blue-800 dark:text-blue-200">
                                                        Jump straight into exploring our powerful analytics features without waiting for data preparation.
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {['Real-time dashboards', 'Trend analysis', 'Customer insights'].map((feature, i) => (
                                                            <span key={i} className={cn(
                                                                "px-2 py-1 text-xs font-medium rounded-xl",
                                                                colorMap[FileType.CUSTOMER_DATA]?.background, colorMap[FileType.CUSTOMER_DATA]?.text
                                                            )}>
                                                                {feature}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="border-2 border-purple-200 dark:border-purple-800">
                                            <CardContent className="pt-6">
                                                <div className="space-y-4">
                                                    <h4 className="font-semibold text-purple-900 dark:text-purple-100">Learn by Example</h4>
                                                    <p className="text-sm text-purple-800 dark:text-purple-200">
                                                        See how to structure your own data and discover best practices for maximum insights.
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {['Data formatting', 'Column mapping', 'Integration tips'].map((feature, i) => (
                                                            <span key={i} className={cn(
                                                                "px-2 py-1 text-xs font-medium rounded-xl",
                                                                colorMap[FileType.PRODUCT_DATA]?.background, colorMap[FileType.PRODUCT_DATA]?.text
                                                            )}>
                                                                {feature}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </motion.div>
                            </TabsContent>
                        </Tabs>
                    </motion.div>

                    {/* Help Section */}
                    <FileTips />
                    <SupportedFormats />

                </motion.div>
            </PageLayout>
        </>
    );
};

export default UploadPage;