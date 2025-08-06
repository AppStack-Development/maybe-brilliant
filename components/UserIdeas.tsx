import React from "react";
import {client} from "@/sanity/lib/client";
import {IDEAS_BY_AUTHOR_QUERY} from "@/sanity/lib/queries";
import IdeaCard, {IdeaTypeCard} from "@/components/IdeaCard";

const UserIdeas = async ({id}: { id: string }) => {
    const ideas = await client.fetch(IDEAS_BY_AUTHOR_QUERY, {id});

    return (
        <>
            {ideas.length > 0 ? (
                ideas.map((idea: IdeaTypeCard) => (
                    <IdeaCard key={idea._id} idea={idea}/>
                ))
            ) : (
                <p className="no-result">No Ideas yet</p>
            )}
        </>
    );
};
export default UserIdeas;