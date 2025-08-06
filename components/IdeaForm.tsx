"use client";

import React, {useState, useActionState} from "react";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import {Button} from "@/components/ui/button";
import {Send} from "lucide-react";
import {formSchema} from "@/lib/validation";
import {z} from "zod";
import {useToast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";
import {createIdea} from "@/lib/actions";

const IdeaForm = () => {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [details, setDetails] = useState("");
    const {toast} = useToast();
    const router = useRouter();

    const handleFormSubmit = async (prevState: any, formData: FormData) => {
        try {
            const formValues = {
                title: formData.get("title") as string,
                description: formData.get("description") as string,
                category: formData.get("category") as string,
                link: formData.get("link") as string,
                details,
            };

            await formSchema.parseAsync(formValues);

            const result = await createIdea(prevState, formData, details);

            if (result.status == "SUCCESS") {
                toast({
                    title: "Success",
                    description: "Your idea has been created successfully",
                });

                router.push(`/idea/${result._id}`);
            }

            return result;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErorrs = error.flatten().fieldErrors;

                setErrors(fieldErorrs as unknown as Record<string, string>);

                toast({
                    title: "Error",
                    description: "Please check your inputs and try again",
                    variant: "destructive",
                });

                return {...prevState, error: "Validation failed", status: "ERROR"};
            }

            toast({
                title: "Error",
                description: "An unexpected error has occurred",
                variant: "destructive",
            });

            return {
                ...prevState,
                error: "An unexpected error has occurred",
                status: "ERROR",
            };
        }
    };

    const [_, formAction, isPending] = useActionState(handleFormSubmit, {
        error: "",
        status: "INITIAL",
    });

    return (
        <form action={formAction} className="idea-form">
            <div>
                <label htmlFor="title" className="idea-form_label">
                    Title
                </label>
                <Input
                    id="title"
                    name="title"
                    className="idea-form_input"
                    // required
                    placeholder="Idea Title"
                />

                {errors.title && <p className="idea-form_error">{errors.title}</p>}
            </div>

            <div>
                <label htmlFor="description" className="idea-form_label">
                    Description
                </label>
                <Textarea
                    id="description"
                    name="description"
                    className="idea-form_textarea"
                    // required
                    placeholder="Idea Description"
                />

                {errors.description && (
                    <p className="idea-form_error">{errors.description}</p>
                )}
            </div>

            <div>
                <label htmlFor="category" className="idea-form_label">
                    Category
                </label>
                <Input
                    id="category"
                    name="category"
                    className="idea-form_input"
                    // required
                    placeholder="Idea Category (Tech, Health, Education...)"
                />

                {errors.category && (
                    <p className="idea-form_error">{errors.category}</p>
                )}
            </div>

            <div>
                <label htmlFor="link" className="idea-form_label">
                    Image URL
                </label>
                <Input
                    id="link"
                    name="link"
                    className="idea-form_input"
                    // required
                    placeholder="Idea Image URL"
                />

                {errors.link && <p className="idea-form_error">{errors.link}</p>}
            </div>

            <div data-color-mode="light">
                <label htmlFor="details" className="idea-form_label">
                    Details
                </label>

                <MDEditor
                    value={details}
                    onChange={(value) => setDetails(value as string)}
                    id="details"
                    preview="edit"
                    height={300}
                    style={{borderRadius: 20, overflow: "hidden"}}
                    textareaProps={{
                        placeholder:
                            "Briefly describe your idea and what problem it may solves?",
                    }}
                    previewOptions={{
                        disallowedElements: ["style"],
                    }}
                />

                {errors.details && <p className="idea-form_error">{errors.details}</p>}
            </div>

            <Button
                type="submit"
                className="idea-form_btn text-white"
                disabled={isPending}
            >
                {isPending ? "Submitting..." : "Submit Your Idea"}
                <Send className="size-6 ml-2"/>
            </Button>
        </form>
    );
};

export default IdeaForm;