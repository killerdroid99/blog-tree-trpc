import { Comments } from "@prisma/client";
import Image from "next/image";

interface CommentProps {
	comment: Comments & {
		user: {
			image: string | null;
			name: string | null;
		};
	};
}

const Comment = ({ comment }: CommentProps) => {
	return (
		<div
			key={comment.id}
			className="py-4 px-2 w-full text-sm ring-[1px] ring-neutral-700 rounded pl-12 relative"
		>
			<div className="absolute left-2 top-3">
				<Image
					src={comment.user.image as string}
					alt={comment.user.name as string}
					width={30}
					height={30}
					className="rounded-full"
				/>
			</div>
			<h4 className="text-fuchsia-500 font-bold">{comment.user.name}</h4>
			<p className="mt-1 ml-1">{comment.body}</p>
		</div>
	);
};

export default Comment;
