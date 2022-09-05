import { trpc } from "$/utils/trpc";
import { useSession } from "next-auth/react";
import { FormEvent, useId, useState } from "react";
import { useQueryClient } from "react-query";

interface CommentFormProps {
	postId: string;
}

const CommentForm = ({ postId }: CommentFormProps) => {
	const { data: session } = useSession();
	const commentID = useId();
	const [comment, setComment] = useState("");
	const { mutate, isLoading } = trpc.useMutation(["posts.add-comment"]);
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

	if (session) {
		return (
			<form
				className="flex flex-col py-4 space-y-4 flex-1 mt-8"
				onSubmit={(e) => handleSubmit(e)}
			>
				<div className="flex flex-col-reverse gap-2 font-bold relative">
					<div className="absolute text-xs text-neutral-400 top-2 right-1">
						{comment.length}/500
					</div>
					<textarea
						name="comment-body"
						id={commentID}
						value={comment}
						maxLength={500}
						placeholder="Say something about this..."
						onChange={(e) => setComment(e.target.value)}
						className={`outline-none border-none w-full bg-neutral-900 p-2 focus-visible:ring-2 focus-visible:ring-fuchsia-500 transition-all ease-in peer rounded h-24 font-normal placeholder:text-gray-400`}
					/>
					<label htmlFor={commentID} className="text-sm">
						Comment as{" "}
						<span className="text-fuchsia-500">{session?.user?.name}</span>
					</label>
				</div>
				<button className="inline-flex items-center bg-emerald-500 backdrop-blur-sm hover:bg-emerald-600 text-sm font-bold p-2 rounded w-fit transition-all ease-in">
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
