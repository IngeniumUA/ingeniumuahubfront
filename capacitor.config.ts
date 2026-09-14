import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'production.com.app.ingeniumua',
  appName: 'Ingenium',
  webDir: 'build',
  plugins: {
    "CapacitorHttp": {
      "enabled": true
    },
    "CapacitorCookies": {
      "enabled": true,
    },
  }
};

export default config;
