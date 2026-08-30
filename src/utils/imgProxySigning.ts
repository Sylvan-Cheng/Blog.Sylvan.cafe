import { createHmac } from "node:crypto";

const IMGPROXY_HOST = "https://img.sylvan.cafe";
const UNSAFE_PREFIX = `${IMGPROXY_HOST}/unsafe/`;
const SIGNATURE_SIZE = 12;

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

/** Build an imgproxy URL; local builds retain unsafe URLs until CI secrets exist. */
export function buildImgProxyUrl(path: string): string {
  const material = getSigningMaterial();
  if (!material) return `${UNSAFE_PREFIX}${path}`;

  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const signature = createHmac("sha256", material.key)
    .update(Buffer.concat([material.salt, Buffer.from(canonicalPath, "utf8")]))
    .digest()
    .subarray(0, SIGNATURE_SIZE)
    .toString("base64url");

  return `${IMGPROXY_HOST}/${signature}/${path}`;
}
