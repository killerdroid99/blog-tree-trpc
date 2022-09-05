import { z } from "zod";
import { commentsRouter, protectedCommentRouter } from "./comments";
import { createRouter } from "./context";
import { createProtectedRouter } from "./protected-router";

export const postsRouter = createRouter()
	.query("getAllPosts", {
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
					_count: {
						select: {
							Votes: true,
							Comments: true,
						},
					},
					createdAt: true,
				},
				orderBy: {
					createdAt: "desc",
				},
			});
			return allPosts;
		},
	})
	.query("getPostById", {
		input: z.object({
			postId: z.string().min(1),
		}),
		async resolve({ input, ctx }) {
			const post = await ctx.prisma.posts.findUnique({
				where: {
					id: input.postId,
				},
				include: {
					user: {
						select: {
							name: true,
						},
					},
					_count: {
						select: {
							Votes: true,
							Comments: true,
						},
					},
				},
			});

			const getVotesStatus = await ctx.prisma.votes.findUnique({
				where: {
					userId_postId: {
						userId: ctx.session?.user?.id as string,
						postId: input.postId,
					},
				},
			});

			console.log(getVotesStatus);
			if (getVotesStatus) {
				return { ...post, voted: true };
			}

			return { ...post, voted: false };
		},
	})
	.merge(commentsRouter);

export const protectedPostRouter = createProtectedRouter()
	.mutation("add-post", {
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
	})
	.mutation("delete-post", {
		input: z.object({
			postId: z.string(),
		}),
		async resolve({ ctx, input }) {
			const postToBeDeleted = await ctx.prisma.posts.delete({
				where: {
					id: input.postId,
				},
			});
			return postToBeDeleted;
		},
	})
	.mutation("update-post", {
		input: z.object({
			postId: z.string(),
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
			const updatedPost = await ctx.prisma.posts.update({
				where: {
					id: input.postId,
				},
				data: {
					title: input.title,
					body: input.body,
				},
			});
			return updatedPost;
		},
	})
	.mutation("vote-post", {
		input: z.object({
			postId: z.string().min(1),
		}),
		async resolve({ ctx, input }) {
			const vote = await ctx.prisma.votes.findUnique({
				where: {
					userId_postId: {
						postId: input.postId,
						userId: ctx.session.user.id,
					},
				},
			});
			if (vote) {
				await ctx.prisma.votes.delete({
					where: {
						userId_postId: {
							postId: input.postId,
							userId: ctx.session.user.id,
						},
					},
				});
				return { msg: "removed vote" };
			}
			await ctx.prisma.votes.create({
				data: {
					postId: input.postId,
					userId: ctx.session.user.id,
				},
			});
			return { msg: "voted" };
		},
	})
	.merge(protectedCommentRouter);
