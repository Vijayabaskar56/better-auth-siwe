import { z } from "zod";

export const SiweMessageSchema = z.object({
	address: z.string().refine((val) => val.startsWith("0x")),
	domain: z.string(),
	nonce: z.string(),
	uri: z.string(),
	version: z.literal("1"),
	chainId: z.number(),
	statement: z.string().optional(),
	issuedAt: z.string().optional(),
	expirationTime: z.string().optional(),
	notBefore: z.string().optional(),
	requestId: z.string().optional(),
	resources: z.array(z.string()).optional(),
	scheme: z.string().optional(),
});
