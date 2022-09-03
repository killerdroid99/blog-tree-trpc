import Navbar from "$/components/Navbar";
import { trpc } from "$/utils/trpc";
import Head from "next/head";
import { useRouter } from "next/router";
import { FormEvent, useId, useState } from "react";
import { useQueryClient } from "react-query";

const AddPost = () => {
	const titleID = useId();
	const bodyID = useId();
	const [titleValue, setTitleValue] = useState("");
	const [bodyValue, setBodyValue] = useState("");
	const { mutate, isLoading, error } = trpc.useMutation(["posts.add-post"]);
	const router = useRouter();
	const qc = useQueryClient();

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		mutate(
			{
				title: titleValue,
				body: bodyValue,
			},
			{
				onSuccess() {
					qc.invalidateQueries(["posts.getAllPosts"]);
					router.push("/");
				},
			}
		);
	};
	return (
		<>
			<Head>
				<title>Blog Tree | Add Post</title>
				<meta name="description" content="Generated by create-t3-app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="flex flex-col items-center pt-28 h-screen w-screen bg-neutral-800 text-slate-50 font-raleway">
				<Navbar />
				<div className="grid place-items-center gap-6 w-[96vw] xl:w-[50vw] relative bg-neutral-500/20 rounded-md">
					<form
						className="flex flex-col px-6 py-4 space-y-4 w-full"
						onSubmit={(e) => handleSubmit(e)}
					>
						<div className="flex flex-col-reverse gap-2 font-bold">
							<input
								type="text"
								className="outline-none border-none bg-neutral-800 p-1 focus-visible:ring-2 focus-visible:ring-fuchsia-500 transition-all ease-in peer rounded"
								value={titleValue}
								onChange={(e) => setTitleValue(e.target.value)}
								id={titleID}
							/>
							<label
								htmlFor={titleID}
								className="transition-all ease-in peer-focus-visible:text-fuchsia-500"
							>
								Title
							</label>
						</div>
						<div className="flex flex-col-reverse gap-2 font-bold">
							<textarea
								value={bodyValue}
								className="outline-none border-none bg-neutral-800 p-1 focus-visible:ring-2 focus-visible:ring-fuchsia-500 transition-all ease-in peer rounded h-[28rem]"
								onChange={(e) => setBodyValue(e.target.value)}
								id={bodyID}
							/>
							<label
								htmlFor={bodyID}
								className="transition-all ease-in peer-focus-visible:text-fuchsia-500"
							>
								Body
							</label>
						</div>
						<button className="p-1 rounded font-semibold bg-blue-500 hover:bg-blue-600 focus:ring-fuchsia-500 focus:ring-2 focus:ring-offset-2 transition-all ease-in outline-none border-none">
							{isLoading ? (
								<span className="animate-pulse">Publishing...</span>
							) : (
								<span>Publish Post</span>
							)}
						</button>
					</form>
				</div>
			</main>
		</>
	);
};

export default AddPost;
