### Very quick and rough guide on how to add/edit articles

(This is taken unedited from a discord conversation, might fix later)

- You ofc need an account on github.com
- Once you have it you go to https://github.com/dreamgrove/dreamgrove/fork
- Leave everything as is, create fork
- This should link you yo https://github.com/youraccount/dreamgrove
- From here you can navigate to /data/blog/<spec>
- compendium.mdx is the file that has the contents of the webpage
- The quickest option is to do everything online
- To do this you click on the file and then on the edit button and you just do all of your edits in the browser editor
- Once you're done you click on "commit changes"
- Here you can leave the extended description empty, but for the commit message please try to always write guide: "brief changelog"
- i.e. guide: added tww trinkets
- if you forget it, it doesn't break anything, but this makes it easy to track changes over time and then you press "Commit changes"
- You can keep doing as many changes as you want like this
- Once you're satisfied you can go back to https://github.com/username/dreamgrove
- And you should see a message
- if it says that "your branch is behind" then you click sync fork > update branch. This will update your copy with the remote changes someone else might've done
- Try to keep it always up to date before making changes
- if it says "this branch is ahead" then you click contribute > open pull request
- This will notify me or any other owner of the website that you have updates. If you wait a couple of minutes on that page it should also generate you an url where you'll be able to preview the changes you made
- After you checked the preview and confirmed that everything looks good, leave a comment and we'll merge the changes
- and finally, for the compendium writing itself
- the basic formatting language is markdown, so you can use all of its features
- the already present compendiums should have examples of how to write everything you might need
- There's also this thing I wrote as documentation if you need something fancy: https://github.com/dreamgrove/dreamgrove/blob/master/CONTRIBUTING.md

---

### Writing an article (not a compendium)

Put the file in `data/blog/<spec>/<slug>.mdx`; it is served at `/blog/<spec>/<slug>`. To list it under a spec's **Guides** section (on `/balance`, `/feral`, `/guardian`, `/resto`), tag it with `specs`:

```yaml
---
title: 'Rage pooling and defensive uptime'
date: '2026-08-05' # used for ordering, newest first
summary: 'When to bank rage for Ironfur and when to spend it on damage.'
authors: ['Kitch']
specs: ['guardian'] # one or more of balance, feral, guardian, resto
patch: '12.1' # optional
---
```

Dungeon and raid guides can be listed on spec hubs the same way: add `specs`, `date` and `authors` to their frontmatter.

### Dungeon and raid guides

Each encounter is an `<Encounter>` section with freeform content: paragraphs, `###` subheadings, lists, `!Spell!` links and alerts. Spec-specific advice goes in a `<SpecNote>`, which readers can hide with the "Show notes for" filter. Leave a blank line after each opening tag and before each closing tag so the markdown inside renders.

```mdx
<Encounter title="Trash to Kyrioss" trash>

The casters open with !Bounding Void!. Pull from the hut so most bounces break line of sight.

<SpecNote spec="guardian">

Gather the leap pack in a corner and keep !Ironfur! stacked through the leap.

</SpecNote>

</Encounter>
```

An encounter with no content (or just `TBD`) is shown as "No notes yet" with a link to edit the file. The older `<BossCard>` name still works and behaves like `<Encounter>`.
