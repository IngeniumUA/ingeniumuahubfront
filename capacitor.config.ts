import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'development.com.app.ingeniumua',
  appName: 'Ingenium',
  webDir: 'www',
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    // CapacitorCookies: {
    //   enabled: true
    // }
  }
};

export default config;
