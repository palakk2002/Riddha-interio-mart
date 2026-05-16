const fs = require('fs');
const path = require('path');

const routeFiles = [
  'frontend/src/modules/user/routes.jsx',
  'frontend/src/modules/admin/routes.jsx',
  'frontend/src/modules/seller/routes.jsx',
  'frontend/src/modules/delivery/routes.jsx'
];

routeFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', '..', '..', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace import X from './pages/X' with const X = React.lazy(() => import('./pages/X'))
    const importRegex = /import\s+([A-Za-z0-9_]+)\s+from\s+['"](\.\/?.*?pages\/.*?)['"]/g;
    
    // Only replace component imports, not React, Routes, Route
    content = content.replace(importRegex, (match, p1, p2) => {
      // Don't replace regular imports like layout wrappers if they're not pages, but usually they are components we want to lazy load
      // We know they are pages because they're from './pages/' or similar
      return `const ${p1} = React.lazy(() => import('${p2}'));`;
    });

    // Make sure React is imported with lazy
    if (!content.includes('React.lazy')) {
      // Not needed if we use React.lazy directly, but good to have
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
