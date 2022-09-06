import Comment from "$/components/Comment";
import CommentForm from "$/components/CommentForm";
import DeletePostButton from "$/components/DeletePostButton";
import EditPostButton from "$/components/EditPostButton";
import Layout from "$/components/Layout";
import VotingButton from "$/components/VotingButton";
import { trpc } from "$/utils/trpc";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const PostPage = () => {
	const router = useRouter();
	const { data: session } = useSession();
	const { data, isLoading } = trpc.useQuery([
		"posts.getPostById",
		{ postId: router.query.id as string },
	]);
	const { data: comments, isLoading: isCommentsLoading } = trpc.useQuery([
		"posts.getCommentsForPost",
		{ postId: router.query.id as string },
	]);

	const [formattedCreatedAtDate, setFormattedCreatedAtDate] = useState("");

	useEffect(() => {
		if (data?.createdAt) {
			setFormattedCreatedAtDate(
				format(data?.createdAt as Date, "EE MMM d, yyyy")
			);
		}
	}, [data?.createdAt]);

	return (
		<Layout title={data?.title || "Post page"}>
			{isLoading ? (
				<span className="animate-pulse">Loading Post...</span>
			) : (
				<div className="grid place-items-center w-[96vw] xl:w-[76vw]">
					<div className="flex flex-col">
						<h1 className="text-center text-4xl font-extrabold mb-1 font-serif underline underline-offset-4 decoration-2 decoration-fuchsia-500">
							{data?.title}
						</h1>
						<span className="text-sm text-neutral-600 dark:text-neutral-300 font-sans font-semibold w-fit mb-2 mt-1 tracking-wide">
							~ Published by{" "}
							<span className="text-fuchsia-500">{data?.user?.name} </span>
							{data?.userId === session?.user?.id && <>(You)</>} on{" "}
							<span className="text-fuchsia-500">{formattedCreatedAtDate}</span>
						</span>
					</div>
					<div className="inline-flex space-x-4 mt-2">
						<EditPostButton
							postId={router.query.id as string}
							userId={data?.userId as string}
						/>
						<DeletePostButton
							postId={router.query.id as string}
							userId={data?.userId as string}
						/>
					</div>
					<div
						dangerouslySetInnerHTML={{ __html: data?.body as string }}
						className="ProseMirror mt-4 display"
					/>
					<hr className="h-1 w-full border-dashed border-gray-500" />
					<div className="flex flex-col sm:flex-row w-full relative space-x-2">
						<VotingButton
							postId={router.query.id as string}
							extraClassNames="absolute top-2"
							votes={data?._count?.Votes as number}
							isVoted={data?.voted as boolean}
						/>
						<CommentForm postId={router.query.id as string} />
						<div className="flex flex-col items-center mt-2 flex-1">
							<strong className="mb-1 font-sans">
								{comments?.length}{" "}
								{comments?.length === 1 ? "comment" : "comments"}
							</strong>
							<div className="overflow-y-scroll max-h-[30rem] space-y-1 w-full p-2">
								{isCommentsLoading ? (
									<span className="animate-pulse">Loading Comments...</span>
								) : (
									comments?.map((comment) => (
										<Comment
											key={comment.id}
											comment={comment}
											postOwnerId={data?.userId as string}
										/>
									))
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</Layout>
	);
};

export default PostPage;
