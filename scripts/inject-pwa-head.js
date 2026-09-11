// expo-router's SPA ("single") web output ignores app/+html.tsx, and its
// static/SSG output currently crashes on this dependency stack (missing
// `requestAnimationFrame` during Node-side rendering). So instead we patch
// the plain, fully-working SPA build's index.html after export, adding the
// tags that make it installable as a PWA on iOS/Android.
const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
const html = fs.readFileSync(indexPath, 'utf8');

// Relative (no leading slash) so this works whether the app is served from
// the domain root or a subpath (e.g. GitHub Pages' /<repo>/).
const extraHead = `
    <meta name="description" content="A pictorial, time-bound personal assistant for business, family, personal time, and routines." />
    <link rel="manifest" href="manifest.json" />
    <meta name="theme-color" content="#FBF9F5" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="Compass" />
    <link rel="apple-touch-icon" href="icons/icon-180.png" />
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('sw.js').catch(() => {});
        });
      }
    </script>
  </head>`;

if (html.includes('rel="manifest"')) {
  console.log('PWA head tags already present, skipping.');
} else {
  fs.writeFileSync(indexPath, html.replace('</head>', extraHead));
  console.log('Injected PWA head tags into dist/index.html');
}
