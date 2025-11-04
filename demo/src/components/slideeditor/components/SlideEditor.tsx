import { EditorContent } from '@autoartifacts/react'
import React from 'react'

import { useSlideEditor } from '@/components/SlideEditor/hooks/useSlideEditor'

//import '@/components/slideeditor/styles/index.css'

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
      <EditorContent editor={editor} />
    </div>
  )
}





