# jagannathareddy.github.io

Personal portfolio + blog for **Jagannatha MV**. Built with Jekyll and served free by GitHub Pages. You never have to run a build: commit a file and GitHub rebuilds the site in about a minute.

Live at **https://jagannathareddy.github.io**

---

## Write a post

### Option A: the built-in writer (easiest)
1. Go to **https://jagannathareddy.github.io/write/** (it isn't linked anywhere public, so bookmark it).
2. Write your post. The preview updates as you type, and your draft is saved in that browser.
3. Click **Publish on GitHub**. GitHub opens with the post filled in as a new file in `_posts/`.
4. Click **Commit changes**. The post is live in about a minute.

Only people with write access to this repository (just you) can commit, so visitors can't post.

### Option B: straight on GitHub
1. In this repository, open the `_posts` folder, then click **Add file → Create new file**.
2. Name it `YYYY-MM-DD-your-post-title.md`, for example `2026-10-01-why-my-agent-refuses-fixes.md`.
3. Paste this template, write, and commit:

~~~markdown
---
title: "Why my agent refuses some fixes"
summary: "One line that shows on the blog list."
tag: Agents          # one of: Agents, Playwright, Karate, Notes
---

Your intro paragraph.

## A section heading

More text. **Bold**, `inline code`, [a link](https://example.com).

```ts
test('it works', async ({ page }) => { /* ... */ });
```

> A pull quote.
~~~

- **Edit a post:** open its file in `_posts/`, click the pencil icon, and commit.
- **Hide a post:** add `published: false` to its front matter.
- **Images:** upload them to `assets/img/` and use `![Alt text](/assets/img/name.png)`.
- **Drafts:** files in `_drafts/` are never published. There's a sample draft there to start from.

---

## Change site details

Everything personal lives in a few files:

| What | Where |
|---|---|
| Name, email, résumé link, photo, social handles, blog topics | `_config.yml` |
| Featured projects ("Now shipping" tabs) | `_data/projects.yml` |
| Posts published elsewhere (Medium, etc.) | `_data/external_posts.yml` |
| Home page text | `index.html` |
| Colors and fonts | top of `assets/css/site.css` (`--accent` is the blue) |

- **Photo:** upload it as `assets/img/me.jpg`, then set `avatar: /assets/img/me.jpg` in `_config.yml`.
- **Résumé:** upload a PDF as `assets/resume.pdf`, then set `resume_url: /assets/resume.pdf`.

---

## First-time setup

1. Create a **public** repository named exactly **`JagannathaReddy.github.io`**.
2. Upload all of these files to it, on the `main` branch.
3. Go to **Settings → Pages** and check that **Source** is "Deploy from a branch", with branch `main` and folder `/ (root)`.
4. Wait about a minute, then open https://jagannathareddy.github.io.

### Preview on your own computer (optional)
```bash
bundle install
bundle exec jekyll serve --drafts   # http://localhost:4000, includes drafts
```

## What's in here
```
_config.yml            site settings
_layouts/              page templates (default, post)
_posts/                your blog posts (YYYY-MM-DD-title.md)
_drafts/               unpublished drafts
_data/                 projects + external posts
assets/css/site.css    all styles
assets/js/             small scripts (demo card, tabs, blog filter, writer)
index.html             home page
blog/index.html        blog list with topic filters
write/index.html       private writing page
```
