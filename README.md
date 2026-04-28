# StarKids ⭐

Family reward chart — kids earn stars for completing chores, then redeem
parent-set rewards. Animated, kid-friendly, fully offline.

Built with React + Vite + TypeScript + Tailwind, packaged as a native iOS app
via Capacitor.

## Features

- Multiple kid profiles
- Parent-defined chores with custom spin counts
- Parent-defined rewards with custom star costs
- Animated reward wheel for completed chores
- Daily history per kid
- PIN-protected parent settings
- 100% offline, no analytics, no ads

## Development

```bash
npm install
npm run dev          # web preview at http://localhost:5173
```

## iOS

Requires Xcode + CocoaPods on macOS.

```bash
npm run ios:sync     # build web + sync iOS project
npm run ios:open     # open in Xcode
```

Then in Xcode: select **Any iOS Device (arm64)** → Product → Archive →
Distribute via App Store Connect.

## Project structure

```
src/                 React/TypeScript app source
ios/App/             Capacitor-generated Xcode project
docs/                Privacy Policy & Support pages (hosted via GitHub Pages)
resources/           Source PNGs for app icon & splash
```

## Tech stack

- React 18 + TypeScript + Vite
- Tailwind CSS + Framer Motion
- Zustand (state, with localStorage persistence)
- canvas-confetti
- Capacitor 8 (iOS native shell)

## License

Personal / non-commercial.
