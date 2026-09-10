import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { directives as seedDirectives } from "@/lib/data";
import type { Directive } from "@/lib/types";

type User = {
  id: string;
  email: string;
  passwordHash: string;
  resetTokenHash?: string;
  resetExpires?: number;
};

type Store = { users: User[]; likes: Record<string, string[]> };

const filePath = path.join(process.cwd(), ".data", "sike.json");
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
const RESET_TTL_MS = 30 * 60 * 1000;
const SESSION_SECRET = process.env.SIKE_SESSION_SECRET ?? "development-only-sike-session-secret";

if (process.env.NODE_ENV === "production" && !process.env.SIKE_SESSION_SECRET) {
  console.warn("SIKE_SESSION_SECRET is not configured; signed sessions are using a development fallback.");
}

let writeQueue: Promise<void> = Promise.resolve();

function expandMissions(): Directive[] {
  const vectors = ["Machine Learning QA", "Linguistic Validation", "Security Auditing", "Community Synthesis", "Data Engineering", "Governance"];
  const tiers = ["Recon", "Standard", "Advanced", "Apex"] as const;
  return Array.from({ length: 240 }, (_, index) => {
    const base = seedDirectives[index % seedDirectives.length];
    const vector = vectors[index % vectors.length];
    const difficulty = tiers[index % tiers.length];
    return {
      ...base,
      id: `SIKE-${String(index + 1).padStart(4, "0")}`,
      skillVector: vector,
      difficulty,
      title: `${base.title} // Node ${String(index + 1).padStart(3, "0")}`,
      reward: 25 + ((index * 37) % 480),
      priority: index % 5 === 0 ? "Critical" : base.priority,
    };
  });
}

export const allMissions = expandMissions();

function isStore(value: unknown): value is Store {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<Store>;
  return Array.isArray(candidate.users) && !!candidate.likes && typeof candidate.likes === "object";
}

async function readStore(): Promise<Store> {
  try {
    const parsed: unknown = JSON.parse(await fs.readFile(filePath, "utf8"));
    return isStore(parsed) ? parsed : { users: [], likes: {} };
  } catch {
    return { users: [], likes: {} };
  }
}

async function saveStore(store: Store): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const payload = JSON.stringify(store, null, 2);
  writeQueue = writeQueue.then(async () => {
    const tempPath = `${filePath}.${process.pid}.tmp`;
    await fs.writeFile(tempPath, payload, "utf8");
    await fs.rename(tempPath, filePath);
  });
  await writeQueue;
}

async function updateStore(mutator: (store: Store) => void): Promise<Store> {
  const previous = writeQueue;
  let result: Store | undefined;
  writeQueue = previous.then(async () => {
    const store = await readStore();
    mutator(store);
    result = store;
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    const tempPath = `${filePath}.${process.pid}.tmp`;
    await fs.writeFile(tempPath, JSON.stringify(store, null, 2), "utf8");
    await fs.rename(tempPath, filePath);
  });
  await writeQueue;
  return result!;
}

export function hashPassword(password: string): string {
  return crypto.scryptSync(password, "sike-local-salt", 64).toString("hex");
}

export function makeToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function signSession(payload: string): string {
  return crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("base64url");
}

export function register(email: string, password: string) {
  return updateStore((store) => {
    if (store.users.some((user) => user.email === email)) throw new Error("ACCOUNT_EXISTS");
    store.users.push({ id: makeToken(), email, passwordHash: hashPassword(password) });
  }).then((store) => {
    const user = store.users[store.users.length - 1];
    return { id: user.id, email: user.email };
  });
}

export async function authenticate(email: string, password: string) {
  const store = await readStore();
  const user = store.users.find((item) => item.email === email);
  if (!user) return null;

  const expected = Buffer.from(user.passwordHash, "hex");
  const actual = Buffer.from(hashPassword(password), "hex");
  if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) return null;

  return { id: user.id, email: user.email };
}

export async function createResetToken(email: string) {
  const token = makeToken();
  let found = false;
  await updateStore((store) => {
    const user = store.users.find((item) => item.email === email);
    if (!user) return;
    found = true;
    user.resetTokenHash = hashToken(token);
    user.resetExpires = Date.now() + RESET_TTL_MS;
  });
  return found ? token : null;
}

export async function resetPassword(token: string, password: string) {
  const tokenHash = hashToken(token);
  let reset = false;
  await updateStore((store) => {
    const user = store.users.find(
      (item) => item.resetTokenHash === tokenHash && (item.resetExpires ?? 0) > Date.now(),
    );
    if (!user) return;
    user.passwordHash = hashPassword(password);
    delete user.resetTokenHash;
    delete user.resetExpires;
    reset = true;
  });
  return reset;
}

export async function toggleLike(missionId: string, userId: string) {
  if (!allMissions.some((mission) => mission.id === missionId)) throw new Error("MISSION_NOT_FOUND");
  let result = { liked: false, count: 0 };
  await updateStore((store) => {
    const likes = new Set(store.likes[missionId] ?? []);
    const liked = likes.has(userId);
    if (liked) likes.delete(userId);
    else likes.add(userId);
    store.likes[missionId] = [...likes];
    result = { liked: !liked, count: likes.size };
  });
  return result;
}

export async function getLikes(missionId: string, userId?: string) {
  const likes = (await readStore()).likes[missionId] ?? [];
  return { count: likes.length, liked: userId ? likes.includes(userId) : false };
}

export async function getUserById(id: string) {
  return (await readStore()).users.find((user) => user.id === id);
}

export function sessionCookie(userId: string): string {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `${userId}.${expiresAt}.${makeToken()}`;
  return `${payload}.${signSession(payload)}`;
}

export function userIdFromCookie(value?: string): string | null {
  if (!value) return null;
  const parts = value.split(".");
  if (parts.length !== 4) return null;
  const [userId, expiresAt, nonce, signature] = parts;
  if (!userId || !expiresAt || !nonce || !signature || Number(expiresAt) <= Math.floor(Date.now() / 1000)) return null;

  const payload = `${userId}.${expiresAt}.${nonce}`;
  const expected = signSession(payload);
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(signature);
  if (expectedBuffer.length !== actualBuffer.length || !crypto.timingSafeEqual(expectedBuffer, actualBuffer)) return null;
  return userId;
}

export const SESSION_COOKIE = "sike_session";
export const RESET_COOKIE = "sike_reset";
export { readStore };
