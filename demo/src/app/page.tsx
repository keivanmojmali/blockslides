'use client'

import dynamic from 'next/dynamic'
import { useMemo } from 'react'

import { templatesSampleDeck } from '@/examples/templates'
import { templatesV1 } from '@blockslides/ai-context'

const Home = () => {
    const presets = templatesV1.listPresetTemplates()
    const SlideEditor = useMemo(
        () =>
            dynamic(
                () =>
                    import('@/components/SlideEditor/components/SlideEditor').then(
                        (mod) => mod.SlideEditor
                    ),
                {
                    ssr: false,
                }
            ),
        []
    )

    return (
        <div className="flex min-h-screen bg-[#0f0f0f] text-white">
            <aside className="w-64 border-r border-white/10 bg-[#111] p-4 space-y-3">
                <h2 className="text-sm uppercase tracking-wide text-white/60">Templates</h2>
                <div className="space-y-2">
                    {presets.map((preset) => (
                        <div
                            key={preset.key}
                            className="rounded-lg border border-white/10 bg-white/5 p-2"
                        >
                            {preset.icon ? (
                                <div
                                    className="mb-2 flex items-center justify-center"
                                    dangerouslySetInnerHTML={{ __html: preset.icon }}
                                />
                            ) : null}
                            <div className="text-sm font-semibold text-white">{preset.label}</div>
                            {preset.description ? (
                                <div className="text-xs text-white/60">{preset.description}</div>
                            ) : null}
                        </div>
                    ))}
                </div>
            </aside>
            <main className="flex-1 p-6 overflow-auto">
                <SlideEditor content={templatesSampleDeck} />
            </main>
        </div>
    )
}

export default Home
