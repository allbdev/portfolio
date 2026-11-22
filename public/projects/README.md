# Project screenshots

Screenshot assets for the project detail pages (`/[lang]/projeto/[slug]`).

## Convention

- One folder per project, named after the project **slug**: `public/projects/<slug>/`.
- Files are **AVIF**, named after what they show (e.g. `cart-receipt.avif`), listed in display order in the dictionary.
- All images share a **16:9** aspect ratio (1600×900) so the carousel renders consistently. Phone apps are shown as phone frames side by side on a 16:9 canvas.
- Referenced from the dictionary as `screenshots[].src = "/projects/<slug>/<name>.avif"` in `app/dictionaries/{en,pt}.json`.
- Encoding used: `ffmpeg -i in.png -vf scale=1600:900 -frames:v 1 -c:v libsvtav1 -crf 32 -pix_fmt yuv420p out.avif`.

## Current folders

`path-trader`, `vestra-gestao-financeira`, `tavi`, `bem-coberto`, `park-the-cart`, `the-single-hole`, `cartorio-simulator`, `my-links`, `dig-to-japan`, `shave-the-capybara`.
