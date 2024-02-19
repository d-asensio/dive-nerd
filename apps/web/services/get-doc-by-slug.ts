import path from 'path';
import fs from 'fs';

export function getDocBySlug(slug: string, locale = 'us') {
  const docsDirectory = path.join(process.cwd(), 'posts');
  console.log(process.cwd())
  console.log(docsDirectory)
  const fullPath = path.join(docsDirectory, `${slug}.${locale}.mdx`);

  if(!fs.existsSync(fullPath)) return null

  return fs.readFileSync(fullPath, 'utf8');
}
