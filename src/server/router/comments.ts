import { z } from "zod";
import { createRouter } from "./context";
import { createProtectedRouter } from "./protected-router";

export const commentsRouter = createRouter().query("getCommentsForPost", {
	input: z.object({
		postId: z.string().min(1),
	}),
	async resolve({ ctx, input }) {
		const comments = await ctx.prisma.comments.findMany({
			where: {
				postId: input.postId,
			},
			orderBy: {
				createdAt: "desc",
			},
			include: {
				user: {
					select: {
						name: true,
						image: true,
					},
				},
			},
		});
		return comments;
	},
});

export const protectedCommentRouter = createProtectedRouter()
	.mutation("add-comment", {
		input: z.object({
			body: z
				.string()
				.trim()
				.min(5, "Comment body must be 5 or more characters long")
				.max(500, "Comment body must be 500 or fewer characters long"),
			postId: z.string().min(1),
		}),
		async resolve({ ctx, input }) {
			const newComment = await ctx.prisma.comments.create({
				data: {
					userId: ctx.session.user.id,
					postId: input.postId,
					body: input.body,
				},
			});
			return newComment;
		},
	})
	.mutation("edit-comment", {
		input: z.object({
			body: z
				.string()
				.trim()
				.min(5, "Comment body must be 5 or more characters long")
				.max(500, "Comment body must be 500 or fewer characters long"),
			id: z.string().min(1),
		}),
		async resolve({ ctx, input }) {
			const newComment = await ctx.prisma.comments.update({
				where: {
					id: input.id,
				},
				data: {
					body: input.body,
				},
			});
			return newComment;
		},
	})
	.mutation("delete-comment", {
		input: z.object({
			id: z.string().min(1),
		}),
		async resolve({ ctx, input }) {
			const findComment = await ctx.prisma.comments.findUnique({
				where: {
					id: input.id,
				},
				include: {
					post: {
						select: {
							userId: true,
						},
					},
				},
			});

			if (
				findComment?.userId === ctx.session.user.id ||
				findComment?.post.userId === ctx.session.user.id
			) {
				const comment = await ctx.prisma.comments.delete({
					where: {
						id: input.id,
					},
				});
				return comment;
			}
		},
	});
