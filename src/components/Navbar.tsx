import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
	const { data: session, status } = useSession();

	return (
		<header className="flex bg-neutral-800 z-10 border-b border-neutral-600/50 py-2 px-1 sm:px-4 lg:px-[10vw] justify-between w-full fixed top-0">
			<Link href="/">
				<button className="cursor-pointer focus-visible:underline underline-offset-2 decoration-fuchsia-500 outline-none border-none focus-visible:text-fuchsia-500">
					<h2 className="text-xl font-bold font-mono">
						Blog<span className="text-fuchsia-500 ml-1">Tree</span>
					</h2>
				</button>
			</Link>
			<nav>
				{status === "unauthenticated" && (
					<div>
						<button
							onClick={() => signIn()}
							className="inline-flex py-1 px-3 rounded text-sm bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-indigo-600 focus:ring-offset-1 tracking-wider focus:outline-none font-bold transition-colors ease-out"
						>
							Login
						</button>
					</div>
				)}
				{status === "authenticated" && (
					<div className="space-x-2 sm:space-x-6 flex items-center">
						<span className="font-bold text-xs sm:text-sm flex items-center gap-2">
							<Image
								src={session.user?.image as string}
								alt={session.user?.name as string}
								width={25}
								height={25}
								className="rounded-full"
							/>
							{session.user?.name}
						</span>
						<button
							onClick={() => signOut()}
							className="inline-flex py-1 px-3 rounded text-sm bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-indigo-600 focus:ring-offset-1 tracking-wider focus:outline-none font-bold transition-colors ease-out"
						>
							Logout
						</button>
					</div>
				)}
				{status === "loading" && (
					<div>
						<button className="inline-flex py-1 px-3 rounded text-sm bg-amber-600 hover:bg-amber-700 focus:ring-2 focus:ring-indigo-600 focus:ring-offset-1 tracking-wider focus:outline-none font-bold transition-colors ease-out animate-pulse">
							Loading...
						</button>
					</div>
				)}
			</nav>
		</header>
	);
};

export default Navbar;
