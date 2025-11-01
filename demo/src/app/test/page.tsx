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
                    "attrs": { "layout": "1" },
                    "content": [
                      {
                        "type": "column",
                        "content": [
                          {
                            "type": "imageBlock",
                            "attrs": {
                              "src": "https://picsum.photos/seed/default-block/1600/900",
                              "alt": "Abstract blue gradient waves",
                              //"caption": "Default layout using intrinsic size",
                              //"credit": "Picsum Seed default-block"
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "type": "slide",
                "content": [
                  {
                    "type": "row",
                    "attrs": { "layout": "1" },
                    "content": [
                      {
                        "type": "column",
                        "content": [
                          {
                            "type": "imageBlock",
                            "attrs": {
                              "src": "https://picsum.photos/seed/cover-block/1600/900",
                              "layout": "cover",
                              "align": "stretch",
                              "caption": "Cover layout stretched to fill the column",
                              "credit": "Picsum Seed cover-block"
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "type": "slide",
                "content": [
                  {
                    "type": "row",
                    "attrs": { "layout": "1" },
                    "content": [
                      {
                        "type": "column",
                        "content": [
                          {
                            "type": "imageBlock",
                            "attrs": {
                              "src": "https://picsum.photos/seed/contain-block/900/900",
                              "layout": "contain",
                              "align": "left",
                              "width": "420px",
                              "height": "320px",
                              "caption": "Contain layout with fixed dimensions and left alignment",
                              "credit": "Picsum Seed contain-block"
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "type": "slide",
                "content": [
                  {
                    "type": "row",
                    "attrs": { "layout": "1" },
                    "content": [
                      {
                        "type": "column",
                        "content": [
                          {
                            "type": "imageBlock",
                            "attrs": {
                              "src": "https://picsum.photos/seed/fill-block/1400/900",
                              "layout": "fill",
                              "align": "right",
                              "assetId": "demo-fill-image",
                              "caption": "Fill layout anchored to the right edge",
                              "credit": "Picsum Seed fill-block"
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "type": "slide",
                "content": [
                  {
                    "type": "row",
                    "attrs": { "layout": "1" },
                    "content": [
                      {
                        "type": "column",
                        "content": [
                          {
                            "type": "imageBlock",
                            "attrs": {
                              "src": "https://picsum.photos/seed/focus-block/1600/900",
                              "layout": "focus",
                              "align": "center",
                              "fullBleed": true,
                              "focalX": 28,
                              "focalY": 42,
                              "caption": "Focus layout with spotlight on the subject",
                              "credit": "Picsum Seed focus-block"
                            }
                          }
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "type": "slide",
                "content": [
                  {
                    "type": "row",
                    "attrs": { "layout": "1" },
                    "content": [
                      {
                        "type": "column",
                        "content": [
                          {
                            "type": "imageBlock",
                            "attrs": {
                              "src": "https://picsum.photos/seed/pattern-block/400/400",
                              "layout": "pattern",
                              "align": "center",
                              "width": "280px",
                              "height": "280px",
                              "caption": "Pattern layout tiling the image as a background",
                              "credit": "Picsum Seed pattern-block"
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
