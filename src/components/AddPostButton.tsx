import { useSession } from "next-auth/react";
import Link from "next/link";

interface AddPostButtonProps {
	extraClassNames?: string;
}

const AddPostButton = ({ extraClassNames }: AddPostButtonProps) => {
	const { data: session } = useSession();

	if (session) {
		return (
			<Link href="/add-post">
				<button
					className={`${extraClassNames} inline-flex items-center space-x-2 bg-emerald-500/60 backdrop-blur-sm hover:bg-emerald-600 text-sm font-bold py-1 px-3 rounded-full transition-all ease-in`}
				>
					<div>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth="1.5"
							stroke="currentColor"
							className="w-5 h-5"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<span>Add Post</span>
				</button>
			</Link>
		);
	}

	return <></>;
};

export default AddPostButton;
