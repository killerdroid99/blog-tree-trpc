import { trpc } from "$/utils/trpc";
import { useSession } from "next-auth/react";
import { FormEvent, useEffect, useId, useState } from "react";
import { useQueryClient } from "react-query";

interface CommentFormProps {
	postId: string;
}

const CommentForm = ({ postId }: CommentFormProps) => {
	const { data: session } = useSession();
	const commentID = useId();
	const [comment, setComment] = useState("");
	const { mutate, isLoading, error } = trpc.useMutation(["posts.add-comment"]);
	const qc = useQueryClient();

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		mutate(
			{
				postId,
				body: comment,
			},
			{
				onSuccess() {
					setComment("");
					qc.invalidateQueries(["posts.getCommentsForPost", { postId }]);
				},
			}
		);
	};

	const [commentError, setCommentError] = useState("");

	useEffect(() => {
		if (error) {
			const msg = JSON.parse(error.message);

			setCommentError(msg[0].message);
		}
	}, [error]);

	if (session) {
		return (
			<form
				className="flex flex-col py-4 space-y-2 flex-1 mt-8"
				onSubmit={(e) => handleSubmit(e)}
			>
				<div className="flex flex-col-reverse gap-2 font-bold relative">
					<div className="absolute text-xs text-neutral-400 top-2 right-1">
						{comment.length}/500
					</div>
					<small className="text-red-500">{commentError}</small>
					<textarea
						name="comment-body"
						id={commentID}
						value={comment}
						maxLength={500}
						placeholder="Say something about this..."
						onChange={(e) => setComment(e.target.value)}
						className={`outline-none border-none w-full bg-neutral-200 dark:bg-neutral-900 p-2 focus-visible:ring-2 focus-visible:ring-fuchsia-500 transition-all ease-in peer rounded h-24 font-normal placeholder:text-gray-400 ${
							commentError !== "" && "ring-2 ring-red-500"
						}`}
						onFocus={() => setCommentError("")}
					/>
					<label htmlFor={commentID} className="text-sm">
						Comment as{" "}
						<span className="text-fuchsia-500">{session?.user?.name}</span>
					</label>
				</div>
				<button
					className="inline-flex items-center bg-emerald-500 backdrop-blur-sm hover:bg-emerald-600 text-sm font-bold p-2 rounded w-fit transition-all ease-in disabled:grayscale"
					disabled={isLoading}
				>
					{isLoading ? (
						<span className="animate-pulse">Adding...</span>
					) : (
						<>Add Comment</>
					)}
				</button>
			</form>
		);
	}

	return <></>;
};

export default CommentForm;
