import type { NextPage } from "next";
import Head from "next/head";
import Navbar from "$/components/Navbar";
import { trpc } from "../utils/trpc";
import Post from "$/components/Post";

const Home: NextPage = () => {
	const { data, isLoading, error, isError } = trpc.useQuery([
		"posts.getAllPosts",
	]);
	return (
		<>
			<Head>
				<title>Blog Tree | Home</title>
				<meta name="description" content="Generated by create-t3-app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="flex flex-col items-center pt-28 h-screen w-screen bg-neutral-800 text-slate-50 font-raleway">
				<Navbar />
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-[96vw] xl:w-[76vw]">
					{isLoading ? (
						<div className="text-center w-full col-span-3">
							Loading posts...
						</div>
					) : (
						data?.map((post) => <Post post={post} key={post.id} />)
					)}
					{isError && <div>{error.data?.code}</div>}
				</div>
			</main>
		</>
	);
};

export default Home;