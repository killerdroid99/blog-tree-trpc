import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface PostProps {
	post: {
		user: {
			id: string;
			name: string | null;
		};
		id: string;
		title: string;
		createdAt: Date;
		_count: {
			Votes: number;
		};
	};
}

const Post = ({ post }: PostProps) => {
	const formattedCreatedAt = formatDistanceToNow(new Date(post.createdAt), {
		addSuffix: true,
	});

	const { data: session } = useSession();

	return (
		<div className="bg-gray-500/20 px-4 py-2 rounded mx-auto w-full space-y-14 shadow-md">
			<span className="flex justify-between items-center">
				<h3 className="text-xl font-bold" title={post.title}>
					{post.title.length < 25 ? (
						<>{post.title}</>
					) : (
						<>{post.title.slice(0, 25)}...</>
					)}
				</h3>
				<div className="flex flex-col text-right">
					<p className="text-neutral-400 text-xs tracking-wide">
						created by{" "}
						<strong className="text-fuchsia-500">
							{session?.user?.id === post.user.id ? (
								<>You</>
							) : (
								<>{post.user.name}</>
							)}
						</strong>
					</p>
					<p className="text-neutral-300 text-xs tracking-wide">
						{formattedCreatedAt}
					</p>
				</div>
			</span>
			<div className="inline-flex justify-between w-full">
				<div className="px-2 ring-1 ring-fuchsia-500 hover:bg-fuchsia-500/20 text-inherit font-bold inline-flex items-center space-x-1 font-raleway rounded-full cursor-default">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						className="w-4 h-4"
					>
						<path
							fillRule="evenodd"
							d="M5.23 15.79a.75.75 0 01-.02-1.06l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 11-1.08 1.04L10 11.832 6.29 15.77a.75.75 0 01-1.06.02zm0-6a.75.75 0 01-.02-1.06l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 11-1.08 1.04L10 5.832 6.29 9.77a.75.75 0 01-1.06.02z"
							clipRule="evenodd"
						/>
					</svg>
					<span>{post._count.Votes}</span>
				</div>
				<Link href={`/posts/${post.id}`}>
					<button
						tabIndex={0}
						className="text-cyan-400 cursor-pointer hover:underline underline-offset-2 text-sm decoration-1 font-semibold translate-y-1 focus-visible:outline-none focus-visible:border-none focus-visible:underline"
					>
						View Post
					</button>
				</Link>
			</div>
		</div>
	);
};

export default Post;
