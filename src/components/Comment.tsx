import { trpc } from "$/utils/trpc";
import { Comments } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { FaPencilAlt, FaRegTrashAlt } from "react-icons/fa";
import { useQueryClient } from "react-query";

interface CommentProps {
	comment: Comments & {
		user: {
			image: string | null;
			name: string | null;
		};
	};
	postOwnerId: string;
}

const Comment = ({ comment, postOwnerId }: CommentProps) => {
	const { data: session } = useSession();
	const qc = useQueryClient();
	const [edit, setEdit] = useState(false);
	const [newBody, setNewBody] = useState(comment.body);
	const {
		mutate: mutateEdit,
		isLoading: isEditLoading,
		error,
	} = trpc.useMutation(["posts.edit-comment"]);
	const { mutate: mutateDelete, isLoading: isDeleteLoading } = trpc.useMutation(
		["posts.delete-comment"]
	);

	const handleEdit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		mutateEdit(
			{
				id: comment.id,
				body: newBody,
			},
			{
				onSuccess() {
					qc.invalidateQueries([
						"posts.getCommentsForPost",
						{ postId: comment.postId as string },
					]);
					setEdit(false);
				},
			}
		);
	};

	const handleDelete = () => {
		window.confirm("Are you sure you want to delete this comment") &&
			mutateDelete(
				{ id: comment.id },
				{
					onSuccess() {
						qc.invalidateQueries([
							"posts.getCommentsForPost",
							{ postId: comment.postId as string },
						]);
					},
				}
			);
	};

	const formattedCreatedAt = formatDistanceToNow(new Date(comment.createdAt), {
		addSuffix: true,
	});

	const [commentError, setCommentError] = useState("");

	useEffect(() => {
		if (error) {
			const msg = JSON.parse(error.message);

			setCommentError(msg[0].message);
		}
	}, [error]);

	useEffect(() => {
		setNewBody(comment.body);
	}, [edit, comment.body]);

	return (
		<div
			key={comment.id}
			className="py-4 px-2 w-full text-sm ring-[1px] ring-neutral-300 dark:ring-neutral-700 rounded pl-12 relative group"
		>
			<div className="flex space-x-4 text-neutral-600 dark:text-neutral-400 absolute top-3 right-4 opacity-0 group-hover:opacity-100">
				{session?.user?.id === postOwnerId && (
					<FaRegTrashAlt
						className="cursor-pointer hover:text-red-500"
						title="Delete comment"
						onClick={handleDelete}
					/>
				)}
				{session?.user?.id !== postOwnerId &&
					session?.user?.id === comment.userId && (
						<FaRegTrashAlt
							className="cursor-pointer hover:text-red-500 text-inherit"
							title="Delete comment"
							onClick={handleDelete}
						/>
					)}
				{session?.user?.id === comment.userId && (
					<FaPencilAlt
						className="cursor-pointer hover:text-amber-500"
						title="Edit comment"
						onClick={() => setEdit(!edit)}
					/>
				)}
			</div>
			<div className="absolute left-2 top-3">
				<Image
					src={comment.user.image as string}
					alt={comment.user.name as string}
					width={30}
					height={30}
					className="rounded-full"
				/>
			</div>
			<h4 className="text-fuchsia-500 font-bold flex items-center">
				{session?.user?.id === comment.userId ? "You" : comment.user.name}{" "}
				<span className="text-xs text-neutral-500 inline ml-2">
					{formattedCreatedAt}
				</span>{" "}
			</h4>
			<div className="mt-2">
				{edit ? (
					<form className="space-y-2" onSubmit={(e) => handleEdit(e)}>
						<textarea
							value={newBody}
							maxLength={500}
							minLength={5}
							onChange={(e) => setNewBody(e.target.value)}
							className={`outline-none border-none w-full bg-neutral-200 dark:bg-neutral-900 p-2 focus-visible:ring-2 focus-visible:ring-fuchsia-500 transition-all ease-in peer rounded h-24 font-normal placeholder:text-gray-400 ${
								commentError !== "" && "ring-2 ring-red-500"
							}`}
							onFocus={() => setCommentError("")}
						/>
						<small className="text-red-500 block">{commentError}</small>
						<button className="inline-flex items-center bg-emerald-500 backdrop-blur-sm hover:bg-emerald-600 text-sm font-bold py-1 px-2 rounded w-fit transition-all ease-in">
							{isEditLoading ? (
								<span className="animate-pulse">Saving...</span>
							) : (
								<>Save</>
							)}
						</button>
						<button
							type="button"
							className="inline-flex items-center bg-rose-500 backdrop-blur-sm ml-2 hover:bg-rose-600 text-sm font-bold py-1 px-2 rounded w-fit transition-all ease-in"
							onClick={() => setEdit(false)}
						>
							Cancel
						</button>
					</form>
				) : (
					<p className="mt-1 ml-1">
						{isDeleteLoading ? (
							<span className="animate-pulse">Deleting...</span>
						) : (
							comment.body
						)}
					</p>
				)}
			</div>
		</div>
	);
};

export default Comment;
