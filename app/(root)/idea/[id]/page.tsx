import {Suspense} from "react";
import {client} from "@/sanity/lib/client";
import {
    PLAYLIST_BY_SLUG_QUERY,
    IDEA_BY_ID_QUERY,
} from "@/sanity/lib/queries";
import {notFound} from "next/navigation";
import {formatDate} from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

import markdownit from "markdown-it";
import {Skeleton} from "@/components/ui/skeleton";
import View from "@/components/View";
import IdeaCard, {IdeaTypeCard} from "@/components/IdeaCard";

const md = markdownit();

const Page = async ({params}: { params: Promise<{ id: string }> }) => {
    const id = (await params).id;

    const [idea, playlist] = await Promise.all([
        client.fetch(IDEA_BY_ID_QUERY, {id}),
        client.fetch(PLAYLIST_BY_SLUG_QUERY, {
            slug: "featured-ideas",
        }),
    ]);

    const featuredIdeas = playlist?.select ?? [];

    if (!idea) return notFound();

    const parsedContent = md.render(idea?.details || "");

    return (
        <>
            <section className="black_container !min-h-[230px]">
                <p className="tag">{formatDate(idea?._createdAt)}</p>

                <h1 className="heading">{idea.title}</h1>
                <p className="sub-heading !max-w-5xl">{idea.description}</p>
            </section>

            <section className="section_container">
                <img
                    src={idea.image}
                    alt="thumbnail"
                    className="w-full h-auto rounded-xl"
                />

                <div className="space-y-5 mt-10 max-w-4xl mx-auto">
                    <div className="sm:flex-between gap-5">
                        <Link
                            href={`/user/${idea.author?._id}`}
                            className="flex gap-2 items-center mb-3"
                        >
                            <Image
                                src={idea.author.image}
                                alt="avatar"
                                width={64}
                                height={64}
                                className="rounded-full drop-shadow-lg"
                            />

                            <div>
                                <p className="text-20-medium break-all">{idea.author.name}</p>
                                <p className="text-16-medium !text-black-300 break-all">
                                    {idea.author.email}
                                </p>
                            </div>
                        </Link>

                        <p className="category-tag">{idea.category}</p>
                    </div>

                    <h3 className="text-30-bold">Idea Details</h3>
                    {parsedContent ? (
                        <article
                            className="prose max-w-4xl font-work-sans break-all"
                            dangerouslySetInnerHTML={{__html: parsedContent}}
                        />
                    ) : (
                        <p className="no-result">No details provided</p>
                    )}
                </div>

                <hr className="divider"/>

                {featuredIdeas?.length > 0 && (
                    <div className="max-w-4xl mx-auto">
                        <p className="text-30-semibold">Featured Ideas</p>

                        <ul className="mt-7 card_grid-sm">
                            {featuredIdeas.map((idea: IdeaTypeCard, i: number) => (
                                <IdeaCard key={i} idea={idea}/>
                            ))}
                        </ul>
                    </div>
                )}

                <Suspense fallback={<Skeleton className="view_skeleton"/>}>
                    <View id={id}/>
                </Suspense>
            </section>
        </>
    );
};

export default Page;