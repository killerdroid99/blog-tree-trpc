import { createRouter } from "./context";
import { z } from "zod";
import { createProtectedRouter } from "./protected-router";

export const userRouter = createRouter()
	.query("getUser", {
		input: z
			.object({
				userId: z.string().min(1),
			})
			.nullish(),
		async resolve({ input, ctx }) {
			const user = await ctx.prisma.user.findUnique({
				where: { id: input?.userId },
			});

			return user;
		},
	})
	.query("getAll", {
		async resolve({ ctx }) {
			return await ctx.prisma.example.findMany();
		},
	})
	.query("getUserPosts", {
		input: z.object({
			userId: z.string().min(1),
		}),
		async resolve({ input, ctx }) {
			const userPosts = await ctx.prisma.posts.findMany({
				where: {
					userId: input.userId,
				},
			});

			return userPosts;
		},
	})
	.query("getUpvotedPosts", {
		input: z.object({
			userId: z.string().min(1),
		}),
		async resolve({ input, ctx }) {
			const posts = await ctx.prisma.posts.findMany({
				where: {
					Votes: {
						some: {
							userId: input.userId,
						},
					},
				},
			});

			return posts;
		},
	})
	.query("getUserComments", {
		input: z.object({
			userId: z.string().min(1),
		}),
		async resolve({ input, ctx }) {
			const posts = await ctx.prisma.posts.findMany({
				where: {
					Comments: {
						some: {
							userId: input.userId,
						},
					},
				},
			});

			return posts;
		},
	});

export const protectedUserRouter = createProtectedRouter().mutation(
	"change-name",
	{
		input: z.object({
			name: z
				.string()
				.trim()
				.min(3, "Post title must be 2 or more characters long")
				.max(20, "Post title must be 20 or fewer characters long"),
		}),
		async resolve({ ctx, input }) {
			const user = await ctx.prisma.user.update({
				where: {
					id: ctx.session.user.id,
				},
				data: {
					name: input.name,
				},
			});
			return user;
		},
	}
);
