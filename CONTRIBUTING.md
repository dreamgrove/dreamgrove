# Contributing to Dreamgrove

Welcome to the Dreamgrove contributing guide! This document will help you get started with contributing to our NextJS / Tailwind website.

## Getting Started

1. [Fork the repository by clicking here](https://github.com/dreamgrove/dreamgrove/fork)

2. **Clone the repository:**

   ```
   git clone git@github.com:your-username/dreamgrove.git
   cd dreamgrove
   ```

3. **Install dependencies:**

   ```
   pnpm install
   ```

4. **Run the development server:**
   ```
   pnpm dev
   ```

## Project Structure

- **Posts and Guides:** These are stored in the `data/` folder as .mdx files

## JSX Components and Usage

All the following React components can be directly used in .mdx files

### `<Wowhead>` Component

This component is used to display tooltips for World of Warcraft content.

**Props:**

- `id`: The Wowhead entity ID.
- `name`: Display name (optional, defaults to Wowhead name).
- `type`: Type of the Wowhead content (e.g., spell, item, npc). Used to build the wowhead.com/{type}={id} query
- `disabled`: Removes link and tooltip, displays text only (default: false).
- `noIcon`: Hides the icon (default: false).
- `beta`: Queries wowhead.com/beta (default: false).

**Example Usage:**

```md
# Compendium

This is an NPC: <Wowhead type="npc" id="39625"/>. Kill him
```

**Omitting the ID for Spells:**
The id field is optional if the type is a spell and the name is specified.

```md
<Wowhead type="spell" name="Starsurge"/>
```

This will work for most Druid spells. Check `spellData.json` to confirm if the spell is present.

**Spells Markdown Shortcode:**
There is a markdown shortocde for spells that can be used in .mdx files. Use `![id]|name!` to easily insert them:

```md
Use !Fury of Elune! if you are in !194223|CA!
```

!Fury of Elune! will look for the spell in spellData.json and find the correct id
!194223|CA! will use the id for Celestial Alignment and show the correct tooltip, but will just display "CA" for the name

Both will be replaced with the correct <Wowhead> component

### `<PlannerEmbed>` Component

Embeds a read-only cooldown timeline built with the [planner](https://dreamgrove.gg/planner). Arrange the spells in the planner, click Export in the Loadouts menu (this copies a `DG1…` code to your clipboard), and paste the code into the `code` prop.

**Props:**

- `code`: The loadout code produced by the planner's Export button.
- Children (optional): A caption shown under the timeline.

**Example Usage:**

```jsx
<PlannerEmbed code="DG1AQACAAgAr_YCAGQAaPkFACwB">Double Convoke opener</PlannerEmbed>
```

**Suggested planner loadouts:**
You can also publish loadouts directly inside the planner's Loadouts menu, where every visitor can load them with one click. Edit `other/defaultLoadouts.json` and add an entry to the array of the matching spec:

```json
{
  "balance": [{ "name": "ST Opener", "code": "DG1..." }]
}
```

Use a code exported with the same spec as the array you add it to. The entries appear under "Suggested" in the Loadouts dropdown when that spec is selected.

### `<Checkbox/>` component

Checkboxes are used to dynamically show/hide `<li>` tags. Consecutive checkboxes are grouped into one row automatically; checkboxes that share a `radio` value behave like radio buttons.

**Props:**

- `id`, `spellId`, `name`, `type` (default: spell), `disabled`: these are equivalent to the <Wowhead> component props
- `radio`: Group ID for radio behavior.
- `defaultCheck` (default: false): Default Checkbox state on page load. (true = checked)

The checkbox registers under `id`, or under `spellId` when no `id` is given.

**Example Usage:**

```jsx

  <Checkbox
    id="Adaptive Swarm"
    spellId={391889}
    name="Adaptive Swarm"
    defaultCheck
    radio="Adaptive Swarm"
  />
  <Checkbox id="Unbridled Swarm" spellId={391951} name="Unbridled Swarm" radio="Adaptive Swarm" />

```

**Controlled Elements:**

The checkboxes control list items that must be defined in the following way: `- [*id] text`. A ~ can be used like this: `- [*~id] text` to invert the display behavior.

```md
- [*one] this will be shown only if the checkbox with id "one" is checked
- this will be shown always
- [*~two] this will be shown only if the checkbox with id "two" is unchecked
- [*~three] this will be shown only if the checkbox with id "three" is unchecked
  - this will be shown only if the checkbox with id "three" is unchecked
  - [*two] this will be shown only if the checkbox with id "three" is unchecked AND the checkbox with id "two" is checked
```

### `<Talents>` Component

Displays a collapsible talent tree, decoded from an in-game talent export string.

**Props:**

- `talents`: The talent export string.
- `name`: Display name in the collapsible.
- `comment`: Text shown with the tree.
- `defaultTree`: Tree shown first: `Full` (default), `Class`, `Spec` or `Hero`.
- `forceTree`: Always show only this tree: `full`, `class`, `spec` or `hero`.
- `colors`: Highlight nodes, e.g. `colors={[{ color: '#ff0000', nodes: ['Starfall'] }]}`.
- `extra`: Node names to highlight as optional picks.
- `open`: Start expanded (default: false).
- `hideCopy`: Hide the "Copy Talent String" button (default: false).
- `viewOnly`: Disable interaction (default: false).

### `<HeroTalentsHeader>` Component

A heading with a hero talent tree selector. Props: `title`, `id`, and the section content as children.

### `<Encounter>` Component

One boss or trash section of a dungeon or raid guide. The page builds its encounter rail from these. `<BossCard>` is the older name for the same component.

**Props:** `title`, `image` (path under `public/static/images/`), `trash` (marks a trash section).

### `<SpecNote>` Component

Spec-specific advice inside an encounter. It is shown only while that spec's filter chip is on. Props: `spec` (`balance`, `feral`, `guardian` or `resto`), and the note as children.

### `<Collapsible>` Component

A section that starts collapsed. Props: `title`, and the content as children.

### `<Timeline>` Component

A row of spell icons, for openers and rotations. Repeated consecutive ids are shown once with a count. Props: `spellIds` (array of spell ids), `beta` (default: false), and an optional caption as children.

### `<Npc>` Component

A link to an NPC on Wowhead. Props: `id`, `name` (optional).

### `<YouTube>` Component

An embedded YouTube video. Props: `id` (the video id), `title`, `start` (seconds), `autoplay`.

### Colored text

Write `:color[text]` with a color name or hex code, for example `:red[Avoid this]` or `:#ff6600[Interrupt]`.

## Additional information

### `spellData.json`

Maps spell names (English and Korean) to spell ids, so `<Wowhead type="spell" name="…">` and the `!Name!` shortcode can omit the id.

## Useful Links

- [NextJS Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [MDX Documentation](https://mdxjs.com/docs/)

## Submitting Changes

```
# Checkout to a new branch
git checkout -b feature/your-feature

# Add your changes
git add -A

# Commit your changes
git commit -m "feat: description of changes"

# Verify that the website builds correctly
pnpm build

# Push the changes
git push origin feature/your-feature
```

After doing this go to the repository on GitHub and open a PR.
