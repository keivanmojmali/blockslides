import { EditorContent, BubbleMenuPreset } from '@blockslides/react'

import { useSlideEditor } from '@/components/SlideEditor/hooks/useSlideEditor'

export const SlideEditor = ({
  content,
  onUpdate,
}: {
  onUpdate?: (content: string) => void
  content?: string | undefined | object
}) => {
  const { editor } = useSlideEditor({ onUpdate, content })

  if (!editor) {
    return null
  }


  return (
    <div className='p-8'>
      <div className="bs-viewport" >
        <EditorContent editor={editor} />
        <BubbleMenuPreset editor={editor} />
      </div>
    </div>
  )
}





