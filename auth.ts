import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import {AUTHOR_BY_GOOGLE_SUB_ID_QUERY} from "@/sanity/lib/queries";
import {client} from "@/sanity/lib/client";
import {writeClient} from "@/sanity/lib/write-client";

export const {handlers, auth, signIn, signOut} = NextAuth({
    providers: [Google],
    callbacks: {
        async signIn({profile: {sub, email, name, picture}}) {
            if (!sub) {
                console.warn("Missing Google sub ID from profile.");
                return false;
            }

            const existingUser = await client
                .withConfig({useCdn: false})
                .fetch(AUTHOR_BY_GOOGLE_SUB_ID_QUERY, {
                    id: sub,
                });

            if (!existingUser) {
                await writeClient.create({
                    _type: "author",
                    id: sub,
                    name,
                    email,
                    image: picture.split('=')[0],
                });
            }

            return true;
        },
        async jwt({token, profile}) {
            if (profile && profile.sub) {
                token.sub_id = profile.sub;
            }

            if (token.sub_id) {
                const user = await client
                    .withConfig({useCdn: false})
                    .fetch(AUTHOR_BY_GOOGLE_SUB_ID_QUERY, {
                        id: token.sub_id,
                    });

                token.id = user?._id;
            }

            return token;
        },
        async session({session, token}) {
            Object.assign(session, {id: token.id});
            return session;
        },
    },
});