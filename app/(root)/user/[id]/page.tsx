import {auth} from "@/auth";
import {client} from "@/sanity/lib/client";
import {AUTHOR_BY_ID_QUERY, IDEAS_BY_AUTHOR_QUERY} from "@/sanity/lib/queries";
import {notFound} from "next/navigation";
import Image from "next/image";
import UserIdeas from "@/components/UserIdeas";
import {Suspense} from "react";
import {IdeaCardSkeleton} from "@/components/IdeaCard";
import {IdeaTypeCard} from "@/components/IdeaCard";
import Pagination from "@/components/Pagination";

export const experimental_ppr = true;

const Page = async (
    {params, searchParams}: {
        params: Promise<{ id: string }>
        searchParams: Promise<{ page?: string }>
    }
) => {
    const resolvedParams = await params;
    const session = await auth();
    const id = resolvedParams.id;
    const user = await client.fetch(AUTHOR_BY_ID_QUERY, {id});
    if (!user) return notFound();

    const limit = 6;
    const resolvedSearchParams = await searchParams;
    const currentPage = parseInt(resolvedSearchParams.page || "1", 10);
    const start = (currentPage - 1) * limit;
    const end = currentPage * limit;
    const queryParams = {id, start, end};
    const data = await client.fetch(IDEAS_BY_AUTHOR_QUERY, queryParams);
    const ideas: IdeaTypeCard[] = data?.ideas || [];
    const total: number = data?.total || 0;
    const totalPages = Math.ceil(total / limit);

    return (
        <>
            <section className="profile_container">
                <div className="profile_card">
                    <div className="profile_title">
                        <h3 className="text-24-black uppercase text-center line-clamp-2">
                            {user.name}
                        </h3>
                    </div>

                    <Image
                        src={user.image}
                        alt={user.name}
                        width={220}
                        height={220}
                        className="profile_image"
                    />

                    <p className="font-medium text-[20px] text-white mt-7 text-center break-all">
                        {user?.email}
                    </p>
                </div>

                <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
                    <p className="text-30-bold">
                        {session?.id === id ? "Your" : "All"} Ideas
                    </p>
                    <ul className="card_grid-sm">
                        <Suspense fallback={<IdeaCardSkeleton/>}>
                            <UserIdeas ideas={ideas}/>
                        </Suspense>
                    </ul>
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            baseUrl={`/user/${id}/`}
                        />
                    )}
                </div>
            </section>
        </>
    );
};

export default Page;