import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nakaerp.app',
  appName: 'Naka ERP',
  webDir: 'out',
  server: {
    url: 'http://192.168.18.150:3001',
    cleartext: true
  }
};

export default config;
