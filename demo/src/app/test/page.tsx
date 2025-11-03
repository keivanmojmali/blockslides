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

    // Sample content with real slide layouts for selection testing
    const content = {
        type: 'doc',
        content: [
  

            {
                "type": "slide",
                "content": [
                  {
                    "type": "row",
                    "attrs": { "layout": "1-1" },
                    "content": [
                      {
                        "type": "column",
                        "attrs": {
                          className: "bg-red-500",
                        },
                        "content": [
                          {
                            "type": "imageBlock",
                            "attrs": {
                              "src": "https://picsum.photos/seed/cover-left/1600/900",
                              "layout": "cover",
                              "fullBleed": true,
                            }
                          }
                        ]
                      },
                      {
                        "type": "column",
                        "content": [
                          {
                            "type": "imageBlock",
                            "attrs": {
                              "src": "https://picsum.photos/seed/cover-right/1600/900",
                              "layout": "cover",
                              "align": "left",
                              "width": "420px",
                              "height": "320px",
                              "assetId": "demo-cover-right",
                              "alt": "Purple abstract hills",
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              },

              
            {
                type: 'slide',
                attrs: { id: 'intro-slide' },
                content: [
                    {
                        type: 'row',
                        attrs: { layout: '1' },
                        content: [
                            {
                                type: 'column',
                                attrs: {
                                    className: 'bg-slate-900 text-white p-8 rounded-xl space-y-4',
                                },
                                content: [
                                    {
                                        type: 'heading',
                                        attrs: { level: 1 },
                                        content: [
                                            { type: 'text', text: 'Select-All Demo' },
                                        ],
                                    },
                                    {
                                        type: 'paragraph',
                                        content: [
                                            { type: 'text', text: 'Press ' },
                                            {
                                                type: 'text',
                                                marks: [{ type: 'bold' }],
                                                text: 'Ctrl/⌘ + A',
                                            },
                                            {
                                                type: 'text',
                                                text: ' repeatedly to grow the selection. It never crosses this slide.',
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                type: 'slide',
                attrs: { id: 'two-col' },
                content: [
                    {
                        type: 'row',
                        attrs: { layout: '1-1' },
                        content: [
                            {
                                type: 'column',
                                attrs: {
                                    className: 'bg-blue-100 p-6 rounded-lg gap-3 flex flex-col',
                                },
                                content: [
                                    {
                                        type: 'heading',
                                        attrs: { level: 2 },
                                        content: [
                                            { type: 'text', text: 'Left column' },
                                        ],
                                    },
                                    {
                                        type: 'paragraph',
                                        content: [
                                            {
                                                type: 'text',
                                                text: 'Grow selection here → column → row → slide.',
                                            },
                                        ],
                                    },
                                    {
                                        type: 'bulletList',
                                        content: [
                                            {
                                                type: 'listItem',
                                                content: [
                                                    {
                                                        type: 'paragraph',
                                                        content: [
                                                            { type: 'text', text: 'Stay inside this slide' },
                                                        ],
                                                    },
                                                ],
                                            },
                                            {
                                                type: 'listItem',
                                                content: [
                                                    {
                                                        type: 'paragraph',
                                                        content: [
                                                            {
                                                                type: 'text',
                                                                text: 'Highlight stops at row layout 1-1',
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                type: 'column',
                                attrs: { className: 'bg-green-100 p-6 rounded-lg' },
                                content: [
                                    {
                                        type: 'heading',
                                        attrs: { level: 3 },
                                        content: [
                                            { type: 'text', text: 'Right column' },
                                        ],
                                    },
                                    {
                                        type: 'paragraph',
                                        content: [
                                            {
                                                type: 'text',
                                                text: 'Even if you start here, selection never jumps into the left column.',
                                            },
                                        ],
                                    },
                                    {
                                        type: 'codeBlock',
                                        attrs: { language: 'json' },
                                        content: [
                                            {
                                                type: 'text',
                                                text: '{\n  "layout": "1-1",\n  "columns": 2\n}',
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                type: 'slide',
                attrs: { id: 'nested-rows' },
                content: [
                    {
                        type: 'row',
                        attrs: { layout: '2-1' },
                        content: [
                            {
                                type: 'column',
                                attrs: {
                                    className: 'bg-orange-100 p-6 rounded-lg space-y-4',
                                },
                                content: [
                                    {
                                        type: 'heading',
                                        attrs: { level: 2 },
                                        content: [
                                            { type: 'text', text: 'Nested layout' },
                                        ],
                                    },
                                    {
                                        type: 'row',
                                        attrs: { layout: '1-1-1' },
                                        content: [
                                            {
                                                type: 'column',
                                                attrs: {
                                                    className: 'bg-white/60 p-3 rounded-md',
                                                },
                                                content: [
                                                    {
                                                        type: 'paragraph',
                                                        content: [
                                                            { type: 'text', text: 'Inner column 1' },
                                                        ],
                                                    },
                                                ],
                                            },
                                            {
                                                type: 'column',
                                                attrs: {
                                                    className: 'bg-white/60 p-3 rounded-md',
                                                },
                                                content: [
                                                    {
                                                        type: 'paragraph',
                                                        content: [
                                                            { type: 'text', text: 'Inner column 2' },
                                                        ],
                                                    },
                                                ],
                                            },
                                            {
                                                type: 'column',
                                                attrs: {
                                                    className: 'bg-white/60 p-3 rounded-md',
                                                },
                                                content: [
                                                    {
                                                        type: 'paragraph',
                                                        content: [
                                                            { type: 'text', text: 'Inner column 3' },
                                                        ],
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        type: 'paragraph',
                                        content: [
                                            {
                                                type: 'text',
                                                text: 'Press Ctrl/⌘ + A inside an inner column to watch it climb.',
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                type: 'column',
                                attrs: { className: 'bg-yellow-100 p-6 rounded-lg' },
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [
                                            {
                                                type: 'text',
                                                text: 'Sidebar stays isolated. Selection can grow to this entire column, then to the outer row, but no further.',
                                            },
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
        <div >
            <SlideEditor content={content} />
        </div>
    )
}

export default TestPage
