import { readdir, symlink, mkdir, rm, lstat } from "node:fs/promises";
import { join } from "node:path";
import { CLAUDE_DIR, PROFILES_DIR, SESSION_FILES } from "./paths";

const NAME_RE = /^[a-zA-Z0-9_-]+$/;

export function validateName(name: string): void {
  if (!NAME_RE.test(name)) {
    throw new Error(`Invalid profile name "${name}". Use only alphanumeric, hyphen, underscore.`);
  }
}

export function profileDir(name: string): string {
  return join(PROFILES_DIR, name);
}

export async function ensureProfilesDir(): Promise<void> {
  await mkdir(PROFILES_DIR, { recursive: true });
}

export async function profileExists(name: string): Promise<boolean> {
  try {
    const stat = await lstat(profileDir(name));
    return stat.isSymbolicLink() || stat.isDirectory();
  } catch {
    return false;
  }
}

export async function listProfiles(): Promise<string[]> {
  try {
    const entries = await readdir(PROFILES_DIR);
    return entries.filter((e) => !e.startsWith("."));
  } catch {
    return [];
  }
}

/**
 * Symlink shared files from ~/.claude into a profile directory.
 * Session files (credentials) are skipped so each profile gets its own login.
 */
async function syncSharedFiles(dir: string): Promise<void> {
  let entries: string[];
  try {
    entries = await readdir(CLAUDE_DIR);
  } catch {
    return; // ~/.claude doesn't exist yet
  }
  for (const entry of entries) {
    if (SESSION_FILES.has(entry)) continue;
    const target = join(dir, entry);
    try {
      await lstat(target);
      continue; // already exists in profile dir
    } catch {
      // doesn't exist yet — create symlink
    }
    await symlink(join(CLAUDE_DIR, entry), target);
  }
}

export async function createProfile(name: string): Promise<void> {
  const dir = profileDir(name);
  try {
    await lstat(dir);
    throw new Error(`Profile "${name}" already exists.`);
  } catch (e: any) {
    if (e.code !== "ENOENT") throw e;
  }
  await mkdir(dir, { recursive: true });
  await syncSharedFiles(dir);
}

/** Sync any new shared files from ~/.claude into an existing profile */
export async function syncProfile(name: string): Promise<void> {
  const dir = profileDir(name);
  try {
    const stat = await lstat(dir);
    // Old-style symlink profiles share everything already — skip
    if (stat.isSymbolicLink()) return;
  } catch {
    return;
  }
  await syncSharedFiles(dir);
}

export async function removeProfile(name: string): Promise<void> {
  const dir = profileDir(name);
  const stat = await lstat(dir);
  if (stat.isSymbolicLink()) {
    await rm(dir);
  } else {
    await rm(dir, { recursive: true });
  }
}
