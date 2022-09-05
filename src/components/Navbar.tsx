import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { RiMoonClearLine, RiSunLine } from "react-icons/ri";
import { useEffect, useState } from "react";

const Navbar = () => {
	const { data: session, status } = useSession();
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	return (
		<header className="flex bg-neutral-100/80 dark:bg-neutral-800/80 backdrop-blur-sm z-10 border-b border-neutral-400/50 dark:border-neutral-600/50 py-2 px-1 sm:px-4 lg:px-[10vw] justify-between w-full fixed top-0">
			<Link href="/">
				<button className="cursor-pointer focus-visible:underline underline-offset-2 decoration-fuchsia-500 outline-none border-none focus-visible:text-fuchsia-500 text-inherit">
					<h2 className="text-xl font-bold font-mono">
						Blog<span className="text-fuchsia-500 ml-1">Tree</span>
					</h2>
				</button>
			</Link>
			<nav className="flex items-center">
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
				{mounted && (
					<button
						className="text-inherit focus-visible:ring-fuchsia-500 focus-visible:text-fuchsia-500 hover:text-fuchsia-500 inline-grid place-items-center mx-2 rounded bg-neutral-300 dark:bg-neutral-700 p-2 text-lg hover:ring-2 ring-fuchsia-500 border-none outline-none focus-visible:ring-2"
						onClick={() => {
							theme === "light" ? setTheme("dark") : setTheme("light");
						}}
					>
						{theme === "light" ? <RiSunLine /> : <RiMoonClearLine />}
					</button>
				)}
			</nav>
		</header>
	);
};

export default Navbar;
