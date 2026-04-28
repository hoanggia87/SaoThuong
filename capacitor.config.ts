import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.tranhoanggia.diemthuong',
  appName: 'StarKids',
  webDir: 'dist',
  ios: {
    contentInset: 'never',
    backgroundColor: '#fff7ef',
    scrollEnabled: false,
  },
}

export default config
