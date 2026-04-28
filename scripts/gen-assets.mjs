import sharp from 'sharp'
import fs from 'fs/promises'
import path from 'path'

const root = path.resolve(import.meta.dirname, '..')
const out = path.join(root, 'resources')
await fs.mkdir(out, { recursive: true })

const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#ff6fa3"/>
      <stop offset="0.5" stop-color="#b760ff"/>
      <stop offset="1" stop-color="#5ec8ff"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="14"/>
    </filter>
  </defs>
  <rect width="1024" height="1024" fill="url(#bg)"/>
  <g transform="translate(512 540)">
    <circle r="380" fill="rgba(0,0,0,0.18)" filter="url(#shadow)" cy="20"/>
    <circle r="370" fill="#ffffff" opacity="0.15"/>
    <path fill="#ffd64a" stroke="#ffffff" stroke-width="22" stroke-linejoin="round"
      d="M0 -300 L88 -100 L300 -68 L150 80 L186 290 L0 192 L-186 290 L-150 80 L-300 -68 L-88 -100 Z"/>
  </g>
</svg>`

const SPLASH_SVG = (bg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2732 2732">
  <defs>
    <radialGradient id="rg" cx="0.5" cy="0.5" r="0.7">
      <stop offset="0" stop-color="${bg === 'dark' ? '#3a1f4d' : '#ffffff'}"/>
      <stop offset="1" stop-color="${bg === 'dark' ? '#1a0d2e' : '#ffeaf4'}"/>
    </radialGradient>
  </defs>
  <rect width="2732" height="2732" fill="url(#rg)"/>
  <g transform="translate(1366 1366)">
    <path fill="#ffd64a" stroke="${bg === 'dark' ? '#ffffff' : '#ff6fa3'}" stroke-width="30" stroke-linejoin="round"
      d="M0 -380 L112 -125 L380 -85 L190 100 L235 365 L0 245 L-235 365 L-190 100 L-380 -85 L-112 -125 Z"/>
  </g>
</svg>`

await sharp(Buffer.from(ICON_SVG)).resize(1024, 1024).png().toFile(path.join(out, 'icon.png'))
await sharp(Buffer.from(SPLASH_SVG('light'))).resize(2732, 2732).png().toFile(path.join(out, 'splash.png'))
await sharp(Buffer.from(SPLASH_SVG('dark'))).resize(2732, 2732).png().toFile(path.join(out, 'splash-dark.png'))

console.log('Generated icon.png, splash.png, splash-dark.png in resources/')
