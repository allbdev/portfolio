# Project screenshots

Screenshot assets for the project detail pages (`/[lang]/projeto/[slug]`).

## Convention

- One folder per project, named after the project **slug**: `public/projects/<slug>/`.
- Screenshot files are named `screenshot-1.png`, `screenshot-2.png`, … (1-indexed, in display order).
- All images share a **16:9** aspect ratio (1600×900) so the carousel renders consistently.
- Referenced from the dictionary as `screenshots[].src = "/projects/<slug>/screenshot-N.png"`.

## Current assets

| Slug                        | Files                                   |
| --------------------------- | --------------------------------------- |
| `path-trader`               | `screenshot-1.png` … `screenshot-3.png` |
| `vestra-gestao-financeira`  | `screenshot-1.png` … `screenshot-3.png` |
| `rick-and-morty-explorer`   | `screenshot-1.png` … `screenshot-3.png` |

> The current images are branded 16:9 placeholders. Replace them with real captures when
> available, keeping the same filenames/paths (or update `screenshots[].src` in
> `app/dictionaries/{en,pt}.json` accordingly).
