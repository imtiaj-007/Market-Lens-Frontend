import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { colorMap } from '@/types/upload';
import { FileType } from '@/types/enum';
import { Button } from '@/components/ui/button';
import CustomLoader from '@/components/ui/custom-loader';


interface UploadZoneProps {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    requirements: string[];
    onFileSelect: (file: File) => void;
    selectedFile?: File | null;
    type: FileType;
    loading: boolean;
}

const UploadZone: React.FC<UploadZoneProps> = ({
    type, title, icon: Icon, description, requirements, onFileSelect, selectedFile, loading
}) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = e.dataTransfer.files;
        if (files[0]) {
            onFileSelect(files[0]);
        }
    }, [onFileSelect]);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileSelect(file);
        }
    };

    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        onFileSelect(null as unknown as File);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <motion.div
            className={cn(
                'h-full flex relative rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer group',
                selectedFile
                    ? colorMap[type]?.border
                    : 'border-blue-400 dark:border-gray-500'
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
        >
            {loading
                ? <CustomLoader className='m-auto' />
                : <>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.xlsx,.xls,.json"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    <div className="p-6">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className={cn(
                                'p-3 rounded-full group-hover:scale-110 transition-transform duration-500',
                                colorMap[type]?.background
                            )}>
                                <Icon className={cn('size-8', colorMap[type]?.text)} />
                            </div>

                            <div className="text-center space-y-2">
                                <h3 className="text-lg font-semibold">{title}</h3>
                                <p className="text-sm text-muted-foreground max-w-xs">{description}</p>
                            </div>

                            {selectedFile ? (
                                <motion.div
                                    className={cn(
                                        'flex items-center gap-3 px-4 py-2 rounded-lg border',
                                        colorMap[type]?.border
                                    )}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Check className={cn('h-4 w-4', colorMap[type]?.text)} />
                                    <span className="text-sm font-medium truncate max-w-40">{selectedFile.name}</span>
                                    <button
                                        onClick={removeFile}
                                        className={cn('p-1 rounded-full', colorMap[type]?.background)}
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </motion.div>
                            ) : (
                                <Button
                                    variant="outline"
                                    className={cn(
                                        'border-gray-400 dark:border-gray-600',
                                        selectedFile
                                            ? 'border-green-600 dark:border-green-800'
                                            : 'border-blue-600 dark:border-blue-800'
                                    )}
                                >
                                    <Upload className="h-4 w-4" />
                                    <span>Click to upload or drag & drop</span>
                                </Button>
                            )}
                        </div>

                        <div className="mt-6 space-y-2">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Required columns:</h4>
                            <div className="flex flex-wrap gap-2 text-xs">
                                {requirements.slice(0, 4).map((req, index) => (
                                    <div key={index} className="flex items-center gap-1">
                                        <pre className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">{req}</pre>
                                    </div>
                                ))}
                            </div>
                            {requirements.length > 4 && (
                                <p className="text-xs text-muted-foreground">
                                    +{requirements.length - 4} more recommended columns
                                </p>
                            )}
                        </div>
                    </div>

                    {isDragOver && (
                        <motion.div
                            className={cn(
                                'absolute inset-0 bg-',
                                type === FileType.SALES_DATA
                                    ? 'bg-green-500/10 border-2 border-green-500'
                                    : type === FileType.CUSTOMER_DATA
                                        ? 'bg-blue-500/10 border-2 border-blue-500'
                                        : 'bg-purple-500/10 border-2 border-purple-500'
                            )}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <div className={cn(colorMap[type].text)}>Drop your file here</div>
                        </motion.div>
                    )}
                </>
            }
        </motion.div>
    );
};

export default UploadZone;