'use client'

import dynamic from 'next/dynamic'
import { useMemo } from 'react'

import { content } from '@/examples/content'

const Home = () => {
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
        <div >
            <SlideEditor content={content} />
        </div>
    )
}

export default Home
