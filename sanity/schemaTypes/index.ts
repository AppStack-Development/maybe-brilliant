import {type SchemaTypeDefinition} from "sanity";

import {author} from "@/sanity/schemaTypes/author";
import {idea} from "@/sanity/schemaTypes/idea";
import {playlist} from "@/sanity/schemaTypes/playlist";

export const schema: { types: SchemaTypeDefinition[] } = {
    types: [author, idea, playlist],
};