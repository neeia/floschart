import type { EventContext } from "@cloudflare/workers-types";

export async function onRequest(
  context: EventContext<unknown, "user", Record<string, unknown>>,
) {
  const remote = `https://sync.runescape.wiki/runelite/player/${context.params.user}/STANDARD`;
  const response = await fetch(remote, {
    headers: {
      "User-Agent": "floschart - (https://github.com/neeia/floschart)",
    },
  });
  return new Response(response.body, {
    headers: { "Content-Type": "application/json" },
  });
}
