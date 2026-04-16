import { homedir } from "node:os";
import { join } from "node:path";

export const HOME = homedir();
export const CLAUDE_DIR = join(HOME, ".claude");
export const CONFIG_DIR = join(HOME, ".config", "ccprofile");
export const PROFILES_DIR = join(CONFIG_DIR, "profiles");

/** Files that store login session data — kept per-profile, not shared */
export const SESSION_FILES = new Set(["credentials.json", ".credentials"]);
