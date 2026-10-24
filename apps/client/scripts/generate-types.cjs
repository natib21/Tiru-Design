const { execSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

const rootDir = path.resolve(__dirname, '..');
const localSchemaPath = path.resolve(rootDir, 'src/shared/api/openapi.json');
const outputPath = path.resolve(rootDir, 'src/shared/api/schema.d.ts');
const apiUrl = process.env.VITE_API_URL;

let targetSource = localSchemaPath;

if (apiUrl && !apiUrl.includes('your-domain.com')) {
  const remoteUrl = `${apiUrl.replace(/\/$/, '')}/api/docs-json`;
  try {
    const check = execSync(`curl -s -f -H "Accept: application/json" "${remoteUrl}"`, { encoding: 'utf8', timeout: 3000 });
    const parsed = JSON.parse(check);
    if (parsed.openapi || parsed.swagger) {
      targetSource = remoteUrl;
      console.log(`Generating types from remote OpenAPI docs: ${remoteUrl}`);
    } else {
      console.log(`Remote API returned non-OpenAPI response, falling back to local openapi.json: ${localSchemaPath}`);
    }
  } catch {
    console.log(`Remote API not reachable or invalid JSON, falling back to local openapi.json: ${localSchemaPath}`);
  }
} else {
  console.log(`Using local openapi.json: ${localSchemaPath}`);
}

const openapiBin = path.resolve(rootDir, 'node_modules/.bin/openapi-typescript');
const cmd = fs.existsSync(openapiBin)
  ? `"${openapiBin}" "${targetSource}" -o "${outputPath}"`
  : `npx openapi-typescript "${targetSource}" -o "${outputPath}"`;

execSync(cmd, {
  stdio: 'inherit',
  cwd: rootDir,
});
console.log(`Successfully generated ${outputPath}`);

