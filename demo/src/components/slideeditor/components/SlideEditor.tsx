import { ReactSlideEditor } from '@blockslides/react'

type Props = {
  onUpdate?: (content: string) => void
  content?: string | object
}

export const SlideEditor = ({ content, onUpdate }: Props) => {
  const normalizedContent =
    typeof content === 'string'
      ? (() => {
          try {
            return JSON.parse(content)
          } catch {
            return content
          }
        })()
      : content

  return (
    <ReactSlideEditor
      content={normalizedContent}
      onChange={(doc) => onUpdate?.(JSON.stringify(doc))}
    />
  )
}





