const fs = require('fs');
const path = require('path');

const pkgPath = path.join(__dirname, './frontend/node_modules/react-icons/lu/index.d.ts');
if (fs.existsSync(pkgPath)) {
    const content = fs.readFileSync(pkgPath, 'utf8');
    const matches = content.match(/LuCheckCircle|LuCircleCheck/g);
    console.log('Matches found:', matches);
} else {
    console.log('Path not found:', pkgPath);
}
