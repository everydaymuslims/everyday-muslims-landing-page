# Everyday Muslims — Coming Soon

A responsive landing page for the Everyday Muslims launch, with a word-by-word headline reveal, a bead-by-bead tasbeeh animation, and a newsletter signup.

Built with Next.js, Tailwind CSS, GSAP, Framer Motion, and SQLite.

## Run locally

Requires Node.js 24 or later.

```bash
npm ci
npm run dev
```

Open [the local preview](http://127.0.0.1:3174/).

## Production preview

```bash
npm run build
npm start
```

## Newsletter

The signup form stores email addresses and signup timestamps in a local SQLite database. Run `npm run newsletter:export` to export the list for a mailing platform.

## Project files

| Path | Contents |
| --- | --- |
| `app/` | Landing page, styles, animations, and signup endpoint |
| `lib/` | Newsletter storage |
| `public/identity/` | Brand artwork and favicon |
| [Digital Brand Guide](Everyday%20Muslims%20Guidebook.pdf) | Logo guidelines, typography, colours, motion, and responsive mockups |

## Credits

Designed and developed for Everyday Muslims by [Comova Systems](https://comovasystems.com/).

## Confidentiality

This project is covered by the applicable confidentiality agreement. Share or reuse the source code, brand assets, and documentation only with authorization.
