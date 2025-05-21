'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageLayout } from '@/components/layout/page-layout';
import { uploadFile } from '@/lib/api';
import { 
  FileUp, Database, CheckCircle2, XCircle, FileType2, 
  HelpCircle,  Info, ArrowRight, FileQuestion, History
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from 'framer-motion';
import { FileSummary, FileFormatRequirement } from '@/types/upload';

const UploadPage: React.FC = () => {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [fileSummary, setFileSummary] = useState<FileSummary | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [recentFiles, setRecentFiles] = useState([
        { name: "sales_april.csv", date: "May 14, 2025", size: "3.2 MB" },
        { name: "customer_data.xlsx", date: "May 10, 2025", size: "1.7 MB" }
    ]);
    
    // File format requirements information
    const fileFormatRequirements: FileFormatRequirement[] = [
        {
            title: "CSV Format",
            description: "Your CSV file should include headers in the first row. Make sure all columns are properly separated by commas.",
            example: "product_id,name,category,price,date_sold"
        },
        {
            title: "Excel Format",
            description: "Excel files should have a single sheet with data. The first row should contain column headers.",
            example: "Sheet 1 with headers: order_id, customer_name, product, quantity, price"
        },
        {
            title: "JSON Format",
            description: "JSON files should contain an array of objects, with each object representing a row of data.",
            example: '[{"order_id": 1001, "product": "Laptop", "price": 1299.99}]'
        }
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);

        // Reset states
        setUploadSuccess(false);
        setUploadError(null);
        setFileSummary(null);
        setUploadProgress(0);
    };

    const handleUpload = async () => {
        if (!file) {
            setUploadError('Please select a file to upload');
            return;
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('File size must be less than 5MB');
            return;
        }

        // Check file type
        const allowedTypes = ['text/csv', 'application/vnd.ms-excel', 'application/json', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        if (!allowedTypes.includes(file.type)) {
            setUploadError('Please upload a CSV, XLS, XLSX, or JSON file');
            return;
        }

        setUploading(true);
        setUploadError(null);

        // Simulate progress for better UX
        const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + 10;
            });
        }, 300);

        try {
            // Use the API client to upload the file
            const response = await uploadFile(file);

            // Create more detailed file summary
            const enhancedSummary = {
                ...response.summary,
                fileSize: (file.size / 1024 / 1024).toFixed(2) + " MB",
                fileType: file.type,
                uploadDate: new Date().toLocaleDateString()
            };
            
            setFileSummary(enhancedSummary);
            clearInterval(progressInterval);
            setUploadProgress(100);
            setUploadSuccess(true);

            // Add to recent files (in real app, this would persist)
            setRecentFiles(prev => [
                { 
                    name: file.name, 
                    date: new Date().toLocaleDateString(), 
                    size: (file.size / 1024 / 1024).toFixed(2) + " MB" 
                },
                ...prev.slice(0, 4) // Keep last 5 files
            ]);

            // Redirect to analytics page after 2 seconds
            setTimeout(() => router.push('/analytics'), 2000);

        } catch (error) {
            console.error('Upload error:', error);
            clearInterval(progressInterval);
            setUploadProgress(0);
            setUploadError(error instanceof Error ? error.message : 'An error occurred while uploading the file. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleUseSampleData = (datasetName: string) => {
        setUploading(true);
        
        // Simulate progress
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 15;
            if (progress >= 100) {
                clearInterval(progressInterval);
                progress = 100;
            }
            setUploadProgress(progress);
        }, 300);

        // Simulate loading sample data
        setTimeout(() => {
            clearInterval(progressInterval);
            setUploadProgress(100);
            setUploadSuccess(true);
            setUploading(false);

            // Show mock summary for sample data
            setFileSummary({
                rows: datasetName.includes("sales") ? 10248 : 5000,
                columns: datasetName.includes("sales") ? 12 : 8,
                column_names: datasetName.includes("sales") 
                    ? ["date", "product_id", "product_name", "category", "price", "quantity", "customer_id", "customer_name", "country", "payment_method", "discount", "revenue"]
                    : ["transaction_id", "date", "product", "quantity", "unit_price", "customer_id", "customer_name", "country"],
                fileType: "Sample Dataset",
                uploadDate: new Date().toLocaleDateString()
            });

            // Redirect to analytics page after 1.5 seconds
            setTimeout(() => router.push('/analytics'), 1500);
        }, 1800);
    };

    return (
        <PageLayout>
            <motion.div 
                className="max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
                <motion.div 
                    className="flex flex-col gap-4"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                    <h1 className="text-3xl font-bold tracking-tight">Data Import Center</h1>
                    <p className="text-muted-foreground">
                        Upload your e-commerce data to start analyzing sales trends, customer behavior, and unlock actionable insights.
                    </p>
                </motion.div>

                <motion.div 
                    className="mt-8"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                    <Tabs defaultValue="file-upload">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="file-upload" className="flex items-center gap-2">
                                <FileUp className="h-4 w-4" />
                                File Upload
                            </TabsTrigger>
                            <TabsTrigger value="sample-data" className="flex items-center gap-2">
                                <Database className="h-4 w-4" />
                                Sample Data
                            </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="file-upload" className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <Card className="border-t-4 border-t-primary shadow-sm hover:shadow-md transition-all duration-300">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <FileType2 className="h-5 w-5 text-primary" />
                                            Upload your data file
                                        </CardTitle>
                                        <CardDescription>
                                            Upload a CSV, Excel, or JSON file containing your e-commerce data.
                                            Maximum file size is 5MB.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-6">
                                            <div className="grid gap-2">
                                                <div className="flex items-center gap-4">
                                                    <Input
                                                        id="file"
                                                        type="file"
                                                        onChange={handleFileChange}
                                                        accept=".csv,.xls,.xlsx,.json"
                                                        disabled={uploading}
                                                        className="cursor-pointer file:cursor-pointer file:transition-colors file:mr-4 file:px-4 file:bg-primary file:text-primary-foreground file:rounded-md file:border-0 file:font-medium hover:file:bg-primary/90"
                                                    />
                                                </div>
                                                {file && (
                                                    <motion.p
                                                        className="text-sm text-muted-foreground"
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        Selected file: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                                    </motion.p>
                                                )}
                                            </div>

                                            {uploading && (
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span>Uploading file...</span>
                                                        <span>{uploadProgress}%</span>
                                                    </div>
                                                    <Progress value={uploadProgress} className="h-2" />
                                                </div>
                                            )}

                                            {uploadError && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                >
                                                    <Alert variant="destructive">
                                                        <XCircle className="h-4 w-4" />
                                                        <AlertTitle>Error</AlertTitle>
                                                        <AlertDescription>{uploadError}</AlertDescription>
                                                    </Alert>
                                                </motion.div>
                                            )}

                                            {uploadSuccess && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                >
                                                    <Alert className="border-green-500 text-green-500 bg-green-50 dark:bg-green-900/20">
                                                        <CheckCircle2 className="h-4 w-4" />
                                                        <AlertTitle>Success</AlertTitle>
                                                        <AlertDescription>
                                                            File uploaded successfully! Redirecting to dashboard...
                                                        </AlertDescription>
                                                    </Alert>
                                                </motion.div>
                                            )}

                                            {fileSummary && (
                                                <motion.div
                                                    className="rounded-md border p-4 bg-slate-50 dark:bg-slate-900/50"
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                                >
                                                    <h3 className="font-medium mb-2 flex items-center gap-2">
                                                        <Info className="h-4 w-4 text-primary" />
                                                        File Summary
                                                    </h3>
                                                    <div className="text-sm space-y-1">
                                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                                            <p className="text-muted-foreground">File:</p>
                                                            <p className="font-medium">{file?.name}</p>
                                                            
                                                            <p className="text-muted-foreground">Type:</p>
                                                            <p className="font-medium">{fileSummary.fileType || file?.type}</p>
                                                            
                                                            <p className="text-muted-foreground">Size:</p>
                                                            <p className="font-medium">{fileSummary.fileSize || (file ? (file.size / 1024 / 1024).toFixed(2) + " MB" : "")}</p>
                                                            
                                                            <p className="text-muted-foreground">Rows:</p>
                                                            <p className="font-medium">{fileSummary.rows}</p>
                                                            
                                                            <p className="text-muted-foreground">Columns:</p>
                                                            <p className="font-medium">{fileSummary.columns}</p>
                                                        </div>
                                                        
                                                        <div className="mt-2 pt-2 border-t">
                                                            <p className="text-muted-foreground">Column Names:</p>
                                                            <p className="font-medium break-words">{fileSummary.column_names?.join(', ')}</p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <motion.div
                                            className="w-full"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.2 }}
                                        >
                                            <Button
                                                onClick={handleUpload}
                                                disabled={!file || uploading}
                                                className="w-full group"
                                            >
                                                {uploading ? 'Uploading...' : 'Upload and Analyze'}
                                                {!uploading && (
                                                    <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                                                )}
                                            </Button>
                                        </motion.div>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                            
                            <motion.div 
                                className="space-y-4"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <div className="flex items-center gap-2">
                                    <FileQuestion className="h-4 w-4 text-primary" />
                                    <h3 className="text-lg font-medium">File Format Requirements</h3>
                                </div>
                                <Accordion type="single" collapsible className="w-full">
                                    {fileFormatRequirements.map((requirement, index) => (
                                        <AccordionItem key={index} value={`item-${index}`}>
                                            <AccordionTrigger className="text-sm font-medium">
                                                {requirement.title}
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="text-sm space-y-2 pl-1">
                                                    <p>{requirement.description}</p>
                                                    <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded font-mono text-xs">
                                                        {requirement.example}
                                                    </div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </motion.div>
                            
                            {recentFiles.length > 0 && (
                                <motion.div 
                                    className="space-y-3"
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    <div className="flex items-center gap-2">
                                        <History className="h-4 w-4 text-primary" />
                                        <h3 className="text-lg font-medium">Recently Uploaded</h3>
                                    </div>
                                    <div className="rounded-md border overflow-hidden">
                                        <div className="divide-y">
                                            {recentFiles.map((recentFile, index) => (
                                                <div 
                                                    key={index}
                                                    className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <FileType2 className="h-4 w-4 text-slate-400" />
                                                        <div>
                                                            <p className="text-sm font-medium">{recentFile.name}</p>
                                                            <p className="text-xs text-muted-foreground">{recentFile.date}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">{recentFile.size}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </TabsContent>
                        
                        <TabsContent value="sample-data" className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <Card className="border-t-4 border-t-blue-500 shadow-sm hover:shadow-md transition-all duration-300">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Database className="h-5 w-5 text-blue-500" />
                                            Use sample data
                                        </CardTitle>
                                        <CardDescription>
                                            Don&apos;t have your own data? Use our sample datasets to explore the platform features.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {uploading && (
                                            <div className="space-y-2 mb-4">
                                                <div className="flex justify-between text-sm">
                                                    <span>Loading sample data...</span>
                                                    <span>{uploadProgress}%</span>
                                                </div>
                                                <Progress value={uploadProgress} className="h-2" />
                                            </div>
                                        )}
                                        
                                        {uploadSuccess && (
                                            <motion.div 
                                                className="mb-4"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            >
                                                <Alert className="border-green-500 text-green-500 bg-green-50 dark:bg-green-900/20">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    <AlertTitle>Success</AlertTitle>
                                                    <AlertDescription>
                                                        Sample data loaded successfully! Redirecting to dashboard...
                                                    </AlertDescription>
                                                </Alert>
                                            </motion.div>
                                        )}
                                        
                                        {fileSummary && (
                                            <motion.div
                                                className="rounded-md border p-4 bg-slate-50 dark:bg-slate-900/50 mb-6"
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.4, ease: "easeOut" }}
                                            >
                                                <h3 className="font-medium mb-2 flex items-center gap-2">
                                                    <Info className="h-4 w-4 text-blue-500" />
                                                    Dataset Summary
                                                </h3>
                                                <div className="text-sm space-y-1">
                                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                                        <p className="text-muted-foreground">Dataset:</p>
                                                        <p className="font-medium">{fileSummary.fileType}</p>
                                                        
                                                        <p className="text-muted-foreground">Rows:</p>
                                                        <p className="font-medium">{fileSummary.rows}</p>
                                                        
                                                        <p className="text-muted-foreground">Columns:</p>
                                                        <p className="font-medium">{fileSummary.columns}</p>
                                                    </div>
                                                    
                                                    <div className="mt-2 pt-2 border-t">
                                                        <p className="text-muted-foreground">Column Names:</p>
                                                        <p className="font-medium break-words">{fileSummary.column_names?.join(', ')}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                        
                                        <motion.div className="grid gap-4">
                                            <motion.div
                                                className="rounded-md border p-4 hover:border-blue-500 hover:shadow-sm transition-all cursor-pointer"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: 0.2 }}
                                                whileHover={{ translateY: -4, transition: { duration: 0.3 } }}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="space-y-1">
                                                        <h3 className="font-medium">E-commerce sales data (2022-2023)</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            12 months of sales data with product categories and customer information
                                                        </p>
                                                        <div className="mt-2 flex gap-2 text-xs">
                                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full">10,248 rows</span>
                                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full">12 columns</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handleUseSampleData("sales")}
                                                                        disabled={uploading}
                                                                        className="bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-400"
                                                                    >
                                                                        {uploading ? 'Loading...' : 'Use this'}
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p className="text-xs">Load sample e-commerce sales data</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </div>
                                                </div>
                                            </motion.div>
                                            
                                            <motion.div
                                                className="rounded-md border p-4 hover:border-purple-500 hover:shadow-sm transition-all cursor-pointer"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: 0.3 }}
                                                whileHover={{ translateY: -4, transition: { duration: 0.3 } }}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="space-y-1">
                                                        <h3 className="font-medium">Online retail transactions</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            5,000 transactions from an online retailer with customer details
                                                        </p>
                                                        <div className="mt-2 flex gap-2 text-xs">
                                                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 rounded-full">5,000 rows</span>
                                                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 rounded-full">8 columns</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handleUseSampleData("retail")}
                                                                        disabled={uploading}
                                                                        className="bg-purple-50 border-purple-200 text-purple-600 hover:bg-purple-100 dark:bg-purple-950 dark:border-purple-900 dark:text-purple-400"
                                                                    >
                                                                        {uploading ? 'Loading...' : 'Use this'}
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p className="text-xs">Load sample retail transaction data</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </div>
                                                </div>
                                            </motion.div>
                                            
                                            <motion.div
                                                className="rounded-md border p-4 hover:border-amber-500 hover:shadow-sm transition-all cursor-pointer"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.5, delay: 0.4 }}
                                                whileHover={{ translateY: -4, transition: { duration: 0.3 } }}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="space-y-1">
                                                        <h3 className="font-medium">Customer demographics & behavior</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            Customer profile data with demographics and purchasing patterns
                                                        </p>
                                                        <div className="mt-2 flex gap-2 text-xs">
                                                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 rounded-full">3,500 rows</span>
                                                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 rounded-full">10 columns</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handleUseSampleData("demographics")}
                                                                        disabled={uploading}
                                                                        className="bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100 dark:bg-amber-950 dark:border-amber-900 dark:text-amber-400"
                                                                    >
                                                                        {uploading ? 'Loading...' : 'Use this'}
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p className="text-xs">Load sample customer demographics data</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                            
                            <motion.div
                                className="space-y-4"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <div className="flex items-center gap-2">
                                    <HelpCircle className="h-4 w-4 text-blue-500" />
                                    <h3 className="text-lg font-medium">About Sample Datasets</h3>
                                </div>
                                <Card className="border-blue-100 dark:border-blue-900">
                                    <CardContent className="pt-6">
                                        <div className="space-y-4 text-sm">
                                            <p>Our sample datasets are carefully curated to help you explore the platform&apos;s analytics capabilities without having to upload your own data first.</p>
                                            
                                            <div className="rounded-md bg-blue-50 dark:bg-blue-950/50 p-4 border border-blue-100 dark:border-blue-900">
                                                <h4 className="text-blue-700 dark:text-blue-400 font-medium mb-1">Benefits of sample data:</h4>
                                                <ul className="list-disc pl-5 space-y-1 text-blue-700/80 dark:text-blue-400/80">
                                                    <li>Test drive all analytics features instantly</li>
                                                    <li>Learn how to format your own data for optimal results</li>
                                                    <li>Experiment with different visualizations</li>
                                                    <li>Practice creating insightful reports</li>
                                                </ul>
                                            </div>
                                            
                                            <p>All sample datasets contain anonymized and synthesized data that resembles real-world e-commerce patterns. They&apos;re ready to use with all platform features.</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </TabsContent>
                    </Tabs>
                </motion.div>                                
            </motion.div>
        </PageLayout>
    );
};

export default UploadPage;