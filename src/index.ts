import { type BetterAuthPlugin, type User, generateId } from "better-auth";
import {
	APIError,
	createAuthEndpoint,
	sessionMiddleware,
} from "better-auth/api";
import {
	type SiweMessage,
	generateSiweNonce,
	validateSiweMessage,
} from "viem/siwe";
import { z } from "zod";
import { SiweMessageSchema } from "./schema";

export const ERROR_CODES = {
	NO_SESSION: "No session found.",
} as const;

export const siwe = () => {
	return {
		id: "siwe",
		endpoints: {
			generateNonce: createAuthEndpoint(
				"/nonce",
				{
					method: "GET",
				},
				async (ctx) => {
					ctx.json({
						nonce: generateSiweNonce(),
					});
				},
			),
			verifyNonce: createAuthEndpoint(
				"/verify",
				{
					method: "POST",
					body: z.object({
						message: SiweMessageSchema,
						signature: z.string(),
					}),
				},
				async (ctx) => {
					const { message, signature } = ctx.body;
					validateSiweMessage({
						message: message as SiweMessage,
						signature,
					});
				},
			),
		},
	} satisfies BetterAuthPlugin;
};
