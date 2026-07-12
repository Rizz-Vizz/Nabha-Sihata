const fs = require('fs');
const path = require('path');
const stripComments = require('strip-comments');

const srcDir = path.join(__dirname, 'src');
const viteConfigPath = path.join(__dirname, 'vite.config.ts');
const readmePath = path.join(__dirname, 'README.md');
const attributionsPath = path.join(__dirname, 'src', 'Attributions.md');

// 1. Rename src/components/figma to src/components/ui (or just move the file)
const figmaDir = path.join(srcDir, 'components', 'figma');
const uiDir = path.join(srcDir, 'components', 'ui');
const fallbackOldPath = path.join(figmaDir, 'ImageWithFallback.tsx');
const fallbackNewPath = path.join(srcDir, 'components', 'ImageWithFallback.tsx');

if (fs.existsSync(fallbackOldPath)) {
    fs.renameSync(fallbackOldPath, fallbackNewPath);
    console.log('Moved ImageWithFallback.tsx');
}
if (fs.existsSync(figmaDir)) {
    fs.rmdirSync(figmaDir);
    console.log('Removed figma directory');
}

// 2. Process files
function walkFiles(dir, callback) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkFiles(fullPath, callback);
        } else {
            callback(fullPath);
        }
    }
}

function processFile(filePath) {
    if (!['.js', '.jsx', '.ts', '.tsx', '.css', '.md'].includes(path.extname(filePath))) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Remove figma from imports
    content = content.replace(/import (.*?) from ['"]figma:asset\/(.*?)['"];/g, "import $1 from '@/assets/$2';");
    content = content.replace(/import \{ (.*?) \} from ['"]\.\/figma\/ImageWithFallback['"];/g, "import { $1 } from './ImageWithFallback';");
    content = content.replace(/Figma Make/gi, 'Make');
    content = content.replace(/Figma/gi, '');

    // Strip comments for code files
    if (['.js', '.jsx', '.ts', '.tsx'].includes(path.extname(filePath))) {
        try {
            content = stripComments(content);
        } catch (e) {
            console.error('Error stripping comments from', filePath, e);
        }
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log('Updated', filePath);
    }
}

walkFiles(srcDir, processFile);
if (fs.existsSync(viteConfigPath)) {
    let viteContent = fs.readFileSync(viteConfigPath, 'utf8');
    // Remove figma asset lines
    const lines = viteContent.split('\n');
    const newLines = lines.filter(line => !line.includes('figma:asset'));
    fs.writeFileSync(viteConfigPath, newLines.join('\n'));
    console.log('Updated vite.config.ts');
}

console.log('Done.');
