import { createRouter } from "./context";

export const postsRouter = createRouter().query("getAllPosts", {
	async resolve({ ctx }) {
		const allPosts = await ctx.prisma.posts.findMany({
			select: {
				id: true,
				title: true,
				user: {
					select: {
						id: true,
						name: true,
					},
				},
				votes: true,
				createdAt: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});
		return allPosts;
	},
});
