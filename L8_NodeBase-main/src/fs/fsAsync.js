const fs = require('fs').promises;
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

const SERVICE_NAMES = new Set([
  'node_modules',
  '.git',
  '.gitignore',
  'package-lock.json',
  'package.json',
  '.env',
  '.env.development',
  '.env.production',
  '.env.domain',
  '.cursor',
]);

function isService(name) {
  return SERVICE_NAMES.has(name);
}

function resolvePath(relativeOrAbsolutePath) {
  if (path.isAbsolute(relativeOrAbsolutePath)) {
    return relativeOrAbsolutePath;
  }
  return path.join(PROJECT_ROOT, relativeOrAbsolutePath);
}

async function writeFileAsyncCustom(filePath, content) {
  const fullPath = resolvePath(filePath);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, content, 'utf8');
}

async function readFileAsyncCustom(filePath) {
  const fullPath = resolvePath(filePath);
  return fs.readFile(fullPath, 'utf8');
}

async function replaceFileContentAsync(filePath, newContent) {
  const fullPath = resolvePath(filePath);
  await fs.writeFile(fullPath, newContent, 'utf8');
}

async function clearFileContentAsync(filePath) {
  const fullPath = resolvePath(filePath);
  await fs.writeFile(fullPath, '', 'utf8');
}

async function removeNoiseFromFileAsync(filePath) {
  const fullPath = resolvePath(filePath);
  const content = await fs.readFile(fullPath, 'utf8');
  const withoutDigits = content.replace(/[0-9]/g, '');
  const normalized = withoutDigits.toLowerCase();
  await fs.writeFile(fullPath, normalized, 'utf8');
}

async function copyFileAsyncCustom(sourcePath, targetPath) {
  const fullSource = resolvePath(sourcePath);
  const fullTarget = resolvePath(targetPath);
  await fs.mkdir(path.dirname(fullTarget), { recursive: true });
  // fs.promises.copyFile доступен в Node.js
  await fs.copyFile(fullSource, fullTarget);
}

async function createDirAsyncCustom(dirPath) {
  const fullPath = resolvePath(dirPath);
  await fs.mkdir(fullPath, { recursive: true });
}

async function removeDirAsyncCustom(dirPath) {
  const fullPath = resolvePath(dirPath);
  try {
    await fs.rm(fullPath, { recursive: true, force: true });
  } catch (e) {
    // игнорируем ошибки при удалении
  }
}

async function listProjectFilesAsync(startDir = PROJECT_ROOT) {
  const result = [];

  async function walk(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      if (isService(entry.name)) continue;

      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else {
        result.push(fullPath);
      }
    }
  }

  await walk(startDir);
  return result;
}

async function cleanProjectAsync(startDir = PROJECT_ROOT) {
  const entries = await fs.readdir(startDir, { withFileTypes: true });

  for (const entry of entries) {
    if (isService(entry.name)) continue;
    const fullPath = path.join(startDir, entry.name);

    if (entry.isDirectory()) {
      await fs.rm(fullPath, { recursive: true, force: true });
    } else {
      await fs.unlink(fullPath);
    }
  }
}

module.exports = {
  writeFileAsyncCustom,
  readFileAsyncCustom,
  replaceFileContentAsync,
  clearFileContentAsync,
  removeNoiseFromFileAsync,
  copyFileAsyncCustom,
  createDirAsyncCustom,
  removeDirAsyncCustom,
  listProjectFilesAsync,
  cleanProjectAsync,
};

