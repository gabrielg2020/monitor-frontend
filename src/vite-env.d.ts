/// <reference types="vite/client" />
declare global {
    interface Window {
        ENV: {
            API_ADDRESS: string;
            API_PORT: string;
            API_VERSION: string;
        }
    }
}

export {}