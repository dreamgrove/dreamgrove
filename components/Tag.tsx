interface Props {
  text: string
}

// Rendered as plain text (not a link) because no /tags/* route exists —
// linking there produced sitewide 404s for crawlers and users alike.
const Tag = ({ text }: Props) => {
  return (
    <span className="text-primary-500 mr-3 text-sm font-medium uppercase">
      {text.split(' ').join('-')}
    </span>
  )
}

export default Tag
