// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { protectedExampleRouter } from "./protected-example-router";
import { postsRouter, protectedPostRouter } from "./posts";
import { protectedUserRouter, userRouter } from "./user";

export const appRouter = createRouter()
	.transformer(superjson)
	.merge("example.", exampleRouter)
	.merge("auth.", protectedExampleRouter)
	.merge("posts.", postsRouter)
	.merge("posts.", protectedPostRouter)
	.merge("users.", userRouter)
	.merge("users.", protectedUserRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
