# Compass

A pictorial, time-bound personal assistant — built for ADHD-friendly organization across
business, family, personal time, and daily routines.

Instead of text-heavy lists, everything is a big icon with a time attached: a **Today**
timeline that always answers "what do I do right now," and **Boards** per life area for
planning ahead.

## Screens

- **Today** — a "right now / up next" hero card plus a vertical timeline of the day, one
  big tappable card per item (icon, time, category color). Tap to mark done, long-press to
  remove.
- **Boards** — four life areas (Business, Family, Personal, Routine) as big icon tiles with
  a live count of what's coming up this week. Tap into one to see everything upcoming,
  grouped by day, including recurring items projected forward.
- **Add** — quick-add flow: pick a life area, pick an icon, name it, pick a time with the
  native time picker, and choose how it repeats (once / daily / weekdays / weekly).
- **Settings** — status of every planned integration and exactly what each one needs from
  you before it can be wired in (see below).

## Stack

Expo (React Native + TypeScript) with `expo-router` for navigation, so it runs as a real
app on iOS/Android from one codebase (and can run in a browser too via `npm run web`).
Data lives entirely on-device (`AsyncStorage`) — nothing leaves your phone today.

```
src/
  types.ts        # Item / Category / Recurrence types
  theme.ts         # category colors + icon choices
  time.ts          # date/time helpers
  agenda.ts         # recurrence expansion (what occurs on which date)
  store.tsx        # AsyncStorage-backed data layer (React context)
  seed.ts           # sample starter data
  components/       # ItemRow, Fab
app/
  _layout.tsx        # root stack + providers
  (tabs)/            # Today, Boards, Settings
  boards/[category].tsx
  add.tsx             # modal
```

## Running it

```
npm install
npm run start   # scan the QR code with Expo Go on your phone
# or
npm run android
npm run ios      # requires a Mac
npm run web
```

## Installing on iPhone as a PWA (no Apple Developer account)

Building a real, signed iOS app needs an Apple Developer account ($99/year). To skip that
entirely, Compass can be installed straight from Safari as a Progressive Web App — a real
home-screen icon, full-screen (no browser chrome), and it keeps working offline after the
first load, all for free:

1. Push to `main` (or run the **Deploy PWA to GitHub Pages** workflow manually from the
   Actions tab, on any branch) — it exports the web build and deploys it to GitHub Pages.
2. One-time repo setting: **Settings → Pages → Build and deployment → Source: "GitHub
   Actions"**. After that the workflow's URL (shown in the Pages settings and in the
   workflow run) is live.
3. On your iPhone, open that URL in **Safari** (must be Safari, not Chrome — iOS only
   supports "Add to Home Screen" installs from Safari), tap the Share icon, then
   **Add to Home Screen**.

That's it — Compass now has its own icon on your home screen and opens full-screen like a
native app. Re-running the workflow (e.g. after a `main` push) updates it in place.

## Email digest sync (Firestore)

An external routine (running on a 4-hourly schedule) summarizes your Gmail inbox, archives
non-actionable mail, and — once configured — writes a short digest to Firestore. Compass
reads that on launch and folds it in as a normal item (source `email_digest`), so it just
shows up on the Today timeline like anything else, without needing you to open Gmail.

Compass talks to Firestore over its plain REST API with `fetch()` — no Firebase SDK
dependency, and no secret involved: `src/firebaseConfig.ts` holds only the public
`projectId`/`apiKey` (these identify the project, they don't authorize anything — security
comes entirely from `firestore.rules`, which allow reading everything in `emailDigests` but
only *creating* new documents in one exact shape, never updating or deleting, and deny
every other path outright). To enable it:

1. Create a Firebase project (console.firebase.google.com) with Firestore enabled
2. Paste `firestore.rules` into Firestore → Rules → Publish
3. Fill in `projectId`/`apiKey` from Project settings → Your apps → Web app into
   `src/firebaseConfig.ts`
4. Redeploy the PWA

Leave `firebaseConfig.ts` blank and Compass just skips sync entirely — everything else
works the same either way.

## Integration roadmap

The app is architected so each item carries a `source` (`manual`, `google_calendar`,
`whatsapp`, `phone_call`, `wearable`) — today everything is `manual`, added by you. Wiring
in a real source means writing a sync function that turns that source's events into `Item`s
via the same `addItem`/`updateItem` calls the Add screen already uses. What each one needs
from you first:

| Source | What it needs |
|---|---|
| **Google Calendar & Meet** | A Google Cloud project + OAuth client, and you signing in from the app. Meet links ride along on calendar events automatically — no separate integration needed. |
| **WhatsApp** | A WhatsApp Business API account through Meta (personal WhatsApp has no integration API to read messages from). |
| **Phone calls** | Call-log/contacts permission on an Android device (iOS does not allow apps to read call history, by platform policy — there's no workaround). |
| **Wearable** | Depends on the device — tell me which one (Apple Watch, Wear OS, Garmin, Oura, …) and I'll scope the specific SDK integration. |

Once you have credentials/accounts for any of these, say so and I'll wire the actual sync —
building it against fake credentials now would just mean re-doing it later.
