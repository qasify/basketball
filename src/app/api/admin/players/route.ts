import { NextRequest, NextResponse } from "next/server";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const GITHUB_REPO = process.env.GITHUB_REPO || "qasify/basketball";
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "free-agent-tracker";
const FILE_PATH = "public/data/free_agents.json";

async function getFile() {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}?ref=${GITHUB_BRANCH}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GitHub GET failed: ${res.status}`);
  const data = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return { sha: data.sha, json: JSON.parse(content) };
}

async function commitFile(sha: string, json: object, message: string) {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${FILE_PATH}`;
  const content = Buffer.from(JSON.stringify(json, null, 2)).toString("base64");
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, content, sha, branch: GITHUB_BRANCH }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub PUT failed: ${res.status} - ${err}`);
  }
  return res.json();
}

// DELETE /api/admin/players?name=PlayerName
export async function DELETE(req: NextRequest) {
  if (!GITHUB_TOKEN) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }
  const name = req.nextUrl.searchParams.get("name");
  if (!name) return NextResponse.json({ error: "Missing name" }, { status: 400 });

  try {
    const { sha, json } = await getFile();
    const tiers = ["tier1", "tier2", "tier3"] as const;
    let deleted = false;
    for (const tier of tiers) {
      const before = json.free_agents[tier].length;
      json.free_agents[tier] = json.free_agents[tier].filter(
        (p: any) => p.name !== name
      );
      if (json.free_agents[tier].length < before) deleted = true;
    }
    if (!deleted) return NextResponse.json({ error: "Player not found" }, { status: 404 });

    json.metadata.generated = new Date().toISOString().split("T")[0];
    await commitFile(sha, json, `Remove player: ${name}`);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST /api/admin/players  body: { player: {...}, tier: "tier1"|"tier2"|"tier3" }
export async function POST(req: NextRequest) {
  if (!GITHUB_TOKEN) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { player, tier } = body;
  if (!player?.name || !tier) {
    return NextResponse.json({ error: "Missing player or tier" }, { status: 400 });
  }
  const validTiers = ["tier1", "tier2", "tier3"];
  if (!validTiers.includes(tier)) {
    return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
  }

  try {
    const { sha, json } = await getFile();

    // Check duplicate
    const all = [...json.free_agents.tier1, ...json.free_agents.tier2, ...json.free_agents.tier3];
    if (all.some((p: any) => p.name === player.name)) {
      return NextResponse.json({ error: "Player already exists" }, { status: 409 });
    }

    json.free_agents[tier].push(player);
    json.metadata.generated = new Date().toISOString().split("T")[0];
    await commitFile(sha, json, `Add player: ${player.name}`);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
