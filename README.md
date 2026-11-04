# SnipPhoto

A responsive Snapchat-inspired social app project.

## Current milestone

This repository contains the first responsive **frontend prototype**:
- Yellow SnipPhoto visual identity and responsive desktop, tablet and mobile layout
- Camera permission flow, front/back camera switching where supported, and local photo capture
- Gallery file preview and visual filter previews
- Chat, Stories, SnipShorts, Memories and Snap Map navigation placeholders
- Dark mode toggle
- PWA manifest, SVG icon and basic app-shell service worker

**Important:** This is a frontend prototype, not yet a production social network. Accounts, real-time messaging, media uploads, friends, stories, Streaks, moderation and admin tools are not connected yet.

## Run locally

Serve the project with a local web server. Camera access requires HTTPS or localhost.

## Supabase setup (next milestone)

The app is intended to use Supabase Auth, Postgres, Realtime and Storage. No Supabase project has been selected for SnipPhoto yet. Never put a service-role or secret key in browser code or commit credentials to GitHub. Use a publishable key in the browser and keep server secrets in secure server-side configuration.

## Planned next steps

1. Select the dedicated Supabase project for SnipPhoto.
2. Design and apply database tables with Row Level Security (RLS).
3. Implement account registration and sign-in, profiles and friend requests.
4. Add private chats, Snaps, Stories, SnipShorts and protected media storage.
5. Implement reports, moderation and secure Super-Admin permissions.
6. Test privacy, access rules and mobile/PWA behavior before public launch.

## Privacy principles

- Location sharing is opt-in and off by default.
- No voice or video calling feature.
- Media and private messages must be protected by server-side authorization.
- Admin permissions must never rely only on a username or client-side flag.
