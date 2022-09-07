import type { NextPage } from "next";
import { trpc } from "$/utils/trpc";
import Post from "$/components/Post";
import AddPostButton from "$/components/AddPostButton";
import Layout from "$/components/Layout";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { LegacyRef } from "react";

const Home: NextPage = () => {
	const { data, isLoading, error, isError } = trpc.useQuery([
		"posts.getAllPosts",
	]);

	const [parent] = useAutoAnimate();

	return (
		<Layout title="Home">
			<AddPostButton extraClassNames="fixed right-[1rem] xl:right-[12vw] top-[4rem]" />
			<div
				className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-[96vw] xl:w-[76vw] relative"
				ref={parent as LegacyRef<HTMLDivElement>}
			>
				{isLoading ? (
					<div className="text-center w-full col-span-3">Loading posts...</div>
				) : data?.length === 0 ? (
					<span className="col-span-3 text-center font-bold tracking-wide">
						No posts found 🥲
					</span>
				) : (
					data?.map((post) => <Post post={post} key={post.id} />)
				)}
				{isError && <div>{error.data?.code}</div>}
			</div>
		</Layout>
	);
};

export default Home;
