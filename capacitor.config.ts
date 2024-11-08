import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'development.com.app.ingeniumua',
  appName: 'Ingenium App',
  webDir: 'www',
  plugins: {
    CapacitorHttp: {
      enabled: true,
    }
  }
};

export default config;
