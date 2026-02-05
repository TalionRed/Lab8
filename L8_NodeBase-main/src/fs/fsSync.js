const fs = require('fs');
const path = require('path');

// -------- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ --------

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

// -------- ОСНОВНЫЕ ФУНКЦИИ (СИНХРОННО) --------

function writeFileSyncCustom(filePath, content) {
  const fullPath = resolvePath(filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
}

function readFileSyncCustom(filePath) {
  const fullPath = resolvePath(filePath);
  return fs.readFileSync(fullPath, 'utf8');
}

function replaceFileContentSync(filePath, newContent) {
  const fullPath = resolvePath(filePath);
  fs.writeFileSync(fullPath, newContent, 'utf8');
}

function clearFileContentSync(filePath) {
  const fullPath = resolvePath(filePath);
  fs.writeFileSync(fullPath, '', 'utf8');
}

function removeNoiseFromFileSync(filePath) {
  const fullPath = resolvePath(filePath);
  const content = fs.readFileSync(fullPath, 'utf8');
  // Удаляем все цифры и приводим большие буквы к маленьким
  const withoutDigits = content.replace(/[0-9]/g, '');
  const normalized = withoutDigits.toLowerCase();
  fs.writeFileSync(fullPath, normalized, 'utf8');
}

function copyFileSyncCustom(sourcePath, targetPath) {
  const fullSource = resolvePath(sourcePath);
  const fullTarget = resolvePath(targetPath);
  fs.mkdirSync(path.dirname(fullTarget), { recursive: true });
  fs.copyFileSync(fullSource, fullTarget);
}

function createDirSyncCustom(dirPath) {
  const fullPath = resolvePath(dirPath);
  fs.mkdirSync(fullPath, { recursive: true });
}

function removeDirSyncCustom(dirPath) {
  const fullPath = resolvePath(dirPath);
  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
  }
}

function listProjectFilesSync(startDir = PROJECT_ROOT) {
  const result = [];

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      if (isService(entry.name)) continue;

      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else {
        result.push(fullPath);
      }
    }
  }

  walk(startDir);
  return result;
}

function cleanProjectSync(startDir = PROJECT_ROOT) {
  const entries = fs.readdirSync(startDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(startDir, entry.name);

    if (isService(entry.name)) {
      continue;
    }

    if (entry.isDirectory()) {
      fs.rmSync(fullPath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(fullPath);
    }
  }
}

module.exports = {
  writeFileSyncCustom,
  readFileSyncCustom,
  replaceFileContentSync,
  clearFileContentSync,
  removeNoiseFromFileSync,
  copyFileSyncCustom,
  createDirSyncCustom,
  removeDirSyncCustom,
  listProjectFilesSync,
  cleanProjectSync,
};

