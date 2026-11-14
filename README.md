# ethauber.github.io

Personal site for Elijah Hauber: a single scrollable page (home, works, blog)
plus a few standalone pages. Built with Jekyll and deployed to GitHub Pages by
GitHub Actions.

## Where things live

| Path | What it is |
| --- | --- |
| `index.html` | The one-page site. It only stitches together the section includes. |
| `_includes/sections/` | `home.html`, `works.html`, `blog.html`: one file per section. |
| `_includes/` | Shared pieces: `head`, `nav`, `footer`, `social-links`, skill, work and fractal cards. |
| `_layouts/` | `default` (nav, footer, scripts), `page` (simple pages), `post` (blog posts). |
| `_data/` | The content. Edit these instead of HTML (see below). |
| `_posts/` | Blog posts in Markdown. |
| `space/` | The planet explorer, linked from Works. |
| `arcana/` | The MTG color identity quiz, linked from Works. |
| `games/` | Exported game builds (Godot, Unity). Do not edit by hand. |
| `works/`, `blog/`, `about/`, `privacy/` | Standalone pages that reuse the same includes. |
| `assets/css/main.css` | All site styles. Colours and fonts are tokens at the top (one block for light, one for dark); `easter-eggs.css` and `terminal.css` only style the hidden extras. `assets/css/vendor/` and `assets/js/vendor/` hold Bootstrap 4, jQuery and Popper. |
| `assets/js/` | `site.js` (nav), `fractals.js`, `planets.js`, `theme-toggle.js`, and the easter eggs (`konami.js`, `terminal.js`). |
| `docs/`, `scripts/` | Notes and repo tooling. Not published. |

## Common edits

- **Add a game or project:** add an item to `_data/works.yml`. Put a
  screenshot in `assets/` and set `image:`; without one the card shows `emoji:`.
- **Add or remove a skill:** edit `_data/skills.yml`. Icons go in `assets/icons/`.
- **Update work history or education:** `_data/experience.yml`.
- **Certifications:** `_data/certifications.yml`.
- **Social links (hero and footer):** `_data/social.yml`.
- **Planet facts:** `_data/space.yml`.
- **Years of experience, email, location, analytics and ad ids:** `_config.yml`.
- **New blog post:** add `_posts/YYYY-MM-DD-title.md` with `layout: post` and a
  `title` in the front matter. Add `updated: YYYY-MM-DD` and a `## Changelog`
  heading to show an updated date on the home page.
- **Add a nav item:** `_data/nav.yml` (the `section` is the id of a section on
  the home page).

## Run locally

Ruby version is pinned in `.ruby-version` and `mise.toml`.

```bash
bundle install
bundle exec jekyll serve --livereload
```

On Windows, follow <https://jekyllrb.com/docs/installation/windows/> first.

Optional, to run the same checks CI runs before you commit:

```bash
pip install pre-commit && pre-commit install
```

## CI/CD

`.github/workflows/deploy.yml`

- **Pull requests:** lint (pre-commit hooks), build the site, and check every
  internal link, image and script with html-proofer. Nothing is published.
- **Pushes to `main`:** the same checks, then deploy to GitHub Pages. A failed
  check blocks the deploy.
- **Deploy a PR before merging:** add the `deploy` label to the PR. That run
  (and every later push to the PR while the label is on) publishes the PR build
  to the live site. There is only one Pages site, so this replaces production
  until the next deploy; merging or re-running the latest `main` run restores
  it. Remove the label to stop. Forks cannot deploy.

`.github/workflows/links.yml` checks outbound links every Monday, since those
break without any change to this repo.

Dependabot opens monthly PRs for GitHub Actions and gems. Updates are grouped
per ecosystem in `.github/dependabot.yml`, so expect at most two PRs a month:
one for actions and one for gems. Two things a green PR does not prove:

- `upload-pages-artifact` and `deploy-pages` only run on a deploy, so a bump to
  either is first exercised on the push to `main` (or with the `deploy` label).
- CI builds with `actions/jekyll-build-pages`, which uses its own gems, so
  `Gemfile.lock` changes only affect local builds. Run
  `bundle exec jekyll build` locally before merging a gem PR.

If ungrouped PRs ever pile up, combine them on one branch: cherry-pick each PR
head (`git fetch origin pull/N/head:pr-N`), resolve `Gemfile.lock` conflicts
with `bundle update <gem>` rather than by hand, open one PR, then close the
originals with a pointer to it.

## Issue Tracking with Beads

This repository uses **[Beads (bd)](https://beads.software/)** for issue tracking and workflow management. Beads provides a git-native, lightweight alternative to traditional issue trackers.

### Quick Commands
```bash
bd ready           # Find available work
bd show <id>       # View issue details
bd update <id> --claim  # Claim an issue
bd close <id>      # Complete an issue
bd prime           # See full workflow context
```

For detailed setup and usage, see [AGENTS.md](./AGENTS.md) and [CLAUDE.md](./CLAUDE.md).

### Known Gotchas

**Dolt Database Naming**: If you encounter an error like `invalid database name: "ethauber.github.io"` when running `bd list`, this is due to Dolt embedded databases not supporting dots in database names. The fix is to update `.beads/metadata.json`:

- Change `"dolt_database": "ethauber.github.io"` to `"dolt_database": "ethauber_github_io"` (replace dots with underscores).

This is typically resolved automatically, but can occur after certain operations or migrations.
