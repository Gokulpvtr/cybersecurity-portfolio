# Gokulkrishnan S: 3D Cybersecurity Portfolio

React + Three.js portfolio with a flowing "anti-gravity" look:

- **3D hero:** a network sphere scanned by a moving plane (nodes flash red when hit), 14,000 GPU particles that flow upward and scatter away from your cursor, and floating wireframe shapes that dodge the mouse.
- **Cursor:** a comet trail that flows behind the mouse, a ring that locks onto buttons like a targeting reticle, and click shockwaves with sparks that float upward.
- **Glass everywhere:** frosted 3D cards that tilt toward the cursor with icons that pop out of the glass, a floating glass nav, and a social dock.
- **Scroll effects:** inertial smooth scrolling, word-by-word heading reveals, cards that float in with a 3D tilt, sliding text bands that speed up and skew with your scroll speed, a timeline that draws itself, and a scroll-driven camera.
- **Adaptive performance:** if a device runs slowly, the site switches itself to a lighter mode (fewer particles, no glass blur). Add `?lite` to the URL to force it.

Stack: React 18, Vite, @react-three/fiber (Three.js), Framer Motion, Lenis.

## Run it

You need Node.js 18 or newer (https://nodejs.org, choose LTS).

```bash
npm install
npm run dev
```

Open the address it prints (usually http://localhost:5173).

```bash
npm run build      # creates the dist/ folder
npm run preview    # test the built site locally
```

## Edit your content

Everything is in one file: **`src/data.js`**

| To change | Edit |
|---|---|
| Name, typing roles, intro | `profile` |
| Email, LinkedIn, TryHackMe, GitHub | `profile` (also the `socials` list, which reads from it) |
| Floating tags in the hero | `floatTags` |
| Sliding text bands | `marquee` |
| About text and quick facts | `about` |
| Skills | `skills` |
| Stat numbers under the hero | `stats` |
| Repo cards | `projects` |
| Certificates | `certifications` |
| Experience and education | `timeline` |

Search the file for `EDIT` to find values that need a check.

## Photo, certificates, resume

- **Photo:** `public/profile.jpg` (already added). Replace the file to change it.
- **Certificates:** put the image in `public/certs/`, then set `image: 'certs/your-file.png'` on that certificate in `src/data.js`. Click a card on the site to flip it and view the image. Optional `url` adds a "Verify credential" link.
- **Resume:** put `resume.pdf` in `public/`, then set `resume: 'resume.pdf'` in `src/data.js`.

## Project status on the cards

- `active` (green): links to `github.com/Gokulpvtr/<repo>`
- `progress` (cyan): same, marked "In progress"
- `planned` (amber): shows "Repository coming soon", no link

Create the repo on GitHub, then change its status to `active`.

## Change the look

- Colors and fonts: the `:root` block at the top of `src/styles.css`
- 3D scene: `src/components/Scene3D.jsx`
  - particle counts: `count` in `Contents`
  - cursor push strength: `uPush` in `Flow`
  - scan speed: the `0.7` in `Math.sin(t * 0.7 * motion)`
- Cursor: `src/components/CursorFX.jsx` (`TRAIL_LIFE` sets how long the comet trail lasts)
- Scroll smoothness: `lerp: 0.085` in `src/App.jsx` (lower is smoother and slower)

Accessibility: keyboard focus outlines, a "reduce motion" setting turns down animation and disables smooth scroll, and the custom cursor only runs on devices with a real mouse.

## Publish it (free)

**GitHub Pages** (workflow included in `.github/workflows/deploy.yml`)
1. Create a repo (for example `portfolio`) and push this folder to the `main` branch.
2. Repo **Settings → Pages → Source: GitHub Actions**.
3. Your site appears at `https://gokulpvtr.github.io/portfolio/`.

**Vercel or Netlify:** import the repo. Build command `npm run build`, output folder `dist`.

## Try it without installing

Push the project to GitHub, then open `https://stackblitz.com/github/Gokulpvtr/<your-repo>`.

## Troubleshooting

- **Blank 3D area or a WebGL error:** update the browser and turn on hardware acceleration. The rest of the page still works.
- **Feels heavy on a laptop:** it should switch to lite mode on its own. To force it, open the site with `?lite` at the end of the address, or lower `count` in `Scene3D.jsx`.
- **`npm install` fails:** check that `node -v` shows 18 or higher.
- **Fonts look different offline:** they load from Google Fonts, so they need internet the first time.

## Folder guide

```
src/
  data.js            <- all your content
  styles.css         <- colors, glass, layout, animations
  App.jsx            <- page order, smooth scroll, performance switch
  components/
    Scene3D.jsx      <- particles, sphere, floating shapes
    CursorFX.jsx     <- cursor, trail, click effects
    TiltCard.jsx     <- 3D glass card
    Marquee.jsx      <- sliding text bands
    Nav.jsx  SocialDock.jsx  Socials.jsx  Loader.jsx
    Hero.jsx  About.jsx  Skills.jsx  Projects.jsx
    Certifications.jsx  Experience.jsx  Contact.jsx  Footer.jsx
public/
  profile.jpg        <- your photo
  certs/             <- certificate images (add these)
```
