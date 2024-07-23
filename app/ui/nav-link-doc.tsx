import {ReactElement} from "react";
import {LinkDoc} from "@/app/lib/definitions";
import Link from 'next/link';

const nextDocs = [
    {
        title: "Docs",
        link: "https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app",
        description: "Find in-depth information about Next.js features and API."
    },
    {
        title: "Learn",
        link: "https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app",
        description: "Learn about Next.js in an interactive course with&nbsp;quizzes!"
    },
    {
        title: "Templates",
        link: "https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app",
        description: "Explore starter templates for Next.js."
    },
    {
        title: "Deploy",
        link: "https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app",
        description: "Instantly deploy your Next.js site to a shareable URL with Vercel."
    }
];
export default function NavLinkDoc(): ReactElement {
    return (
        <>
            {nextDocs.map((linkDoc: LinkDoc, key) => {
                return (
                    <Link
                        key={`linkDoc-+${key}`}
                        href={linkDoc.link}
                        className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <h2 className="mb-3 text-2xl font-semibold">
                            {linkDoc.title}{" "}
                            <span
                                className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                                -&gt;
                            </span>
                        </h2>

                        <p className="m-0 max-w-[30ch] text-balance text-sm opacity-50">
                            {linkDoc.description}
                        </p>
                    </Link>
                )
            })}
        </>
    )
}