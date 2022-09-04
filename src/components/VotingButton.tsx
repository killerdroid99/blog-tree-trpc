import { trpc } from "$/utils/trpc";
import { useSession } from "next-auth/react";
import { useQueryClient } from "react-query";

interface VotingButtonProps {
	extraClassNames?: string;
	votes: number;
	postId: string;
}

const VotingButton = ({
	extraClassNames,
	votes,
	postId,
}: VotingButtonProps) => {
	const { data: session } = useSession();
	const {
		mutate: vote,
		isLoading,
		data,
	} = trpc.useMutation(["posts.vote-post"]);
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
				className={`${extraClassNames} inline-flex items-center bg-yellow-500 backdrop-blur-sm hover:bg-yellow-600 text-sm font-bold rounded-full transition-all ease-in`}
			>
				<div className="flex-1 text-base -translate-y-px text-center py-px px-3">
					{votes}
				</div>
				<div className="w-[2px] h-8 bg-yellow-700/50" />
				<span className="py-px px-3">
					{isLoading ? "saving" : data?.msg !== "voted" ? "vote?" : "voted!"}
				</span>
			</button>
		);
	}

	return <></>;
};

export default VotingButton;
