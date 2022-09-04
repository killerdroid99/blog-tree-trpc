import CommentForm from "$/components/CommentForm";
import DeletePostButton from "$/components/DeletePostButton";
import EditPostButton from "$/components/EditPostButton";
import Navbar from "$/components/Navbar";
import VotingButton from "$/components/VotingButton";
import { trpc } from "$/utils/trpc";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";

const PostPage = () => {
	const router = useRouter();
	const { data: session } = useSession();
	const { data, isLoading } = trpc.useQuery([
		"posts.getPostById",
		{ postId: router.query.id as string },
	]);

	return (
		<>
			<Head>
				<title>Blog Tree | {data?.title || "Post page"}</title>
				<meta name="description" content="Generated by create-t3-app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="flex flex-col items-center pt-16 h-screen w-screen bg-neutral-800 text-slate-50 font-raleway overflow-y-scroll pb-10">
				<Navbar />
				{isLoading ? (
					<span className="animate-pulse">Loading Post...</span>
				) : (
					<div className="grid place-items-center w-[96vw] xl:w-[76vw] relative">
						<div className="fixed right-[1rem] xl:right-[2vw] top-[4rem] inline-flex flex-col space-y-2 z-10">
							<EditPostButton
								postId={router.query.id as string}
								userId={data?.userId as string}
							/>
							<DeletePostButton
								postId={router.query.id as string}
								userId={data?.userId as string}
							/>
						</div>
						<VotingButton
							postId={router.query.id as string}
							extraClassNames="fixed left-[1rem] xl:left-[2vw] top-[4rem] z-10"
							votes={data?._count.Votes as number}
						/>
						<div className="flex flex-col items-end">
							<h1 className="text-center text-4xl font-extrabold mb-1 font-serif underline underline-offset-4 decoration-2 decoration-fuchsia-500">
								{data?.title}
							</h1>
							<span className="text-sm text-neutral-300 font-raleway font-semibold w-fit -translate-x-2">
								~ By{" "}
								<span className="text-fuchsia-500">{data?.user.name} </span>
								{data?.userId === session?.user?.id && <>(You)</>}
							</span>
						</div>
						<div
							dangerouslySetInnerHTML={{ __html: data?.body as string }}
							className="ProseMirror mt-8"
						/>
						<hr className="h-1 w-full border-dashed border-gray-500" />
						<CommentForm postId={router.query.id as string} />
					</div>
				)}
			</main>
		</>
	);
};

export default PostPage;
