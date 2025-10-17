import React from "react";
import IdeaCard, {IdeaTypeCard} from "@/components/IdeaCard";

const UserIdeas = async ({ideas}: { ideas: IdeaTypeCard[] }) => {
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