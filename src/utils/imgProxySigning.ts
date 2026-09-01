import { createHmac } from "node:crypto";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const IMGPROXY_HOST = "https://img.sylvan.cafe";
const SIGNATURE_SIZE = 12;

function loadLocalEnvironment(): void {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;

  const loadEnvFile = (
    process as unknown as {
      loadEnvFile?: (path: string) => void;
    }
  ).loadEnvFile;
  if (!loadEnvFile) {
    throw new Error("Node.js 20.12 or newer is required to load .env.local.");
  }

  // Existing process variables win, so CI-provided secrets stay authoritative.
  loadEnvFile(envPath);
}

loadLocalEnvironment();

function getSigningMaterial() {
  const key = process.env.IMGPROXY_KEY?.trim() ?? "";
  const salt = process.env.IMGPROXY_SALT?.trim() ?? "";

  if (!/^[0-9a-f]{64}$/i.test(key) || !/^[0-9a-f]{64}$/i.test(salt)) {
    return null;
  }

  return {
    key: Buffer.from(key, "hex"),
    salt: Buffer.from(salt, "hex"),
  };
}

const INVALID_SIGNING_MATERIAL =
  "IMGPROXY_KEY and IMGPROXY_SALT are required and must be 64-character hexadecimal values.";

function requireSigningMaterial() {
  const material = getSigningMaterial();
  if (!material) throw new Error(INVALID_SIGNING_MATERIAL);
  return material;
}

export function assertImgProxySigningConfig(): void {
  requireSigningMaterial();
}

/** Build an imgproxy URL; every environment must provide signing material. */
export function buildImgProxyUrl(path: string): string {
  const material = requireSigningMaterial();
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;

  const signature = createHmac("sha256", material.key)
    .update(Buffer.concat([material.salt, Buffer.from(canonicalPath, "utf8")]))
    .digest()
    .subarray(0, SIGNATURE_SIZE)
    .toString("base64url");

  return `${IMGPROXY_HOST}/${signature}${canonicalPath}`;
}
