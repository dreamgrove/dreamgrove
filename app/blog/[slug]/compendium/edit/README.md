# Compendium Editor

This is a simple editor for the compendium pages on Dreamgrove. It allows authorized users to edit the compendium content directly through the web interface.

## Access Requirements

To edit compendium pages, you need:

1. A GitHub account
2. Write permission to the [dreamgrove/dreamgrove](https://github.com/dreamgrove/dreamgrove) repository

If you don't have write permission to the repository, you won't be able to edit the pages. Please contact the Dreamgrove repository administrators to request write access.

## How to use

1. Click the "Edit" link on the compendium page to access this editor
2. You'll need to authenticate with GitHub to make changes
3. The system will check if you have write permission to the repository
4. Edit the content using Markdown and MDX syntax
5. Use the "Preview" button to see how your changes will look
6. Click "Save Changes" when you're done

## Markdown and MDX syntax

The compendium pages use Markdown and MDX syntax. Here are some examples:

### Headers

```
# H1
## H2
### H3
```

### Lists

```
- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2
```

### Wowhead Links

```
!47032|Spell!
```

### Talent Links

```
<Talents talent="A1B2C3D4E5..."/>
```

### Collapsible Sections

```
<Collapsible title="Click to expand">
  Content inside the collapsible section
</Collapsible>
```

## Commit Message

When you save changes, a commit will be created with the message "Update [spec] compendium".

## Need help?

If you need assistance or have questions about using the editor, please contact the Dreamgrove administrators.
