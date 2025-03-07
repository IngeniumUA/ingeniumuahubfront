import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'development.com.app.ingeniumua',
  appName: 'Ingenium',
  webDir: 'build',
  plugins: {
    "CapacitorHttp": {
      "enabled": true
    }
  }
};

export default config;
