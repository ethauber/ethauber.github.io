# Project Instructions for AI Agents

This file provides instructions and context for AI coding agents working on this project.

<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:ca08a54f -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

## Session Completion

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd dolt push
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
<!-- END BEADS INTEGRATION -->


## Build & Test

```bash
bundle install
bundle exec jekyll build        # output in _site/
bundle exec jekyll serve --livereload
pre-commit run --all-files      # whitespace, YAML and large-file checks
```

CI (`.github/workflows/deploy.yml`) builds every PR and runs html-proofer on
internal links. Pushes to `main` deploy; a PR deploys only with the `deploy` label.

## Architecture Overview

Jekyll site on GitHub Pages. `index.html` is a single scrollable page made of
`_includes/sections/{home,works,blog}.html`. Content lives in `_data/*.yml`
(skills, works, experience, certifications, social, space, nav). `/space/` and
`/arcana/` are standalone pages linked from the Works section. See `README.md`
for the full map.

## Conventions & Patterns

- Change content in `_data/`, not in HTML. Do not remove content; move it and link it.
- No inline `style` attributes or inline `<script>` blocks. Styles go in
  `assets/css/main.css`, scripts in `assets/js/` (page-specific scripts are
  listed in the page's `scripts:` front matter).
- Colors come from the CSS variables at the top of `main.css` so light and dark
  themes both work.
- Do not edit `games/` or `assets/*/vendor/` by hand.
- Commit messages follow `.github/commit-message.md`.
