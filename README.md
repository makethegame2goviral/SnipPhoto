# SnipPhoto

Responsive social camera app prototype built with Vite and vanilla JavaScript.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Current status

The initial UI includes a responsive camera screen, browser camera permission flow, local photo capture, chat preview, Stories, SnipShorts demo cards, profile/settings, PWA manifest and app icon.

**Backend is not connected yet.** Authentication, persistent chats/media, friend relationships, moderation and admin permissions require a Supabase project. Never put a Supabase service-role or secret key in frontend code; only a publishable/anon key may be used by the browser client.

## Privacy and safety

- Location sharing is opt-in and off by default.
- No hidden saving or bypassing privacy protections for other people's disappearing media.
- Admin privileges must be enforced server-side.
- Camera access requires browser permission and HTTPS.