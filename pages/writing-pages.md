---
title: Writing pages
group: Meta
icon: book
desc: how this wiki is written
---
Every page is one markdown file in the `pages/` folder. The menu and the front page are built from them automatically.

## Adding a page

1. create `pages/my-page.md`
2. add `"my-page"` to `pages/manifest.json` (the order there is the order in the menu)
3. refresh

## Front matter

The block at the top of each file sets the title, menu group, icon and one-line description.

```md pages/memory.md
---
title: Memory
group: Kernel
icon: microchip
desc: heap and paging
---
Your markdown starts here.
```

`icon` takes a name from the built-in list or a raw Nerd Font glyph pasted straight in. Built-in names: `home book terminal code folder file cog microchip hdd database sitemap rocket bug plug globe lock key cube cubes bolt wrench download link clock tag heart star users question info warn tip search list tasks puzzle flask wifi server desktop git`.

## Markdown

````md
## Heading   (### for a smaller one)
**bold**, `inline code`, [internal](#memory), [external](https://example.com)
- bullet
1. numbered
> [!info] callout (info, warn, tip, err)
| a | b |
|---|---|
| 1 | 2 |
---
````

## Code blocks

Open a fence with a language and, optionally, a title: ` ```c heap.c `. Use four backticks when the block itself contains a fence.

Languages with custom highlighting: `c` `cpp` `asm` `sh` `py` `json` `log`. Anything else renders plain.

> [!info] Typing effect
> Click or press a key while a page is typing to skip straight to the end.

> [!warn] Needs a server
> Pages are loaded with `fetch`, so open the wiki through a web server (GitHub Pages, or `python3 -m http.server` in this folder), not by double-clicking `index.html`.