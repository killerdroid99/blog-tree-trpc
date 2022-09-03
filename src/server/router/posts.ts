import { z } from "zod";
import { createRouter } from "./context";
import { createProtectedRouter } from "./protected-router";

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

export const protectedPostRouter = createProtectedRouter().mutation(
	"add-post",
	{
		input: z.object({
			title: z
				.string()
				.trim()
				.min(5, "Post title must be 5 or more characters long")
				.max(50, "Post title must be 50 or fewer characters long"),
			body: z
				.string()
				.trim()
				.min(25, "Post body must be 25 or more characters long"),
		}),
		async resolve({ ctx, input }) {
			const newPost = await ctx.prisma.posts.create({
				data: {
					userId: ctx.session.user.id,
					title: input.title,
					body: input.body,
				},
			});
			return newPost;
		},
	}
);
