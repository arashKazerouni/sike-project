import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { directives as seedDirectives } from "@/lib/data";
import type { Directive } from "@/lib/types";

type User = { id: string; email: string; passwordHash: string; resetToken?: string; resetExpires?: number };
type Store = { users: User[]; likes: Record<string, string[]> };

const filePath = path.join(process.cwd(), ".data", "sike.json");
let writeQueue = Promise.resolve();

function expandMissions(): Directive[] {
  const vectors = ["Machine Learning QA", "Linguistic Validation", "Security Auditing", "Community Synthesis", "Data Engineering", "Governance"];
  const tiers = ["Recon", "Standard", "Advanced", "Apex"] as const;
  return Array.from({ length: 240 }, (_, index) => {
    const base = seedDirectives[index % seedDirectives.length];
    const vector = vectors[index % vectors.length];
    const difficulty = tiers[index % tiers.length];
    return { ...base, id: `SIKE-${String(index + 1).padStart(4, "0")}`, skillVector: vector, difficulty, title: `${base.title} // Node ${String(index + 1).padStart(3, "0")}`, reward: 25 + ((index * 37) % 480), priority: index % 5 === 0 ? "Critical" : base.priority };
  });
}

export const allMissions = expandMissions();

async function readStore(): Promise<Store> {
  try { return JSON.parse(await fs.readFile(filePath, "utf8")) as Store; }
  catch { return { users: [], likes: {} }; }
}

async function saveStore(store: Store) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  writeQueue = writeQueue.then(() => fs.writeFile(filePath, JSON.stringify(store, null, 2)));
  await writeQueue;
}

export function hashPassword(password: string) { return crypto.scryptSync(password, "sike-local-salt", 64).toString("hex"); }
export function makeToken() { return crypto.randomBytes(24).toString("hex"); }

export async function register(email: string, password: string) {
  const store = await readStore();
  if (store.users.some((user) => user.email === email)) throw new Error("ACCOUNT_EXISTS");
  const user = { id: makeToken(), email, passwordHash: hashPassword(password) };
  store.users.push(user); await saveStore(store); return { id: user.id, email: user.email };
}
export async function authenticate(email: string, password: string) {
  const store = await readStore(); const user = store.users.find((item) => item.email === email);
  if (!user || user.passwordHash !== hashPassword(password)) return null;
  return { id: user.id, email: user.email };
}
export async function createResetToken(email: string) {
  const store = await readStore(); const user = store.users.find((item) => item.email === email);
  if (!user) return null; user.resetToken = makeToken(); user.resetExpires = Date.now() + 30 * 60 * 1000; await saveStore(store); return user.resetToken;
}
export async function resetPassword(token: string, password: string) {
  const store = await readStore(); const user = store.users.find((item) => item.resetToken === token && (item.resetExpires ?? 0) > Date.now());
  if (!user) return false; user.passwordHash = hashPassword(password); delete user.resetToken; delete user.resetExpires; await saveStore(store); return true;
}
export async function toggleLike(missionId: string, userId: string) {
  const store = await readStore(); const likes = new Set(store.likes[missionId] ?? []); const liked = likes.has(userId); liked ? likes.delete(userId) : likes.add(userId); store.likes[missionId] = [...likes]; await saveStore(store); return { liked: !liked, count: likes.size };
}
export async function getLikes(missionId: string, userId?: string) { const likes = (await readStore()).likes[missionId] ?? []; return { count: likes.length, liked: userId ? likes.includes(userId) : false }; }
export async function getUserById(id: string) { return (await readStore()).users.find((user) => user.id === id); }
export function sessionCookie(userId: string) { return Buffer.from(`${userId}.${makeToken()}`).toString("base64url"); }
export function userIdFromCookie(value?: string) { return value ? Buffer.from(value, "base64url").toString().split(".")[0] : null; }
export const SESSION_COOKIE = "sike_session";
export const RESET_COOKIE = "sike_reset";
export { readStore };
