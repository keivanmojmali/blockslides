export const content = {
    type: 'doc',
    content: [
        {
            type: 'slide',
            attrs: { id: 'title-gradient-center', size: 'linkedin-banner'},
            content: [
                {
                    type: 'columnGroup',
                    attrs: { layout: '1' },
                    content: [
                        {
                            type: 'column',
                            attrs: {
                                className:
                                    'min-h-full flex text-white items-center justify-center bg-[radial-gradient(circle_at_top_left,_#0f172a,_#0b2842_45%,_#03677c_85%)]',
                            },
                            content: [
                                {
                                    type: 'heading',
                                    attrs: { level: 2, },
                                    content: [{ type: 'text', text: 'Aurelius Labs' }],
                                },
                                {
                                    type: 'paragraph',
                                    content: [
                                        { type: 'text', text: 'Accelerating automotive innovation with intelligent software.' },                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            type: 'slide',
            attrs: { id: 'hero-with-title' },
            content: [
                {
                    type: 'columnGroup',
                    attrs: { layout: '2-1' },
                    content: [
                        {
                            type: 'column',
                            content: [
                                {
                                    type: 'imageBlock',
                                    attrs: {
                                        src: 'https://picsum.photos/seed/hero-cover/2000/1200',
                                        layout: 'cover',
                                        fullBleed: true,
                                        alt: 'Dramatic mountain landscape with mist',
                                    },
                                },
                            ],
                        },
                        {
                            type: 'column',
                            attrs: {
                                className: 'bg-slate-900 text-white flex flex-col justify-center gap-6 px-12 py-16',
                            },
                            content: [
                                {
                                    type: 'heading',
                                    attrs: { level: 2 },
                                    content: [{ type: 'text', text: 'Bold Vision' }],
                                },
                                {
                                    type: 'paragraph',
                                    content: [
                                        {
                                            type: 'text',
                                            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere mauris a lacus dictum, at pretium dui interdum.',
                                        },
                                    ],
                                },
                                {
                                    type: 'paragraph',
                                    content: [
                                        {
                                            type: 'text',
                                            text: 'Morbi viverra, urna ac gravida aliquet, dui erat tincidunt dui, sed condimentum sapien ante sed magna.',
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
            attrs: { id: 'feature-highlights' },
            content: [
                {
                    type: 'columnGroup',
                    attrs: {
                        layout: '1-1-1',
                        className:
                            'overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-teal-900',
                    },
                    content: [
                        {
                            type: 'column',
                            attrs: {
                                className:
                                    'p-12 text-white flex flex-col gap-6 border-r border-white/10',
                            },
                            content: [
                                {
                                    type: 'paragraph',
                                    attrs: {
                                        className:
                                            'inline-flex items-center justify-center w-14 h-14 bg-cyan-400/20 text-cyan-200 text-xl font-semibold',
                                    },
                                    content: [{ type: 'text', text: '01' }],
                                },
                                {
                                    type: 'heading',
                                    attrs: { level: 3, className: 'text-2xl font-semibold' },
                                    content: [{ type: 'text', text: 'Adaptive Power Mesh' }],
                                },
                                {
                                    type: 'paragraph',
                                    attrs: { className: 'text-white/80 leading-relaxed' },
                                    content: [
                                        {
                                            type: 'text',
                                            text: 'Distributes energy across devices based on heat, draw, and priority so nothing slows you down.',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            type: 'column',
                            attrs: {
                                className:
                                    'p-12 text-white flex flex-col gap-6 border-r border-white/10',
                            },
                            content: [
                                {
                                    type: 'paragraph',
                                    attrs: {
                                        className:
                                            'inline-flex items-center justify-center w-14 h-14  bg-cyan-400/20 text-cyan-200 text-xl font-semibold',
                                    },
                                    content: [{ type: 'text', text: '02' }],
                                },
                                {
                                    type: 'heading',
                                    attrs: { level: 3, className: 'text-2xl font-semibold' },
                                    content: [{ type: 'text', text: 'Graphene Shielding' }],
                                },
                                {
                                    type: 'paragraph',
                                    attrs: { className: 'text-white/80 leading-relaxed' },
                                    content: [
                                        {
                                            type: 'text',
                                            text: 'Keeps devices cool under extreme workloads while maintaining aerospace-grade durability.',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            type: 'column',
                            attrs: {
                                className:
                                    'p-12 text-white flex flex-col gap-6',
                            },
                            content: [
                                {
                                    type: 'paragraph',
                                    attrs: {
                                        className:
                                            'inline-flex items-center justify-center w-14 h-14 bg-cyan-400/20 text-cyan-200 text-xl font-semibold',
                                    },
                                    content: [{ type: 'text', text: '03' }],
                                },
                                {
                                    type: 'heading',
                                    attrs: { level: 3, className: 'text-2xl font-semibold' },
                                    content: [{ type: 'text', text: 'HyperSync Services' }],
                                },
                                {
                                    type: 'paragraph',
                                    attrs: { className: 'text-white/80 leading-relaxed' },
                                    content: [
                                        {
                                            type: 'text',
                                            text: 'Cloud-based battery health analytics with proactive alerts and firmware tuning for fleets.',
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