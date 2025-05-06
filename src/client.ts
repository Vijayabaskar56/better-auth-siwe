import { http, createPublicClient, createTestClient, custom } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { zksyncSepoliaTestnet } from "viem/chains";
import { createSiweMessage } from "viem/siwe";

import type { BetterAuthClientPlugin } from "better-auth";
import type { siwe } from "./index";

type SiwePlugin = typeof siwe;

export const siweClientPlugin = () => {
	return {
		id: "reverify",
		$InferServerPlugin: {} as ReturnType<SiwePlugin>,
		pathMethods: {
			"/nonce": "GET",
			"/verify": "POST",
		},
	} satisfies BetterAuthClientPlugin;
};

const message = createSiweMessage({
	address: "0xdummyAddress",
	chainId: zksyncSepoliaTestnet.id,
	domain: "example.com",
	nonce: "foobarbaz",
	uri: "https://example.com/path",
	version: "1",
});
console.log(message);

export const publicClient = createPublicClient({
	chain: zksyncSepoliaTestnet,
	transport: http(),
});

export const walletClient = createTestClient({
	chain: zksyncSepoliaTestnet,
	mode: "anvil",
	transport: http(),
});

export const account = await privateKeyToAccount("0xdummySecret");
// export const account = privateKeyToAccount(...)
const signature = await account.signMessage({ message });
const valid = await publicClient.verifySiweMessage({
	message,
	signature,
});
console.log(account, "account", message, "message", signature, "signature");
