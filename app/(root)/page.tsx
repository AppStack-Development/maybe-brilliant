export const dynamic = 'force-dynamic';

import SearchForm from "@/components/SearchForm";
import IdeaCard, {IdeaTypeCard} from "@/components/IdeaCard";
import {IDEAS_QUERY} from "@/sanity/lib/queries";
import {sanityFetch, SanityLive} from "@/sanity/lib/live";
import Pagination from "@/components/Pagination";

export default async function Home({
                                       searchParams
                                   }: {
    searchParams: Promise<{ query?: string, page?: string }>;
}) {

    const resolvedParams = await searchParams;
    const query = resolvedParams.query || "";
    const currentPage = parseInt(resolvedParams.page || "1", 10);
    const limit = 12;
    const start = (currentPage - 1) * limit;
    const end = currentPage * limit;
    const params = {search: query || null, start, end};
    const {data} = await sanityFetch({query: IDEAS_QUERY, params});
    const ideas: IdeaTypeCard[] = data?.ideas || [];
    const total: number = data?.total || 0;
    const totalPages = Math.ceil(total / limit);

    return (
        <>
            <section className="black_container">
                <h1 className="heading">
                    Weird Ideas<br/>
                    That Might Just Change<br/>
                    Our World.
                </h1>

                <p className="sub-heading !max-w-3xl">
                    A Playground For Dreamers, Post It. Worst Case? It’s Hilarious. 🤣
                </p>

                <SearchForm query={query}/>
            </section>

            <section className="section_container">
                <p className="text-30-semibold">
                    {query ? `Search results for "${query}"` : "All Ideas"}
                </p>

                <ul className="mt-7 card_grid">
                    {ideas?.length > 0 ? (
                        ideas.map((idea: IdeaTypeCard) => (
                            <IdeaCard key={idea?._id} idea={idea}/>
                        ))
                    ) : (
                        <p className="no-results">No ideas found</p>
                    )}
                </ul>

                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        baseUrl="/"
                        query={query}
                    />
                )}
            </section>

            <SanityLive/>
        </>
    );
}