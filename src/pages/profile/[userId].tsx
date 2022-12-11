import { NextPage } from "next";
import Layout from "$/components/Layout";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { BiEditAlt } from "react-icons/bi";
import { trpc } from "$/utils/trpc";
import { FaLongArrowAltRight } from "react-icons/fa";
import { useRouter } from "next/router";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useQueryClient } from "react-query";

const Profile: NextPage = () => {
	const router = useRouter();
	const { data: session } = useSession();

	const { data: user } = trpc.useQuery([
		"users.getUser",
		{ userId: router.query.userId as string },
	]);

	const { data: userPosts } = trpc.useQuery([
		"users.getUserPosts",
		{ userId: router.query.userId as string },
	]);

	const { data: upvotedPosts } = trpc.useQuery([
		"users.getUpvotedPosts",
		{ userId: router.query.userId as string },
	]);

	const { data: commentedPosts } = trpc.useQuery([
		"users.getUserComments",
		{ userId: router.query.userId as string },
	]);

	const { mutate, error: nameError } = trpc.useMutation(["users.change-name"]);

	const [editName, setEditName] = useState(false);

	const [error, setError] = useState("");

	const name = useRef<HTMLInputElement>(null);

	const qc = useQueryClient();

	const handleNameChange = (e: FormEvent) => {
		e.preventDefault();
		window.confirm("Reload to save changes?") &&
			mutate(
				{
					name: name.current?.value as string,
				},
				{
					onSuccess() {
						// setEditName(false);
						// qc.invalidateQueries(["auth.getSession"]);
						window.location.reload();
					},
				}
			);
	};

	// trpc.useQuery(['auth.getSession'])

	useEffect(() => {
		if (nameError) {
			const msg = JSON.parse(nameError.message);
			setError(msg[0].message);
		}
	}, [nameError]);

	return (
		<Layout title="Profile">
			<div className="flex flex-col w-[98%] lg:w-[84rem] rounded items-center">
				<div className="mt-4">
					<Image
						src={user?.image as string}
						alt={user?.name as string}
						width={80}
						height={80}
						className="rounded-full"
					/>{" "}
				</div>

				<div className="font-bold text-xl space-x-2">
					{editName ? (
						<form
							className="flex flex-col space-y-2"
							onSubmit={(e) => handleNameChange(e)}
						>
							<input
								type="text"
								minLength={3}
								maxLength={20}
								onFocus={() => setError("")}
								ref={name}
								placeholder="Enter new name (min 3 characters long)"
								className={`outline-none border-none bg-neutral-100 text-sm placeholder:font-light dark:bg-neutral-800 p-1 focus-visible:ring-2 focus-visible:ring-fuchsia-500 transition-all ease-in peer rounded ${
									error !== "" && "ring-2 ring-red-500"
								}`}
							/>
							<small className="text-red-500 text-xs">{error}</small>
							<div className="space-x-3">
								<button className="inline-flex py-1 px-3 rounded text-sm bg-emerald-600 hover:bg-emerald-700 focus:ring-2 focus:ring-indigo-600 focus:ring-offset-1 tracking-wider focus:outline-none font-bold transition-colors ease-out">
									confirm
								</button>
								<button
									type="button"
									className="inline-flex py-1 px-3 rounded text-sm bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-indigo-600 focus:ring-offset-1 tracking-wider focus:outline-none font-bold transition-colors ease-out"
									onClick={() => setEditName(false)}
								>
									cancel
								</button>
							</div>
						</form>
					) : (
						<>
							<span>{user?.name}</span>
							{session?.user?.id === user?.id && (
								<BiEditAlt
									className="inline cursor-pointer hover:text-fuchsia-500"
									onClick={() => setEditName(true)}
								/>
							)}
						</>
					)}
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 grid-flow-row lg:justify-center gap-10 w-full mt-6 bg-neutral-50 dark:bg-neutral-900 p-4">
					<div
						className={`w-full ${
							session?.user?.id !== user?.id && "col-span-3"
						}`}
					>
						<h3 className="text-xl lg:text-center font-extrabold underline decoration-2 decoration-fuchsia-500 underline-offset-4 mb-5">
							{session?.user?.id === user?.id ? "Your Posts" : "Posts"}
						</h3>
						<div className="flex flex-col space-y-3 mx-auto">
							{userPosts &&
								userPosts.map((p) => (
									<Link href={`/posts/${p.id}`} key={p.id}>
										<div
											title="view post"
											className="py-3 px-4 bg-neutral-200 dark:bg-neutral-700/20 flex items-center rounded font-bold justify-between group cursor-pointer"
										>
											<div>{p.title}</div>
											<FaLongArrowAltRight className="text-2xl transition-all group-hover:text-fuchsia-500 group-hover:translate-x-2" />
										</div>
									</Link>
								))}
						</div>
					</div>
					{session?.user?.id === user?.id && (
						<div className="w-full">
							<h3 className="text-xl lg:text-center font-extrabold underline decoration-2 decoration-fuchsia-500 underline-offset-4 mb-5">
								Upvoted Posts
							</h3>
							<div className="flex flex-col space-y-3">
								{upvotedPosts &&
									upvotedPosts.map((p) => (
										<Link href={`/posts/${p.id}`} key={p.id}>
											<div
												title="view post"
												className="py-3 px-4 bg-neutral-200 dark:bg-neutral-700/20 flex items-center rounded font-bold justify-between group cursor-pointer"
											>
												<div>{p.title}</div>
												<FaLongArrowAltRight className="text-2xl transition-all group-hover:text-fuchsia-500 group-hover:translate-x-2" />
											</div>
										</Link>
									))}
							</div>
						</div>
					)}
					{session?.user?.id === user?.id && (
						<div className="w-full">
							<h3 className="text-xl lg:text-center font-extrabold underline decoration-2 decoration-fuchsia-500 underline-offset-4 mb-5">
								Commented Posts
							</h3>
							<div className="flex flex-col space-y-3">
								{commentedPosts &&
									commentedPosts.map((p) => (
										<Link href={`/posts/${p.id}`} key={p.id}>
											<div
												title="view post"
												className="py-3 px-4 bg-neutral-200 dark:bg-neutral-700/20 flex items-center rounded font-bold justify-between group cursor-pointer"
											>
												<div>{p.title}</div>
												<FaLongArrowAltRight className="text-2xl transition-all group-hover:text-fuchsia-500 group-hover:translate-x-2" />
											</div>
										</Link>
									))}{" "}
							</div>
						</div>
					)}
				</div>
			</div>
		</Layout>
	);
};

export default Profile;
