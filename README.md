# Amirmhmd Bagheri — Portfolio Site

Cinematic personal-brand website + admin CMS. Next.js 14 (App Router) +
TypeScript + Tailwind + Prisma + PostgreSQL, media on any S3-compatible
storage (AWS S3 / Cloudflare R2 / Supabase Storage).

## Status: feature-complete for the brief's core CMS loop

Everything content-editable from the admin, matching the brief's §14 nav:

- **Dashboard** — live counts (projects, published, new inquiries, clients)
- **Homepage / About / Showreel** — hero tagline, portrait, about bio +
  portrait, showreel video URL + thumbnail + description
- **Portfolio** — full CRUD, drag-and-drop ordering, publish toggle,
  categories, cover + gallery upload, per-project SEO, individual public
  project pages at `/projects/[id]`
- **Services** — CRUD, drag reorder, enable/disable, optional media + CTA
- **Behind the Scenes** — drag-and-drop photo/video gallery with captions
- **Clients** — logo grid, CRUD, drag reorder
- **Testimonials** — CRUD, drag reorder, optional client photo
- **Inquiries** — full pipeline (New → Contacted → In Progress → Completed
  → Rejected), private notes, delete
- **Contracts** — CRUD, PDF upload, status, optional project link
- **Social Links** — arbitrary extra platforms beyond Instagram/WhatsApp/
  Telegram (those three plus email/phone live in Site Settings)
- **Site Settings** — site name, logo, favicon, SEO title/description, OG
  image, contact info, accent/background color (color values are saved;
  live theming from them is a future enhancement — see note below)

Public site: hero → about → showreel → portfolio grid (each project links to
its own detail page) → services → behind-the-scenes → clients → testimonials
→ contact form (writes to Inquiry) → footer (pulls social links + contact
info from Site Settings). All sections hide themselves automatically when
there's no content yet, so the site never shows an empty box.

SEO: dynamic `<title>`/description/OG image from Site Settings, per-project
metadata, `/sitemap.xml`, `/robots.txt` (disallows `/admin`).

## Known scope boundaries (by design, not oversights)

- **Accent/background color in Site Settings are saved but not yet wired
  live into the Tailwind theme** — changing them updates the database, not
  the rendered colors. Wiring that up means generating CSS custom
  properties from the DB value at request time; happy to do that as a
  follow-up if you want it.
- **PDF text extraction / contract e-signing** was explicitly out of scope
  in the brief (§12 only asked for upload + status tracking) — the
  architecture (a `pdfMediaId` on `Contract`) supports adding e-signing
  later without a schema change.

## Database: already live on Supabase

The full schema is already applied to your Supabase project
(`tgnlntzdngcqmdrrkxnf`, region eu-west-1), and it's seeded with:
- An admin account — email `1`, password `1` (see the security note below)
- Default Site Settings and Homepage Content rows

To connect this code to it, get the real connection string from the
Supabase dashboard (this project → Settings → Database → Connection string
→ URI) and put it in `.env` as `DATABASE_URL`. I can't fetch or reset that
password myself — Supabase never exposes it over the API.

Once `DATABASE_URL` is set, use `npx prisma db push` instead of
`prisma migrate dev` the first time (this DB was seeded via raw SQL, not a
Prisma migration file, so there's no migration history for `migrate dev` to
reconcile against — `db push` just syncs the schema directly and won't
touch your seeded data).

**⚠️ Security:** `1` / `1` is a placeholder for quick testing only — anyone
who finds your login page can log in with it. Before this is reachable on
the public internet, change it:
```sql
-- run in the Supabase SQL editor, or via prisma studio
UPDATE "Admin" SET email = 'your-real-email', passwordHash = '<new-bcrypt-hash>' WHERE id = 'admin_seed_001';
```
(Generate a hash with `node -e "console.log(require('bcryptjs').hashSync('your-new-password', 12))"` after `npm install`.)

## Run it locally

```bash
cp .env.example .env          # fill in DATABASE_URL from Supabase (see above)
npm install
npx prisma db push            # syncs schema (already applied, this is a no-op check)
npm run dev                   # http://localhost:3000
```

Admin panel: http://localhost:3000/admin/login — email `1`, password `1`.

(If you'd rather run Postgres locally instead of Supabase, `docker-compose.yml`
is still here — swap `DATABASE_URL` back to the local one and use
`prisma migrate dev` + `npm run db:seed` instead.)

## Going live (a public login link)

I don't have a hosting/deploy connection available in this chat, so I can't
put this online myself yet and hand you a live URL. The natural fit for a
Next.js app like this is **Vercel** — connect it below and I can deploy
directly and give you the real public admin login link. If you'd rather use
something else (Railway, Netlify, Render), say so and I'll use that instead.

## Moving to a real host later

Nothing in the code is tied to your laptop:
- `DATABASE_URL` → point it at any managed Postgres (Neon, Supabase, Railway, RDS).
- `STORAGE_*` → point it at a real S3/R2/Supabase Storage bucket; the code
  already talks to it via the S3 API, so no code changes are needed. Until
  you set `STORAGE_ACCESS_KEY_ID`, uploads are written to `/public/uploads`
  on disk so local development works with zero setup.
- `NEXTAUTH_URL` / `NEXTAUTH_SECRET` → set to your production domain and a
  freshly generated secret.

## A note on how this was built

This was generated in an environment with restricted, allow-listed network
access — `npm install` and dependency resolution were verified end to end,
but the actual `next build` couldn't fully complete here because it needs
to fetch Google Fonts and the Prisma query engine binary from domains
outside that allow-list. All `@/` imports and Prisma model references were
checked by hand against the schema and file tree. On your machine, with
normal internet access, this should build cleanly — but since the full
build pipeline was never run start-to-finish in one place, budget time for
a first-run debugging pass before you consider it launch-ready.

## Design tokens

Colors, type (Vazirmatn + Bebas Neue) and layout follow the approved
cinematic direction — see `tailwind.config.ts` and `app/globals.css`.
