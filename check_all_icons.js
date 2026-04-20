const fs = require('fs');
const path = require('path');

const iconsToCheck = [
    'LuTruck', 'LuUser', 'LuPackage', 'LuSearch', 'LuChevronRight', 
    'LuClock', 'LuCheckCircle', 'LuCircleCheck', 'LuInfo', 'LuMapPin', 
    'LuPhone', 'LuBriefcase', 'LuAlertCircle', 'LuCircleAlert'
];

const pkgPath = path.join(__dirname, './frontend/node_modules/react-icons/lu/index.d.ts');
if (fs.existsSync(pkgPath)) {
    const content = fs.readFileSync(pkgPath, 'utf8');
    const results = {};
    iconsToCheck.forEach(icon => {
        results[icon] = content.includes(`export declare const ${icon}:`);
    });
    console.log(JSON.stringify(results, null, 2));
} else {
    console.log('Path not found:', pkgPath);
}
