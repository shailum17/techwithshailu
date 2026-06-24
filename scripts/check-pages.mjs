import http from 'http';

const pages = [
  'resources',
  'blog',
  'admin',
  'resources/frontend',
  'resources/dsa',
  'resources/backend',
  'blog/goldman-sachs-off-campus-2026',
  'blog/best-ai-tools-for-students-2026',
];

let done = 0;
for (const page of pages) {
  http.get(`http://localhost:3000/${page}`, (res) => {
    console.log(`${res.statusCode}  /${page}`);
    if (++done === pages.length) process.exit(0);
  }).on('error', (e) => {
    console.log(`ERR  /${page}  ${e.message}`);
    if (++done === pages.length) process.exit(0);
  });
}
