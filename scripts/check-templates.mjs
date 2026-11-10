import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const source = path.join(root, 'src');
function filesIn(directory) {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap(entry => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? filesIn(target) : [target];
  });
}
const files = filesIn(source);
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const relative = path.relative(root, file);
  if (file.endsWith('.wxml')) {
    for (const expression of content.matchAll(/\{\{([\s\S]*?)\}\}/g)) {
      if (/&(?:amp|lt|gt|quot|apos);/.test(expression[1])) {
        throw new Error(`${relative}: WXML 表达式必须使用原始运算符，不能使用 HTML 实体转义`);
      }
    }
  }
  if (file.endsWith('.wxss')) {
    for (const rule of content.matchAll(/(?:^|})([^{}]+)\{/g)) {
      if (rule[1].includes('*')) {
        throw new Error(`${relative}: WXSS 不能使用通配符选择器，请指定组件名称或 class`);
      }
    }
  }
}
const nativeDirectory = '/Applications/wechatwebdevtools.app/Contents/Resources/app.asar.unpacked/node_modules/wcc-exec';
if (fs.existsSync(path.join(nativeDirectory, 'wcc')) && fs.existsSync(path.join(nativeDirectory, 'wcsc'))) {
  for (const [compiler, extension] of [['wcc', '.wxml'], ['wcsc', '.wxss']]) {
    const targets = files.filter(file => file.endsWith(extension)).map(file => path.relative(source, file));
    const result = spawnSync(path.join(nativeDirectory, compiler), targets, {cwd: source, encoding: 'utf8'});
    if (result.error || result.status !== 0) {
      throw new Error(`${compiler} 编译失败：${result.error?.message || result.stderr || result.stdout}`);
    }
    console.log(`${compiler}: ${targets.length} 个模板/样式文件编译通过`);
  }
} else if (process.argv.includes('--native')) {
  throw new Error('未找到微信开发者工具原生编译器，请在安装工具的 macOS 上执行');
} else {
  console.log('WXML/WXSS 静态检查通过；本机未安装微信原生编译器，仍需开发者工具验收');
}
