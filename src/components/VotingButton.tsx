import { trpc } from "$/utils/trpc";
import { signIn, useSession } from "next-auth/react";
import { useQueryClient } from "react-query";

interface VotingButtonProps {
	extraClassNames?: string;
	votes: number;
	postId: string;
	isVoted: boolean;
}

const VotingButton = ({
	extraClassNames,
	votes,
	postId,
	isVoted,
}: VotingButtonProps) => {
	const { data: session } = useSession();
	const { mutate: vote, isLoading } = trpc.useMutation(["posts.vote-post"]);
	const qc = useQueryClient();

	const handleVote = () => {
		vote(
			{ postId },
			{
				onSuccess() {
					qc.invalidateQueries(["posts.getPostById", { postId }]);
				},
			}
		);
	};

	if (session) {
		return (
			<button
				onClick={() => handleVote()}
				className={`${extraClassNames} inline-flex items-center bg-yellow-700/50 ring-[2px] ring-yellow-700/80 backdrop-blur-sm hover:bg-yellow-600 text-sm font-bold rounded-full transition-all ease-in`}
			>
				<div className="flex-1 text-base text-center px-3">{votes}</div>
				<div className="w-[2px] h-8 bg-yellow-700/80" />
				<span className="px-3">
					{isLoading ? "saving" : isVoted ? "voted!" : "vote?"}
				</span>
			</button>
		);
	}

	return (
		<div
			className={
				extraClassNames +
				" flex w-full items-center  text-sm space-x-3 font-sans"
			}
		>
			<div className="flex cursor-default items-center bg-yellow-700/50 ring-[2px] ring-yellow-700/80 font-bold rounded-full px-2 space-x-2 py-px">
				<div className="flex-1">{votes}</div>
				<span className="lining-nums">{votes === 1 ? "vote" : "votes"}</span>
			</div>
			<span className="font-bold">
				<span
					className="text-fuchsia-500 mx-1 cursor-pointer"
					onClick={() => signIn()}
				>
					Login
				</span>{" "}
				to Vote & comment
			</span>
		</div>
	);
};

export default VotingButton;
