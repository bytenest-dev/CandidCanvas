# Candid Canvas BD

**Premium Photography • Cinematography • Reels • Events Platform**

> "Highlight The Storytelling Aspect Of Photography, Preserving Special Moments"

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── home/         # Homepage sections (Hero, Gallery, Services, etc.)
│   ├── layout/       # Navbar, Footer, FloatingContact
│   └── ui/           # Reusable UI (Button, Input, Badge, Modal)
├── context/
│   └── AuthContext.tsx   # Firebase Auth + user roles
├── lib/
│   ├── firebase.ts   # Firebase configuration
│   └── utils.ts      # Helpers, constants, demo data
├── pages/
│   ├── HomePage.tsx
│   ├── GalleryPage.tsx
│   ├── PackagesPage.tsx
│   ├── AboutPage.tsx
│   ├── ContactPage.tsx
│   ├── BookingPage.tsx
│   ├── DashboardPage.tsx  # Customer dashboard
│   └── AdminPage.tsx      # Admin dashboard
└── types/
    └── index.ts       # TypeScript types
```

---

## 🔥 Firebase Setup

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Authentication** → Google Sign-In
3. Enable **Firestore Database**
4. Enable **Storage**
5. Copy your config values to `.env`:

```bash
cp .env.example .env
# Fill in your Firebase values
```

### Making a User Admin

In Firebase Firestore, go to the `users` collection, find the user document, and set:
```json
{ "role": "admin" }
```

---

## 🌐 Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

---

## 🎨 Design System

| Property | Value |
|----------|-------|
| Primary Font | Cormorant Garamond |
| Body Font | Inter |
| Mono Font | JetBrains Mono |
| Primary BG | #FFFFFF |
| Primary Text | #111827 |
| Accent | #374151 |

---

## 📱 Pages

| Route | Page |
|-------|------|
| `/` | Homepage with cinematic hero |
| `/gallery` | Masonry photo gallery |
| `/packages` | Pricing packages |
| `/about` | Brand story, team, timeline |
| `/contact` | Contact form + map |
| `/book` | 3-step booking form |
| `/dashboard` | Customer dashboard |
| `/admin` | Admin management panel |

---

## 📞 Contact

- **Phone/WhatsApp:** +8801849244610
- **Instagram:** [@candidcanvasbd](https://www.instagram.com/candidcanvasbd)
- **Facebook:** [Candid Canvas BD](https://www.facebook.com/share/17gEprkrqh/)
- **YouTube:** [@candid.canvas_bd](https://youtube.com/@candid.canvas_bd)
- **TikTok:** [@candidcanvasbd](https://www.tiktok.com/@candidcanvasbd)
