import { validateName, ensureProfilesDir, createProfile } from "../lib/profile";
import { error, success } from "../lib/ui";

export async function create(name: string | undefined) {
  if (!name) error("Usage: ccp create <name>");
  validateName(name);
  await ensureProfilesDir();
  try {
    await createProfile(name);
  } catch (e: any) {
    error(e.message);
  }
  success(`Profile "${name}" created.`);
}
