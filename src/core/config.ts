class EnvironmentSettings {
    private static instance: EnvironmentSettings;
    private readonly env: string;
    
    // Public settings
    public readonly DEFAULT_PAGE: number = 1;
    public readonly DEFAULT_PAGE_LIMIT: number = 10;
    public readonly MAX_RECONNECT_ATTEMPTS: number = 3;
    public readonly RECONNECT_DELAY: number = 5000;
    
    // Environment-dependent variables
    public readonly API_KEY: string;
    public readonly SECRET_KEY: string;
    public readonly API_BASE_URL: string;

    private constructor() {
        this.env = process.env.NEXT_PUBLIC_ENV || 'development';
        
        // Initialize environment-dependent variables
        this.API_KEY = process.env.NEXT_PUBLIC_API_KEY || '';
        this.SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || '';
        this.API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';  
        
        this.logEnvironment();
    }

    public static getInstance(): EnvironmentSettings {
        if (!EnvironmentSettings.instance) {
            EnvironmentSettings.instance = new EnvironmentSettings();
        }
        return EnvironmentSettings.instance;
    }

    private getEnvironmentEmoji(): string {
        const environmentEmojis: Record<string, string> = {
            development: '🛠️',
            production: '🚀',
            staging: '🔍',
            test: '🧪'
        };
        
        return environmentEmojis[this.env] || '❓';
    }

    private logEnvironment(): void {
        console.log(
            `${this.getEnvironmentEmoji()} Running in ${this.env} mode\n`
        );
    }

    // Add any additional utility methods as needed
    public isProduction(): boolean {
        return this.env === 'production';
    }

    public isDevelopment(): boolean {
        return this.env === 'development';
    }
}

// Export a single instance of the settings
export const settings = EnvironmentSettings.getInstance();