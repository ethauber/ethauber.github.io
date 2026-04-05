## To Run On Windows
Follow guide https://jekyllrb.com/docs/installation/windows/
If using vscode close windows and reopen for the integrated terminal to recognize the install of ruby and then jekyll
Use cmd jekyll serve --livereload to develop

## To Run On Mac
```
brew install rbenv
rbenv install 3.1.7
rbenv local 3.1.7
```

### Add to bottom of .zshrc
```
eval "$(rbenv init -)"
```

### Restart term or source file
```
source ~/.zshrc
ruby -v
```

### Install bundler and dependencies
```
bundle init
bundle install
```

To run locall after everything is installed
`bundle exec jekyll serve --livereload`

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

change `"dolt_database": "ethauber.github.io"` to `"dolt_database": "ethauber_github_io"` (replace dots with underscores)

This is typically resolved automatically, but can occur after certain operations or migrations.

## Welcome to GitHub Pages

You can use the [editor on GitHub](https://github.com/ethauber/ethauber.github.io/edit/master/README.md) to maintain and preview the content for your website in Markdown files.

Whenever you commit to this repository, GitHub Pages will run [Jekyll](https://jekyllrb.com/) to rebuild the pages in your site, from the content in your Markdown files.

### Markdown

Markdown is a lightweight and easy-to-use syntax for styling your writing. It includes conventions for

```markdown
Syntax highlighted code block

# Header 1
## Header 2
### Header 3

- Bulleted
- List

1. Numbered
2. List

**Bold** and _Italic_ and `Code` text

[Link](url) and ![Image](src)
```

For more details see [GitHub Flavored Markdown](https://guides.github.com/features/mastering-markdown/).

### Jekyll Themes

Your Pages site will use the layout and styles from the Jekyll theme you have selected in your [repository settings](https://github.com/ethauber/ethauber.github.io/settings). The name of this theme is saved in the Jekyll `_config.yml` configuration file.

### Support or Contact

Having trouble with Pages? Check out our [documentation](https://help.github.com/categories/github-pages-basics/) or [contact support](https://github.com/contact) and we’ll help you sort it out.
