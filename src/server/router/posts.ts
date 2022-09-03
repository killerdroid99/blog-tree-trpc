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
				.min(5, "Post title is too short")
				.max(50, "Title is too long"),
			body: z.string().min(5, "Post body is too short"),
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
