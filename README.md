# zeena.mp3 — NFC portfolio card

A single-page site styled like a Sony Walkman. Tap the NFC tag → it opens this
page → boot animation → track-style navigation to your links.

## File map

```
zeena-mp3/
├── index.html          the whole site — you shouldn't need to touch this
├── config.js           ← EDIT THIS for your LinkedIn / GitHub / Tovio links
├── assets/
│   └── cv.pdf           ← PUT YOUR REAL CV FILE HERE (exact filename)
└── README.md
```

## 1. Add your links

Open `config.js`. It's three lines:

```js
const LINKS = {
  linkedin: "https://www.linkedin.com/in/PLACEHOLDER",
  github:   "https://github.com/PLACEHOLDER",
  tovio:    "https://PLACEHOLDER-tovio-project-link.com"
};
```

Replace each placeholder URL with your real one. Save. That's the only file
you need to edit for links.

## 2. Add your CV

Drop your resume file into the `assets` folder and rename it exactly to:

```
cv.pdf
```

So the final path is `assets/cv.pdf`. Both the "DOWNLOAD CV" text button and
clicking the USB cap point to this same file already — no code changes needed.
Delete `assets/PUT_CV_HERE.txt` once your real file is in there (it's just a
placeholder marker, doesn't affect the site if you leave it).

## 3. Try it locally

**Important:** don't just double-click `index.html`. Opening a page directly
as a `file://` URL makes most browsers (Chrome especially) block downloads
for security reasons — so the "DOWNLOAD CV" button and USB cap can look
completely broken even when `cv.pdf` is right there in the right place.
This isn't a bug in the site, it's a browser restriction on local files.

Run a tiny local server instead (one command, no install needed if you have
Python):

```bash
# from inside the zeena-mp3 folder
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

Test the CV button there. It'll also work correctly once actually deployed
(step 4) — same reason, it's no longer `file://` at that point.

## 4. Deploy it (free, pick one)

**GitHub Pages**
1. Create a new GitHub repo, push these files to it.
2. Repo Settings → Pages → Source: deploy from branch `main` / root.
3. Your URL will be `https://yourusername.github.io/repo-name/`.

**Vercel** or **Netlify**
1. Drag-and-drop the `zeena-mp3` folder into the Vercel/Netlify dashboard
   (both support "drop a folder" deploys, no git needed).
2. You'll instantly get a URL like `https://zeena-mp3.vercel.app`.

Once you have your final URL, write it to your NFC tags (any NFC-writing app,
e.g. NFC Tools on iOS/Android) as a "URL/URI" record.

## 5. Buying a domain later

When you get a domain, point it at whichever host you used above (all three
support custom domains for free) and re-write your NFC tags with the new URL.

## Customizing further

- **Swap the USB graphic**: `index.html` has an inline `<svg>` for the thumb
  drive (search for `USB thumb-drive graphic`). If you'd rather use a real
  photo, save an image into `assets/` (e.g. `assets/usb.png`) and replace the
  `<svg>...</svg>` block with `<img src="assets/usb.png" class="h-16 w-12 mb-1">`.
- **Colors / red dial / screen green**: all controlled by the Tailwind config
  block near the top of `index.html` (`primary`, `tertiary`, etc.).
- **Boot text**: search `BOOTING...` / `LOADING...` / `TRACKS... 4` inside the
  `<script>` at the bottom of `index.html`.
