// A plain app.json can't be conditional, and the GitHub Pages deploy needs
// asset URLs prefixed with the repo path (e.g. /airbnb) while local dev and
// `expo export` stay root-relative — so this reads GH_PAGES_BASE_URL (set
// only by the Pages deploy workflow) to toggle `experiments.baseUrl`.
const ghPagesBaseUrl = process.env.GH_PAGES_BASE_URL;

module.exports = {
  expo: {
    name: 'Compass',
    slug: 'compass',
    scheme: 'compass',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#F4F1EC',
        foregroundImage: './assets/android-icon-foreground.png',
        backgroundImage: './assets/android-icon-background.png',
        monochromeImage: './assets/android-icon-monochrome.png',
      },
      predictiveBackGestureEnabled: false,
    },
    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro',
      output: 'single',
    },
    plugins: ['expo-router'],
    ...(ghPagesBaseUrl ? { experiments: { baseUrl: ghPagesBaseUrl } } : {}),
  },
};
