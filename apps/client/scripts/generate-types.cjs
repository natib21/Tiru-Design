const { execSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

const rootDir = path.resolve(__dirname, '..');
const localSchemaPath = path.resolve(rootDir, 'src/shared/api/openapi.json');
const outputPath = path.resolve(rootDir, 'src/shared/api/schema.d.ts');
const apiUrl = process.env.VITE_API_URL;

let targetSource = localSchemaPath;

if (apiUrl) {
  const remoteUrl = `${apiUrl.replace(/\/$/, '')}/api/docs-json`;
  try {
    // Check if remote URL is reachable
    execSync(`curl -s -f ${remoteUrl}`, { stdio: 'ignore' });
    targetSource = remoteUrl;
    console.log(`Generating types from remote OpenAPI docs: ${remoteUrl}`);
  } catch {
    console.log(`Remote API not reachable, falling back to local openapi.json: ${localSchemaPath}`);
  }
} else {
  console.log(`Using local openapi.json: ${localSchemaPath}`);
}

execSync(`npx openapi-typescript "${targetSource}" -o "${outputPath}"`, {
  stdio: 'inherit',
  cwd: rootDir,
});
console.log(`Successfully generated ${outputPath}`);
