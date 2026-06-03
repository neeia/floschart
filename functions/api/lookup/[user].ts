import { UserData } from "@/types/external/runelite";
import type { EventContext } from "@cloudflare/workers-types";

export async function onRequest(
  context: EventContext<unknown, "user", Record<string, unknown>>,
) {
  const remote = `https://sync.runescape.wiki/runelite/player/${context.params.user}/STANDARD`;
  const response = await fetch(remote);
  const data = (await response.json()) as UserData;
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
