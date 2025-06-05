class FileStorage {
    private static instance: FileStorage;
    private files: Map<string, File>;
    private urlCache: Map<string, string>;

    private constructor() {
        this.files = new Map();
        this.urlCache = new Map();
    }

    public static getInstance(): FileStorage {
        if (!FileStorage.instance) {
            FileStorage.instance = new FileStorage();
        }
        return FileStorage.instance;
    }

    public storeFile(file: File): string {
        const fileId = crypto.randomUUID();
        this.files.set(fileId, file);
        return fileId;
    }

    public getFile(fileId: string): File | undefined {
        return this.files.get(fileId);
    }

    public hasFile(fileId: string): boolean {
        return this.files.has(fileId);
    }

    public createObjectURL(fileId: string): string {
        if (!this.hasFile(fileId)) {
            throw new Error('File not found');
        }

        if (this.urlCache.has(fileId)) {
            return this.urlCache.get(fileId)!;
        }

        const file = this.getFile(fileId)!;
        const url = URL.createObjectURL(file);
        this.urlCache.set(fileId, url);
        return url;
    }

    public revokeObjectURL(fileId: string): void {
        if (this.urlCache.has(fileId)) {
            URL.revokeObjectURL(this.urlCache.get(fileId)!);
            this.urlCache.delete(fileId);
        }
    }

    public removeFile(fileId: string): void {
        if (this.hasFile(fileId)) {
            this.revokeObjectURL(fileId);
            this.files.delete(fileId);
        }
    }

    public clear(): void {
        // Revoke all object URLs
        this.urlCache.forEach((url) => {
            URL.revokeObjectURL(url);
        });
        
        // Clear all stored data
        this.files.clear();
        this.urlCache.clear();
    }
}

export const fileStorage = FileStorage.getInstance();
