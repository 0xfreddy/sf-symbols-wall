# SF Symbols Wall

A React/Vite symbol browser inspired by sparse iOS icon-gallery layouts. Click any tile to copy the SF Symbol name.

## Features

- 1,672 symbols from the `andrewtavis/sf-symbols-online` reference set
- Search by symbol name
- Quick filters for filled, outline, circle, and square symbols
- Dark and light mode
- Clipboard copy on click
- Glossy iOS-style symbol tiles

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

Glyph metadata is generated from `andrewtavis/sf-symbols-online`, and glyph images load from that repository's raw GitHub assets to keep the deployment small. This project is not affiliated with Apple.
