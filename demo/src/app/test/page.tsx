'use client'

import dynamic from 'next/dynamic'
import { useMemo } from 'react'

const TestPage = () => {
    const SlideEditor = useMemo(
        () =>
            dynamic(
                () =>
                    import('@/components/slideeditor/components/SlideEditor').then(
                        (mod) => mod.SlideEditor
                    ),
                {
                    ssr: false,
                }
            ),
        []
    )

    // Sample content with different row layouts
    const content = {
        type: 'doc',
        content: [
            // Slide 1: Single column (layout: "1")
            {
                type: 'slide',
                content: [
                    {
                        type: 'row',
                        attrs: { layout: '1' },
                        content: [
                            {
                                type: 'column',
                                attrs: { className: 'bg-purple-100 p-4' },
                                content: [
                                    {
                                        type: 'heading',
                                        attrs: { level: 1 },
                                        content: [{ type: 'text', text: 'Single Column Layout' }],
                                    },
                                    {
                                        type: 'paragraph',
                                        content: [
                                            { type: 'text', text: 'This slide uses a ' },
                                            { type: 'text', marks: [{ type: 'bold' }], text: 'single column' },
                                            { type: 'text', text: ' layout (1). Full width content.' },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            // Slide 2: Two equal columns (layout: "1-1")
            {
                type: 'slide',
                content: [
                    {
                        type: 'row',
                        attrs: { layout: '1-1' },
                        content: [
                            {
                                type: 'column',
                                attrs: { className: 'bg-blue-100 p-4' },
                                content: [
                                    {
                                        type: 'heading',
                                        attrs: { level: 2 },
                                        content: [{ type: 'text', text: 'Left Column' }],
                                    },
                                    {
                                        type: 'paragraph',
                                        content: [{ type: 'text', text: 'This is a 50% width column.' }],
                                    },
                                    {
                                        type: 'bulletList',
                                        content: [
                                            {
                                                type: 'listItem',
                                                content: [
                                                    {
                                                        type: 'paragraph',
                                                        content: [{ type: 'text', text: 'Equal width' }],
                                                    },
                                                ],
                                            },
                                            {
                                                type: 'listItem',
                                                content: [
                                                    {
                                                        type: 'paragraph',
                                                        content: [{ type: 'text', text: 'Layout: 1-1' }],
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                type: 'column',
                                attrs: { className: 'bg-green-100 p-4' },
                                content: [
                                    {
                                        type: 'heading',
                                        attrs: { level: 2 },
                                        content: [{ type: 'text', text: 'Right Column' }],
                                    },
                                    {
                                        type: 'paragraph',
                                        content: [{ type: 'text', text: 'This is also a 50% width column.' }],
                                    },
                                    {
                                        type: 'codeBlock',
                                        attrs: { language: 'javascript' },
                                        content: [
                                            {
                                                type: 'text',
                                                text: 'const layout = "1-1";\n// 50/50 split',
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            // Slide 3: Two unequal columns (layout: "2-1")
            {
                type: 'slide',
                content: [
                    {
                        type: 'row',
                        attrs: { layout: '2-1' },
                        content: [
                            {
                                type: 'column',
                                attrs: { className: 'bg-orange-100 p-4' },
                                content: [
                                    {
                                        type: 'heading',
                                        attrs: { level: 2 },
                                        content: [{ type: 'text', text: 'Main Content (66%)' }],
                                    },
                                    {
                                        type: 'paragraph',
                                        content: [
                                            { type: 'text', text: 'This column takes up ' },
                                            { type: 'text', marks: [{ type: 'bold' }], text: '2/3 of the width' },
                                            { type: 'text', text: ' (66.66%).' },
                                        ],
                                    },
                                    {
                                        type: 'paragraph',
                                        content: [{ type: 'text', text: 'Perfect for main content with a sidebar.' }],
                                    },
                                ],
                            },
                            {
                                type: 'column',
                                attrs: { className: 'bg-yellow-100 p-4' },
                                content: [
                                    {
                                        type: 'heading',
                                        attrs: { level: 3 },
                                        content: [{ type: 'text', text: 'Sidebar (33%)' }],
                                    },
                                    {
                                        type: 'paragraph',
                                        content: [{ type: 'text', text: 'This column is 1/3 width.' }],
                                    },
                                    {
                                        type: 'paragraph',
                                        content: [
                                            { type: 'text', marks: [{ type: 'italic' }], text: 'Layout: 2-1' },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            // Slide 4: Three equal columns (layout: "1-1-1")
            {
                type: 'slide',
                content: [
                    {
                        type: 'row',
                        attrs: { layout: '1-1-1' },
                        content: [
                            {
                                type: 'column',
                                attrs: { className: 'bg-red-100 p-4' },
                                content: [
                                    {
                                        type: 'heading',
                                        attrs: { level: 3 },
                                        content: [{ type: 'text', text: 'Column 1' }],
                                    },
                                    {
                                        type: 'paragraph',
                                        content: [{ type: 'text', text: '33.33% width' }],
                                    },
                                ],
                            },
                            {
                                type: 'column',
                                attrs: { className: 'bg-pink-100 p-4' },
                                content: [
                                    {
                                        type: 'heading',
                                        attrs: { level: 3 },
                                        content: [{ type: 'text', text: 'Column 2' }],
                                    },
                                    {
                                        type: 'paragraph',
                                        content: [{ type: 'text', text: '33.33% width' }],
                                    },
                                ],
                            },
                            {
                                type: 'column',
                                attrs: { className: 'bg-indigo-100 p-4' },
                                content: [
                                    {
                                        type: 'heading',
                                        attrs: { level: 3 },
                                        content: [{ type: 'text', text: 'Column 3' }],
                                    },
                                    {
                                        type: 'paragraph',
                                        content: [
                                            { type: 'text', marks: [{ type: 'bold' }], text: 'Layout: 1-1-1' },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    }

    return (
        <div>
            <SlideEditor content={content} />
        </div>
    )
}

export default TestPage