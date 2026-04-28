import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.tranhoanggia.diemthuong',
  appName: 'Điểm Thưởng',
  webDir: 'dist',
  ios: {
    contentInset: 'always',
    backgroundColor: '#fff5e6',
    scrollEnabled: false,
  },
}

export default config
