const { execSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

const rootDir = path.resolve(__dirname, '..');
const localSchemaPath = path.resolve(rootDir, 'src/shared/api/openapi.json');
const outputPath = path.resolve(rootDir, 'src/shared/api/schema.d.ts');
const apiUrl = process.env.VITE_API_URL;

function sanitizeOpenApiSpec(specObj) {
  if (!specObj || typeof specObj !== 'object' || !specObj.paths) {
    return specObj;
  }
  const cleanPaths = {};
  for (const [pathKey, pathValue] of Object.entries(specObj.paths)) {
    // Explicitly filter out test routes (e.g. /test/*)
    if (!pathKey.startsWith('/test/') && !pathKey.includes('/test/')) {
      cleanPaths[pathKey] = pathValue;
    }
  }
  specObj.paths = cleanPaths;
  return specObj;
}

let targetSource = localSchemaPath;

if (apiUrl && !apiUrl.includes('your-domain.com')) {
  const remoteUrl = `${apiUrl.replace(/\/$/, '')}/api/docs-json`;
  try {
    const check = execSync(`curl -s -f -H "Accept: application/json" "${remoteUrl}"`, {
      encoding: 'utf8',
      timeout: 3000,
    });
    const parsed = JSON.parse(check);
    if (parsed.openapi || parsed.swagger) {
      const sanitized = sanitizeOpenApiSpec(parsed);
      fs.writeFileSync(localSchemaPath, JSON.stringify(sanitized, null, 2) + '\n', 'utf8');
      console.log(`Fetched and sanitized remote OpenAPI docs from: ${remoteUrl}`);
    } else {
      console.log(
        `Remote API returned non-OpenAPI response, falling back to local openapi.json: ${localSchemaPath}`
      );
    }
  } catch {
    console.log(
      `Remote API not reachable or invalid JSON, falling back to local openapi.json: ${localSchemaPath}`
    );
  }
} else {
  console.log(`Using local openapi.json: ${localSchemaPath}`);
}

// Always ensure local openapi.json is clean of /test/ routes
if (fs.existsSync(localSchemaPath)) {
  const raw = fs.readFileSync(localSchemaPath, 'utf8');
  const parsed = JSON.parse(raw);
  const sanitized = sanitizeOpenApiSpec(parsed);
  fs.writeFileSync(localSchemaPath, JSON.stringify(sanitized, null, 2) + '\n', 'utf8');
}

// Guard check
const checkRaw = fs.readFileSync(localSchemaPath, 'utf8');
if (checkRaw.includes('"/test/')) {
  throw new Error('GUARD FAILED: openapi.json contains /test/ routes!');
}

const openapiBin = path.resolve(rootDir, 'node_modules/.bin/openapi-typescript');
const cmd = fs.existsSync(openapiBin)
  ? `"${openapiBin}" "${localSchemaPath}" -o "${outputPath}"`
  : `npx openapi-typescript "${localSchemaPath}" -o "${outputPath}"`;

execSync(cmd, {
  stdio: 'inherit',
  cwd: rootDir,
});
console.log(`Successfully generated ${outputPath}`);
