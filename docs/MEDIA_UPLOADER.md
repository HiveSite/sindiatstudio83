# Studio83 Media Uploader

Private route: `/studio83-media/`

Server endpoint: `/api/studio83-media`

## Required Netlify environment variables

Set both variables for the **Production** context and **Functions** scope:

- `STUDIO83_MEDIA_PASSWORD` - private login password for the uploader.
- `STUDIO83_GITHUB_TOKEN` - fine-grained GitHub token with repository access limited to `HiveSite/sindiatstudio83` and Contents read/write permission.

Optional overrides:

- `STUDIO83_GITHUB_REPO` - defaults to `HiveSite/sindiatstudio83`.
- `STUDIO83_GITHUB_BRANCH` - defaults to `main`.

## Flow

1. User opens `/studio83-media/` and signs in.
2. User selects JPG, JPEG or PNG files for a case-study project.
3. Browser resizes the longest edge to at most 1800px and converts images to WebP.
4. The server validates the project and slot names. Arbitrary repository paths cannot be submitted from the browser.
5. All selected files for that project are written to one Git tree and one commit on the configured branch.
6. The existing Netlify Git integration deploys the new commit.
7. Case-study cover and gallery components use the predefined file paths. Before a file exists they fall back cleanly instead of displaying a broken image.

## Managed folders

- `public/images/cases/promo-timovi/`
- `public/images/cases/regulisane-aktivacije/`
- `public/images/cases/dogadjaji/`
- `public/images/cases/student-connect/`
- `public/images/cases/podgoricki-pazar/`

The route is intentionally excluded from the sitemap and declares `noindex, nofollow` metadata.
