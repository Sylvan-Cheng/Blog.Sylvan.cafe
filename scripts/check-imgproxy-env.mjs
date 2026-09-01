const { assertImgProxySigningConfig } = await import(
  "../src/utils/imgProxySigning.ts"
);

try {
  assertImgProxySigningConfig();
  console.log("[imgproxy] Signing configuration is valid.");
} catch (error) {
  console.error(`[imgproxy] ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
