import { EditorContent, SlideEditor } from '@autoartifacts/react'
import React, { useRef } from 'react'

import { useSlideEditor } from '@/components/slideeditor/hooks/useSlideEditor'

//TODO: Check to see which styles we need to bring over from PP 
//import '@/components/slideeditor/styles/index.css'

export const BlockEditor = ({
  content,
  onUpdate,
}: {
  onUpdate?: (content: string) => void
  content?: string | undefined | object
}) => {
  const menuContainerRef = useRef(null)
  const { editor } = useSlideEditor({ onUpdate, content })

  if (!editor) {
    return null
  }


  return (
    <div className="flex h-full editor-container" ref={menuContainerRef}>
      <div className="relative flex flex-col flex-1 h-full w-full overflow-x-hidden">
        <div className="m-3 w-100 max-w-full">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div >
  )
}

export default SlideEditor



