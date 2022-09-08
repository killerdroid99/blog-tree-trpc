import { trpc } from "$/utils/trpc";
import { useSession } from "next-auth/react";
import { FormEvent, useEffect, useId, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { useQueryClient } from "react-query";
import dynamic from "next/dynamic";
const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });
interface CommentFormProps {
	postId: string;
}

const CommentForm = ({ postId }: CommentFormProps) => {
	const { data: session } = useSession();
	const commentID = useId();
	const [comment, setComment] = useState("");
	const { mutate, isLoading, error } = trpc.useMutation(["posts.add-comment"]);
	const qc = useQueryClient();
	const [emoji, setEmoji] = useState(false);
	const [cursorIndex, setCursorIndex] = useState({
		start: 0,
		end: 0,
	});

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		mutate(
			{
				postId,
				body: comment,
			},
			{
				onSuccess() {
					setEmoji(false);
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
						onSelect={(e) => {
							const target = e.target as HTMLTextAreaElement;
							setCursorIndex({
								start: target.selectionStart,
								end: target.selectionEnd,
							});
						}}
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
					{emoji && (
						<div className="absolute -bottom-[20rem] right-0 z-10">
							<Picker
								disableSkinTonePicker={true}
								// disableSearchBar={true}
								pickerStyle={{
									backgroundColor: "#ddd",
									boxShadow: "none",
									border: "none",
									color: "white",
								}}
								onEmojiClick={(_e, em) => {
									if (cursorIndex.start === cursorIndex.end) {
										setComment((prev) =>
											[
												prev.slice(0, cursorIndex.start),
												em.emoji,
												prev.slice(cursorIndex.start),
											].join("")
										);
									} else {
										setComment((prev) =>
											[
												prev.slice(0, cursorIndex.start),
												em.emoji,
												prev.slice(cursorIndex.end),
											].join("")
										);
									}
								}}
								disableAutoFocus={true}
								native
							/>
						</div>
					)}
				</div>
				<section className="flex space-x-3">
					<button
						className="inline-flex items-center bg-emerald-500 backdrop-blur-sm hover:bg-emerald-600 text-sm font-bold p-2 rounded w-fit transition-all ease-in disabled:grayscale focus-visible:ring-fuchsia-500 focus-visible:ring-2"
						disabled={isLoading}
					>
						{isLoading ? (
							<span className="animate-pulse">Adding...</span>
						) : (
							<>Add Comment</>
						)}
					</button>
					<button
						type="button"
						onClick={() => setEmoji(!emoji)}
						className="grid place-items-center rounded aspect-square h-full min-h-[2.5rem] bg-neutral-600/40 ring-fuchsia-500 focus-visible:ring-2 hover:bg-neutral-900 hover:text-fuchsia-500 hover:ring-fuchsia-500 hover:ring-2 transition-colors ease-in-out"
					>
						<BsEmojiSmile />
					</button>
				</section>
			</form>
		);
	}

	return <></>;
};

export default CommentForm;
