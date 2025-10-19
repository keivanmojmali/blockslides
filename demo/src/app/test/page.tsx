'use client'

import { BlockEditor } from '@/components/slideeditor/components/SlideEditor'

const TestPage = () => {
    // Sample content following your doc -> slide -> block structure
    const content = {
        type: 'doc',
        content: [
            {
                type: 'slide',
                content: [
                    {
                        type: 'heading',
                        attrs: { level: 1 },
                        content: [{ type: 'text', text: 'Welcome to AutoArtifacts' }],
                    },
                    {
                        type: 'paragraph',
                        content: [
                            { type: 'text', text: 'This is a ' },
                            { type: 'text', marks: [{ type: 'bold' }], text: 'test slide' },
                            { type: 'text', text: ' with some ' },
                            { type: 'text', marks: [{ type: 'italic' }], text: 'formatted' },
                            { type: 'text', text: ' text.' },
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
                                        content: [{ type: 'text', text: 'First bullet point' }],
                                    },
                                ],
                            },
                            {
                                type: 'listItem',
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [{ type: 'text', text: 'Second bullet point' }],
                                    },
                                ],
                            },
                            {
                                type: 'listItem',
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [{ type: 'text', text: 'Third bullet point' }],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                type: 'slide',
                content: [
                    {
                        type: 'heading',
                        attrs: { level: 2 },
                        content: [{ type: 'text', text: 'Second Slide' }],
                    },
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'This is the second slide with different content.',
                            },
                        ],
                    },
                    {
                        type: 'codeBlock',
                        attrs: { language: 'javascript' },
                        content: [
                            {
                                type: 'text',
                                text: 'const hello = "world";\nconsole.log(hello);',
                            },
                        ],
                    },
                ],
            },
            {
                type: 'slide',
                content: [
                    {
                        type: 'heading',
                        attrs: { level: 2 },
                        content: [{ type: 'text', text: 'Features' }],
                    },
                    {
                        type: 'orderedList',
                        content: [
                            {
                                type: 'listItem',
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [{ type: 'text', text: 'Rich text editing' }],
                                    },
                                ],
                            },
                            {
                                type: 'listItem',
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [{ type: 'text', text: 'Multiple slides' }],
                                    },
                                ],
                            },
                            {
                                type: 'listItem',
                                content: [
                                    {
                                        type: 'paragraph',
                                        content: [{ type: 'text', text: 'Code blocks' }],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: 'paragraph',
                        content: [
                            { type: 'text', text: 'Check out the ' },
                            {
                                type: 'text',
                                marks: [{ type: 'link', attrs: { href: 'https://example.com' } }],
                                text: 'documentation',
                            },
                            { type: 'text', text: ' for more info.' },
                        ],
                    },
                ],
            },
        ],
    }

    return (
        <div>
            <BlockEditor content={content} />
        </div>
    )
}

export default TestPage