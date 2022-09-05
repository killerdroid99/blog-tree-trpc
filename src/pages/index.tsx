import type { NextPage } from "next";
import { trpc } from "$/utils/trpc";
import Post from "$/components/Post";
import AddPostButton from "$/components/AddPostButton";
import Layout from "$/components/Layout";

const Home: NextPage = () => {
	const { data, isLoading, error, isError } = trpc.useQuery([
		"posts.getAllPosts",
	]);

	return (
		<Layout title="Home">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-[96vw] xl:w-[76vw] relative">
				<AddPostButton extraClassNames="fixed right-[1rem] xl:right-[12vw] top-[4rem]" />
				{isLoading ? (
					<div className="text-center w-full col-span-3">Loading posts...</div>
				) : (
					data?.map((post) => <Post post={post} key={post.id} />)
				)}
				{isError && <div>{error.data?.code}</div>}
			</div>
		</Layout>
	);
};

export default Home;
