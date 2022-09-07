import Tiptap from "$/components/RichText";
import { trpc } from "$/utils/trpc";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Linker from "@tiptap/extension-link";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useId, useState } from "react";
import { useQueryClient } from "react-query";
import Image from "@tiptap/extension-image";
import Layout from "$/components/Layout";

const AddPost = () => {
	const titleID = useId();
	const [titleValue, setTitleValue] = useState("");
	const { mutate, isLoading, error } = trpc.useMutation(["posts.add-post"]);
	const router = useRouter();
	const qc = useQueryClient();

	const [titleError, setTitleError] = useState("");
	const [bodyError, setBodyError] = useState("");

	const Editor = useEditor({
		extensions: [
			StarterKit,
			Image,
			Linker.configure({
				openOnClick: true,
			}),
		],
		onFocus: () => {
			setBodyError("");
		},
		editorProps: {
			attributes: {
				class:
					"min-h-[28rem] px-4 pb-1 pt-8 focus-visible:ring-2 focus-visible:ring-fuchsia-500 transition-all ease-in rounded font-sans font-normal",
			},
		},
		content: `
      <p>
				Enter post body...
      </p>
    `,
	});

	useEffect(() => {
		if (error) {
			const msg = JSON.parse(error.message);

			if (msg.length === 2) {
				setTitleError(msg[0].message);
				setBodyError(msg[1].message);
			} else if (msg[0].path[0] === "title") {
				setTitleError(msg[0].message);
			} else {
				setBodyError(msg[0].message);
			}
		}
	}, [error]);

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		setTitleError("");
		setBodyError("");
		const body = Editor?.getHTML();
		if (typeof body === "string") {
			mutate(
				{
					title: titleValue,
					body: body,
				},
				{
					onSuccess() {
						qc.invalidateQueries(["posts.getAllPosts"]);
						router.push("/");
					},
				}
			);
		}
	};
	return (
		<Layout title="Add Post">
			<div className="grid place-items-center gap-6 w-[96vw] xl:w-[50vw] relative bg-neutral-500/30 rounded-md">
				<form
					className="flex flex-col px-6 py-4 space-y-4 w-full"
					onSubmit={(e) => handleSubmit(e)}
				>
					<div className="flex flex-col-reverse gap-2 font-bold">
						{titleError && <small className="text-red-500">{titleError}</small>}
						<input
							type="text"
							className={`outline-none border-none bg-neutral-100 dark:bg-neutral-800 p-1 focus-visible:ring-2 focus-visible:ring-fuchsia-500 transition-all ease-in peer rounded ${
								titleError !== "" && "ring-2 ring-red-500"
							}`}
							value={titleValue}
							onChange={(e) => setTitleValue(e.target.value)}
							onFocus={() => setTitleError("")}
							id={titleID}
						/>
						<label
							htmlFor={titleID}
							className={`transition-all ease-in peer-focus-visible:text-fuchsia-500 ${
								titleError !== "" && "text-red-500"
							}`}
						>
							Title
						</label>
					</div>
					<div className="flex flex-col-reverse gap-2 font-bold">
						{bodyError && <small className="text-red-500">{bodyError}</small>}
						<div
							className={`relative outline-none border-none bg-neutral-100 dark:bg-neutral-800 transition-all ease-in peer rounded ${
								bodyError !== "" && "ring-2 ring-red-500"
							}`}
						>
							<Tiptap editor={Editor} />
						</div>
					</div>
					<button
						className="p-1 rounded font-semibold bg-blue-500 hover:bg-blue-600 focus:ring-fuchsia-500 focus:ring-2 focus:ring-offset-2 transition-all ease-in outline-none border-none disabled:grayscale"
						disabled={isLoading}
					>
						{isLoading ? (
							<span className="animate-pulse">Publishing...</span>
						) : (
							<span>Publish Post</span>
						)}
					</button>
				</form>
			</div>
		</Layout>
	);
};

export default AddPost;
