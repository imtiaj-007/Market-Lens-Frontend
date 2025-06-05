
import React from 'react';
import { Upload, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface UploadProgressProps {
    fileName?: string;
    progress: number;
    status: 'uploading' | 'success' | 'error' | 'idle';
    onClose?: () => void;
    visible?: boolean;
}

const UploadProgress: React.FC<UploadProgressProps> = ({
    fileName = "document.pdf",
    progress,
    status,
    onClose,
    visible = true
}) => {
    if (!visible) return null;

    const getStatusIcon = () => {
        switch (status) {
            case 'uploading':
                return <Upload className="w-4 h-4 animate-pulse text-blue-500" />;
            case 'success':
                return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case 'error':
                return <AlertCircle className="w-4 h-4 text-red-500" />;
            default:
                return <Upload className="w-4 h-4 text-gray-400" />;
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case 'uploading':
                return 'bg-blue-500';
            case 'success':
                return 'bg-green-500';
            case 'error':
                return 'bg-red-500';
            default:
                return 'bg-gray-400';
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'uploading':
                return 'Uploading...';
            case 'success':
                return 'Upload complete';
            case 'error':
                return 'Upload failed';
            default:
                return 'Ready to upload';
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right-full duration-300">
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[320px] max-w-[400px]">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        {getStatusIcon()}
                        <span className="text-sm font-medium text-gray-700">
                            {getStatusText()}
                        </span>
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* File info */}
                <div className="mb-3">
                    <p className="text-xs text-gray-500 truncate">{fileName}</p>
                </div>

                {/* Progress bar */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Progress</span>
                        <span className="text-xs font-medium text-gray-700">
                            {Math.round(progress)}%
                        </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                            className={`h-full transition-all duration-300 ease-out rounded-full ${getStatusColor()}`}
                            style={{
                                width: `${Math.min(100, Math.max(0, progress))}%`,
                                backgroundImage: status === 'uploading'
                                    ? 'linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent)'
                                    : 'none',
                                backgroundSize: status === 'uploading' ? '20px 20px' : 'auto',
                                animation: status === 'uploading' ? 'progress-stripes 1s linear infinite' : 'none'
                            }}
                        />
                    </div>
                </div>

                {/* Speed and time info (for uploading state) */}
                {status === 'uploading' && (
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                        <span>2.3 MB/s</span>
                        <span>{progress < 100 ? `${Math.ceil((100 - progress) / 10)}s remaining` : 'Almost done...'}</span>
                    </div>
                )}

                {/* Success/Error message */}
                {status === 'success' && (
                    <div className="mt-2 text-xs text-green-600">
                        File uploaded successfully!
                    </div>
                )}

                {status === 'error' && (
                    <div className="mt-2 text-xs text-red-600">
                        Failed to upload. Please try again.
                    </div>
                )}
            </div>

            <style jsx>{`
        @keyframes progress-stripes {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 20px 0;
          }
        }
      `}</style>
        </div>
    );
};

export default UploadProgress;