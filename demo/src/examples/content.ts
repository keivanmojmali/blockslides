export const content = {
    type: 'doc',
    content: [
        {
            type: 'slide',
            attrs: { id: 'image-left-text-right' },
            content: [
                {
                    type: 'row',
                    attrs: { layout: '1-1' },
                    content: [
                        {
                            type: 'column',
                            content: [
                                {
                                    type: 'imageBlock',
                                    attrs: {
                                        src: 'https://picsum.photos/seed/contrast-side/1600/900',
                                        layout: 'cover',
                                        fullBleed: true,
                                        alt: 'Creative workspace overview',
                                    },
                                },
                            ],
                        },
                        {
                            type: 'column',
                            attrs: {
                                className: 'bg-white px-10 py-12 flex flex-col justify-center gap-6',
                            },
                            content: [
                                {
                                    type: 'heading',
                                    attrs: { level: 1 },
                                    content: [{ type: 'text', text: 'Elevate Your Narrative' }],
                                },
                                {
                                    type: 'paragraph',
                                    content: [
                                        {
                                            type: 'text',
                                            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vitae nibh auctor, malesuada mauris at, venenatis lorem.',
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