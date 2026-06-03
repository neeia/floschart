import type { EventContext } from "@cloudflare/workers-types";

export async function onRequest(
  context: EventContext<unknown, "user", Record<string, unknown>>,
) {
  const remote = `https://sync.runescape.wiki/runelite/player/${context.params.user}/STANDARD`;
  return await fetch(remote);
}
