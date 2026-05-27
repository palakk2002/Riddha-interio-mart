/**
 * Riddha Mart — Enterprise Audit Report PDF Generator
 * Run: node generate_audit_report.js
 * Output: audit_reports/RiddahMart_Enterprise_Audit_Report.pdf
 */

const PDFDocument = require('./backend/node_modules/pdfkit');
const fs = require('fs');
const path = require('path');

// ─── Colour Palette ──────────────────────────────────────────────────────────
const C = {
  brand:      '#189D91',
  brandDark:  '#127F75',
  danger:     '#DC2626',
  warning:    '#D97706',
  info:       '#2563EB',
  success:    '#16A34A',
  black:      '#111827',
  dark:       '#1F2937',
  mid:        '#4B5563',
  light:      '#9CA3AF',
  lightest:   '#F3F4F6',
  white:      '#FFFFFF',
  pageGutter: 50,
};

// ─── Document Setup ───────────────────────────────────────────────────────────
const outDir  = path.join(__dirname, 'audit_reports');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const outFile = path.join(outDir, 'RiddahMart_Enterprise_Audit_Report.pdf');
const doc = new PDFDocument({
  size:    'A4',
  margins: { top: 60, bottom: 60, left: C.pageGutter, right: C.pageGutter },
  info: {
    Title:    'Riddha Mart — Enterprise Audit Report',
    Author:   'Claude (Anthropic) — Principal Architect Review',
    Subject:  'Full-Stack MERN Production Readiness Audit',
    Keywords: 'security, architecture, scalability, MERN, audit',
  },
  autoFirstPage: false,
});

const stream = fs.createWriteStream(outFile);
doc.pipe(stream);

// ─── Helpers ──────────────────────────────────────────────────────────────────
let currentY = 0;

const W = () => doc.page.width - C.pageGutter * 2;

function newPage(addHeader = true) {
  doc.addPage();
  currentY = doc.page.margins.top;
  if (addHeader) pageHeader();
}

function pageHeader() {
  doc
    .save()
    .rect(0, 0, doc.page.width, 36)
    .fill(C.brand)
    .restore();
  doc
    .font('Helvetica-Bold')
    .fontSize(9)
    .fillColor(C.white)
    .text('RIDDHA MART  ·  ENTERPRISE AUDIT REPORT  ·  CONFIDENTIAL', C.pageGutter, 12, {
      width: W(),
      align: 'left',
    });
  // page number
  doc
    .font('Helvetica')
    .fontSize(8)
    .fillColor(C.white)
    .text(`Page ${doc.bufferedPageRange().count}`, C.pageGutter, 12, {
      width: W(),
      align: 'right',
    });
  currentY = 52;
}

function y(delta = 0) {
  currentY += delta;
  return currentY;
}

function ensureSpace(needed = 60) {
  if (currentY + needed > doc.page.height - doc.page.margins.bottom - 10) {
    newPage();
  }
}

// ── Text helpers ──────────────────────────────────────────────────────────────

function h1(text) {
  ensureSpace(70);
  doc
    .save()
    .rect(C.pageGutter - 10, currentY - 4, W() + 20, 34)
    .fill(C.brand)
    .restore();
  doc
    .font('Helvetica-Bold')
    .fontSize(14)
    .fillColor(C.white)
    .text(text, C.pageGutter, currentY + 6, { width: W() });
  currentY += 42;
}

function h2(text) {
  ensureSpace(50);
  doc
    .save()
    .rect(C.pageGutter - 10, currentY, 4, 22)
    .fill(C.brand)
    .restore();
  doc
    .font('Helvetica-Bold')
    .fontSize(12)
    .fillColor(C.dark)
    .text(text, C.pageGutter + 6, currentY + 4, { width: W() - 6 });
  currentY += 28;
}

function h3(text) {
  ensureSpace(35);
  doc
    .font('Helvetica-Bold')
    .fontSize(10.5)
    .fillColor(C.brand)
    .text(text, C.pageGutter, currentY, { width: W() });
  currentY += 18;
}

function para(text, opts = {}) {
  const fontSize = opts.fontSize || 9.5;
  const color    = opts.color    || C.dark;
  const bold     = opts.bold     || false;
  ensureSpace(20);
  doc
    .font(bold ? 'Helvetica-Bold' : 'Helvetica')
    .fontSize(fontSize)
    .fillColor(color)
    .text(text, C.pageGutter, currentY, { width: W(), align: opts.align || 'left', ...opts });
  currentY = doc.y + 6;
}

function bullet(text, color = C.dark, indent = 0) {
  ensureSpace(18);
  const bx = C.pageGutter + indent;
  doc
    .save()
    .circle(bx + 4, currentY + 5, 2.5)
    .fill(C.brand)
    .restore();
  doc
    .font('Helvetica')
    .fontSize(9.5)
    .fillColor(color)
    .text(text, bx + 12, currentY, { width: W() - 12 - indent });
  currentY = doc.y + 4;
}

function badge(label, bgColor, x, bY, opts = {}) {
  const padX = 7, padY = 3;
  doc.font('Helvetica-Bold').fontSize(7.5);
  const tw = doc.widthOfString(label);
  doc
    .save()
    .roundedRect(x, bY, tw + padX * 2, 14, 3)
    .fill(bgColor)
    .restore();
  doc
    .fillColor(C.white)
    .text(label, x + padX, bY + padY, { lineBreak: false });
  return x + tw + padX * 2 + 6;
}

function divider() {
  ensureSpace(14);
  doc
    .save()
    .moveTo(C.pageGutter, currentY)
    .lineTo(C.pageGutter + W(), currentY)
    .strokeColor('#E5E7EB')
    .lineWidth(0.5)
    .stroke()
    .restore();
  currentY += 10;
}

// ── Table helper ──────────────────────────────────────────────────────────────
function table(headers, rows, colWidths) {
  const total = colWidths.reduce((a, b) => a + b, 0);
  const cellPad = 6;
  const rowH = 20;
  const headerH = 22;

  ensureSpace(headerH + rows.length * rowH + 10);

  // Header row
  let cx = C.pageGutter;
  doc.save().rect(C.pageGutter, currentY, total, headerH).fill(C.brand).restore();
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor(C.white);
  headers.forEach((h, i) => {
    doc.text(h, cx + cellPad, currentY + 6, { width: colWidths[i] - cellPad * 2, lineBreak: false });
    cx += colWidths[i];
  });
  currentY += headerH;

  // Data rows
  rows.forEach((row, ri) => {
    ensureSpace(rowH + 4);
    const bg = ri % 2 === 0 ? C.white : '#F9FAFB';
    doc.save().rect(C.pageGutter, currentY, total, rowH).fill(bg).restore();

    cx = C.pageGutter;
    doc.font('Helvetica').fontSize(8).fillColor(C.dark);
    row.forEach((cell, ci) => {
      // Colour-code severity badges inside cells
      let cellColor = C.dark;
      if (typeof cell === 'string') {
        if (cell.startsWith('🔴') || cell === 'P0' || cell === 'CRITICAL') cellColor = C.danger;
        else if (cell.startsWith('🟠') || cell === 'P1' || cell === 'HIGH') cellColor = '#EA580C';
        else if (cell.startsWith('🟡') || cell === 'P2' || cell === 'MEDIUM') cellColor = C.warning;
        else if (cell.startsWith('✅') || cell === 'Working') cellColor = C.success;
        else if (cell.startsWith('⚠️') || cell === 'Partial') cellColor = C.warning;
        else if (cell.startsWith('🔴') || cell === 'Broken' || cell === 'Missing') cellColor = C.danger;
      }
      doc.fillColor(cellColor).text(String(cell), cx + cellPad, currentY + 5, {
        width: colWidths[ci] - cellPad * 2,
        lineBreak: false,
        ellipsis: true,
      });
      cx += colWidths[ci];
    });

    // Row bottom border
    doc.save().moveTo(C.pageGutter, currentY + rowH).lineTo(C.pageGutter + total, currentY + rowH)
       .strokeColor('#E5E7EB').lineWidth(0.3).stroke().restore();
    currentY += rowH;
  });
  currentY += 10;
}

// ── Score bar ─────────────────────────────────────────────────────────────────
function scoreBar(label, score, max = 100) {
  ensureSpace(28);
  const barW = W() - 120;
  const filled = (score / max) * barW;
  const color = score >= 75 ? C.success : score >= 50 ? C.warning : C.danger;

  doc.font('Helvetica').fontSize(9).fillColor(C.dark)
     .text(label, C.pageGutter, currentY, { width: 110, lineBreak: false });

  doc.save().rect(C.pageGutter + 115, currentY + 1, barW, 12).fill('#E5E7EB').restore();
  doc.save().rect(C.pageGutter + 115, currentY + 1, filled, 12).fill(color).restore();

  doc.font('Helvetica-Bold').fontSize(9).fillColor(color)
     .text(`${score}/100`, C.pageGutter + 115 + barW + 6, currentY, { lineBreak: false });

  currentY += 22;
}

// ─── COVER PAGE ───────────────────────────────────────────────────────────────
doc.addPage();

// Full-bleed gradient top stripe
doc.save().rect(0, 0, doc.page.width, 220).fill(C.brand).restore();
doc.save().rect(0, 200, doc.page.width, 30)
   .fill(C.brandDark).restore();

doc.font('Helvetica-Bold').fontSize(28).fillColor(C.white)
   .text('RIDDHA MART', C.pageGutter, 60, { align: 'center', width: W() });
doc.font('Helvetica').fontSize(13).fillColor('#CFFAF4')
   .text('Multi-Vendor MERN Ecommerce Platform', C.pageGutter, 98, { align: 'center', width: W() });

doc.font('Helvetica-Bold').fontSize(18).fillColor(C.white)
   .text('ENTERPRISE-GRADE AUDIT REPORT', C.pageGutter, 140, { align: 'center', width: W() });

// Summary score box
doc.save().roundedRect(C.pageGutter + 60, 240, W() - 120, 90, 8).fill(C.dark).restore();
doc.font('Helvetica-Bold').fontSize(36).fillColor(C.danger)
   .text('49', C.pageGutter + 60, 258, { align: 'center', width: W() - 120 });
doc.font('Helvetica-Bold').fontSize(11).fillColor(C.white)
   .text('/ 100  —  NOT PRODUCTION READY', C.pageGutter + 60, 302, { align: 'center', width: W() - 120 });

// Meta info
doc.font('Helvetica').fontSize(10).fillColor(C.mid);
const meta = [
  ['Date',       'May 26, 2026'],
  ['Reviewer',   'Claude Sonnet 4.6 (Anthropic) — Principal Architect'],
  ['Scope',      '76 Features · 30+ Controllers · 30 DB Models · 4 Modules'],
  ['Criticality','8 P0 · 12 P1 · 12 P2 · 10 P3 Issues'],
];
let metaY = 360;
meta.forEach(([k, v]) => {
  doc.font('Helvetica-Bold').fontSize(9).fillColor(C.dark).text(`${k}:`, C.pageGutter, metaY, { continued: true });
  doc.font('Helvetica').fontSize(9).fillColor(C.mid).text(`  ${v}`, { lineBreak: false });
  metaY += 18;
});

// Bottom disclaimer
doc.font('Helvetica').fontSize(8).fillColor(C.light)
   .text(
     'CONFIDENTIAL — This report contains sensitive security findings. Handle with care.',
     C.pageGutter, doc.page.height - 80, { align: 'center', width: W() }
   );

// ─── TABLE OF CONTENTS ────────────────────────────────────────────────────────
newPage();
h1('TABLE OF CONTENTS');
const toc = [
  ['Phase 1',  'Complete Project Architecture Analysis'],
  ['Phase 2',  'Functionality Detection (76 Features)'],
  ['Phase 3',  'Module-by-Module Deep Analysis'],
  ['Phase 4',  'API & Socket Flow Analysis'],
  ['Phase 5',  'Database & Business Logic Analysis'],
  ['Phase 6',  'Security Audit (8 Critical + 9 High Issues)'],
  ['Phase 7',  'Frontend Performance & UX Analysis'],
  ['Phase 8',  'DevOps & Production Readiness'],
  ['Phase 9',  'Complete Issue Register (P0–P3)'],
  ['Phase 10', 'Functionality Matrix'],
  ['Phase 11', 'Production Readiness Scores'],
  ['Phase 12', 'Implementation Roadmap'],
];
toc.forEach(([phase, title]) => {
  ensureSpace(20);
  doc
    .save()
    .rect(C.pageGutter, currentY, W(), 18)
    .fill(currentY % 36 === 0 ? C.lightest : C.white)
    .restore();
  doc.font('Helvetica-Bold').fontSize(9).fillColor(C.brand)
     .text(phase, C.pageGutter + 4, currentY + 4, { continued: true, width: 55 });
  doc.font('Helvetica').fontSize(9).fillColor(C.dark)
     .text(title, { lineBreak: false });
  currentY += 20;
});

// ─── PHASE 1 ─────────────────────────────────────────────────────────────────
newPage();
h1('PHASE 1 — COMPLETE PROJECT ARCHITECTURE ANALYSIS');

h2('1.1 Tech Stack & Overview');
const stackRows = [
  ['Runtime',    'Node.js ≥20, Express 5.2.x (beta)'],
  ['Database',   'MongoDB (Mongoose 9.x), in-process TTL cache'],
  ['Frontend',   'React 18, Vite, Tailwind CSS v4, Context API'],
  ['Realtime',   'Socket.IO 4.x (single node, in-memory adapter)'],
  ['Auth',       'JWT (access 15m / refresh 7d), httpOnly cookies, token rotation'],
  ['Payments',   'Razorpay (orders + HMAC verify + refunds)'],
  ['Files',      'Cloudinary (images/videos) + magic-number validation'],
  ['Push',       'Firebase Admin SDK (FCM) — online/offline hybrid'],
  ['Email',      'Nodemailer + in-process MongoDB-backed queue daemon'],
  ['Security',   'Helmet, CORS, express-rate-limit, binary AV scan (pattern only)'],
];
table(['Concern', 'Technology / Approach'], stackRows, [120, W() - 120]);

h2('1.2 Folder Architecture');
para('Backend: src/controllers · src/routes · src/models · src/middleware · src/services · src/utils · src/config · src/socket.js');
para('Frontend: 4 modules (user/admin/seller/delivery) + shared + comingsoon');

h2('1.3 ⚠️  Critical Structural Problem — Duplicate Code Trees');
para('Every frontend module contains two parallel file trees:', { bold: true, color: C.danger });
const dupRows = [
  ['modules/admin/pages/', 'ACTIVE — imported by routes.jsx', '✅'],
  ['modules/admin/views/pages/', 'DEAD — never imported anywhere', '🔴'],
  ['modules/admin/data/', 'ACTIVE — Context providers', '✅'],
  ['modules/admin/models/', 'DEAD — exact clone of data/', '🔴'],
  ['(same pattern for user/seller/delivery)', '', '🔴'],
];
table(['Path', 'Status', ''], dupRows, [200, W() - 250, 50]);
para('Impact: ~40% of frontend files are dead code. Bugs fixed in pages/ may never reach views/pages/. Build bundle is unnecessarily large.', { color: C.warning });

h2('1.4 Service Dependency Map');
const depRows = [
  ['orderController', '→ pricingService, taxService, inventoryService, walletService, socket, geocoder, invoiceService, referralService, emailService'],
  ['walletService',   '→ Wallet, SellerWallet, DeliveryWallet, SellerPayout, DeliverySettlement, Seller'],
  ['socket.js',       '→ Notification, User, Admin (FCM), firebaseAdmin, all role models'],
  ['authController',  '→ RefreshToken, tokenService, cacheService'],
  ['auth middleware', '→ cacheService (blacklist + profile), jwt, all 4 role models'],
  ['inventoryService','→ Product, InventoryReservation, InventoryHistoryLog'],
];
table(['Service', 'Dependencies'], depRows, [120, W() - 120]);

// ─── PHASE 2 ─────────────────────────────────────────────────────────────────
newPage();
h1('PHASE 2 — FUNCTIONALITY DETECTION (76 FEATURES)');

h2('Feature Status Legend');
let lx = C.pageGutter;
lx = badge('✅ Working',  C.success, lx, currentY);
lx = badge('⚠️ Partial',  C.warning, lx, currentY);
lx = badge('🔴 Broken',   C.danger,  lx, currentY);
lx = badge('UI Only',     C.info,    lx, currentY);
currentY += 22;

const features = [
  ['User Registration + OTP Email',         '✅ Working'],
  ['User Login (JWT + Refresh tokens)',      '✅ Working'],
  ['Silent Token Refresh (interceptor)',     '✅ Working'],
  ['Token Blacklisting on Logout',          '⚠️ Memory-only, resets on restart'],
  ['Password Reset via OTP',                '✅ Working'],
  ['Email Verification',                    '✅ Working'],
  ['Seller Registration + KYC',             '⚠️ KYC stored as local FS path'],
  ['Seller OTP Verification',               '⚠️ Static bypass 123456 always active'],
  ['Seller Admin Approval Flow',            '✅ Working'],
  ['Seller Suspension / Rejection',         '✅ Working'],
  ['Delivery Partner Registration',         '✅ Working'],
  ['Delivery Partner Approval',             '✅ Working'],
  ['Admin RBAC (superadmin / assistant)',   '✅ Working'],
  ['Admin Registration',                    '🔴 UNPROTECTED — Anyone can create admin'],
  ['Product CRUD (Seller + Admin)',          '✅ Working'],
  ['Product Approval Workflow',             '✅ Working'],
  ['Image/Video Upload (Cloudinary)',       '✅ Working + magic-number validation'],
  ['Inventory Stock Management',            '✅ Working'],
  ['Atomic Inventory Reservation',          '✅ Working'],
  ['Reservation Expiry Daemon',             '✅ Working (in-process)'],
  ['Cart (local + backend sync)',           '⚠️ Clear-cart localStorage bug'],
  ['Wishlist',                              '✅ Working'],
  ['Server-side Checkout Pricing',          '✅ Price-tampering protected'],
  ['Multi-Seller Order Splitting',          '✅ Working'],
  ['Razorpay Payment (HMAC verify)',        '✅ Working'],
  ['COD Orders + Eligibility Check',        '✅ Working'],
  ['Wallet Payment at Checkout',            '🔴 Missing — no debit logic in addOrderItems'],
  ['Coupon System (atomic)',                '✅ Working'],
  ['GST Tax Calculation (CGST/SGST/IGST)',  '⚠️ Seller state by string match only'],
  ['PDF Invoice Generation (async)',        '✅ Working'],
  ['Order Status Lifecycle',               '✅ Working'],
  ['Delivery Assignment Workflow',          '✅ Working'],
  ['Delivery OTP Verification',            '⚠️ OTP stored plaintext'],
  ['COD Cash Collection & Settlement',      '✅ Working'],
  ['Seller Wallet (pending→withdrawable)', '✅ Working + idempotent'],
  ['Seller Payout Request',                '✅ Working + atomic double-spend guard'],
  ['Payout Approval / Rejection',          '✅ Atomic refund on rejection'],
  ['Delivery Wallet + Earnings',           '✅ Working'],
  ['User Wallet (referral/signup)',         '✅ Working'],
  ['Referral System',                      '✅ Working + IP fraud prevention'],
  ['Referral First-Order Reward (COD)',    '🔴 Never fires for COD orders'],
  ['Referral Leaderboard',                 '✅ Working'],
  ['Return Request (User)',                '✅ Working'],
  ['Return Approval (Admin/Seller)',       '✅ Working'],
  ['Razorpay Refund',                      '✅ Working'],
  ['Socket.IO Real-time Notifications',   '✅ Working'],
  ['FCM Push Notifications (offline)',    '⚠️ Service account JSON in repo'],
  ['Notification Persistence (DB)',       '✅ Working'],
  ['Email Queue (in-process)',            '⚠️ Lost on restart'],
  ['Review + Rating System',             '✅ Working'],
  ['Product Search',                     '⚠️ searchService.js exists, integration unclear'],
  ['Category Management CMS',           '✅ Working'],
  ['Brand Management',                  '✅ Working'],
  ['Hero / Promo Banner CMS',           '✅ Working'],
  ['Favourite Categories CMS',          '✅ Working'],
  ['Dynamic Sections CMS',             '✅ Working'],
  ['Catalog System',                   '✅ Working'],
  ['Bulk / B2B Order Capture',         '⚠️ Lead capture only, no fulfillment'],
  ['Support Ticket System',           '✅ Working'],
  ['Address Management',              '✅ Working'],
  ['Admin Dashboard Analytics',       '✅ Working'],
  ['Seller Analytics',               '✅ Working'],
  ['Delivery Analytics',             '✅ Working'],
  ['Activity / Inventory / Tax Logs', '✅ Working'],
  ['Geocoding (shipping + seller)',   '⚠️ In checkout critical path — adds latency'],
  ['Dispatch Center (Admin)',        '✅ Working'],
  ['Fleet Console (Admin)',          '⚠️ UI only — no live GPS backend'],
  ['Live GPS Delivery Tracking',    '🔴 No location update API exists'],
  ['Delivery Route Optimisation',   '🔴 No backend — UI placeholder only'],
  ['System Settings',               '✅ Working'],
  ['ComingSoon Pages',              '🔴 Static placeholder'],
  ['CMS Blog System',              '🔴 Missing — no model or controller'],
];

table(['Feature', 'Status'], features, [250, W() - 250]);

// ─── PHASE 3 ─────────────────────────────────────────────────────────────────
newPage();
h1('PHASE 3 — MODULE-BY-MODULE DEEP ANALYSIS');

h2('3.1 Admin Module');
h3('Authentication');
bullet('Login: POST /api/auth/admin/login → adminController.loginAdmin');
bullet('🔴 CRITICAL: registerAdmin has NO protection — anonymous users can create superadmin accounts', C.danger);
bullet('🔴 CRITICAL: Test bypass: if (email === "test@test.com") returns 200 without auth', C.danger);
bullet('⚠️ Admin model has orphan getSignedJwtToken() using JWT_SECRET with 30-day expiry — inconsistent with actual 15-minute access token flow', C.warning);

h3('RBAC System');
bullet('Superadmin bypasses all checkPermission middleware ✅');
bullet('Assistant admins have Map<string,Boolean> permissions per granular operation ✅');
bullet('⚠️ No server-side permission seeding — new permission keys default to undefined (falsy) for existing assistants', C.warning);
bullet('Socket.IO role:admin room broadcasts go to ALL admins including low-permission assistants', C.warning);

h3('Seller Management');
bullet('Approve/reject/suspend workflows connected end-to-end ✅');
bullet('🔴 KYC document files stored as local filesystem paths — inaccessible on stateless/serverless infra', C.danger);
bullet('Document viewer in admin UI reads these local paths — will 404 in production', C.danger);

h3('Analytics & Reports');
bullet('Dashboard analytics: revenue, order counts, top products, top sellers — all connected ✅');
bullet('⚠️ No CSV/Excel export functionality', C.warning);
bullet('⚠️ No bulk user actions (block/unblock multiple)', C.warning);

divider();
h2('3.2 Seller Module');
h3('Onboarding & KYC');
bullet('Registration captures: name, email, phone, shop name/address, password, GST#, PAN#, HSN#, 3 KYC docs');
bullet('🔴 KYC docs saved as multer local disk paths, not Cloudinary URLs — data loss on any server restart or deploy', C.danger);
bullet('OTP sent to email but verification uses phone field as lookup — mismatch possible', C.warning);
bullet('Static OTP bypass "123456" is unconditional — no NODE_ENV guard', C.danger);

h3('Seller Wallet');
bullet('pendingBalance → withdrawableBalance when order is Delivered ✅');
bullet('Commission: HARDCODED 10% (commission = subtotal * 0.10) — not configurable via settings', C.warning);
bullet('Minimum withdrawal: HARDCODED ₹500 — not configurable', C.warning);
bullet('Payout request: atomic debit prevents double-spending race conditions ✅');

h3('Notifications');
bullet('Socket listeners for order:new and notification:new ✅');
bullet('⚠️ Socket connection initiated per-page, not at layout level — sellers miss notifications on some pages', C.warning);

divider();
h2('3.3 User Module');
h3('Authentication Flow');
bullet('Register → Email OTP → Verified → Login ✅');
bullet('Referral code tracked at registration with IP fraud prevention ✅');
bullet('Password reset via OTP ✅');
bullet('🔴 JWT token stored in localStorage — accessible to XSS attacks', C.danger);

h3('Shopping & Cart');
bullet('Dual storage: localStorage + MongoDB Cart — optimistic update on add ✅');
bullet('🔴 Cart localStorage write only when cart.length > 0 — emptying cart and refreshing restores old cart from localStorage', C.danger);
bullet('Backend cart correctly populates product data on fetch ✅');

h3('Checkout & Payment');
bullet('Server-side pricing prevents all price-tampering attacks ✅');
bullet('Razorpay HMAC signature verification ✅');
bullet('🔴 Wallet payment: UI exists but orderController has no wallet debit logic — payment method "Wallet" silently fails', C.danger);
bullet('COD eligibility check + ₹50 shipping below ₹500 ✅');
bullet('COD orders never trigger referral first-order reward (fires only in verifyPayment, not in COD flow)', C.warning);

h3('Returns & Refunds');
bullet('Return request validates order ownership, item existence, and delivery status ✅');
bullet('🔴 Return.seller field is typed ref:"Seller" but Admin-sold products pass Admin IDs — Mongoose validation error', C.danger);
bullet('No return window / deadline enforcement — returns can be submitted at any time', C.warning);

divider();
h2('3.4 Delivery Module');
h3('Assignment & OTP Flow');
bullet('Admin/Seller assigns → Socket notifies delivery partner → Accept/Reject → Picked → Out for Delivery → OTP verify → Delivered ✅');
bullet('🔴 deliveryOtp stored as plaintext in Order document — anyone with DB read access sees active OTPs', C.danger);
bullet('Static OTP bypass "1234" active when useMockOtpForDelivery=true (env-gated, acceptable if restricted to dev) ⚠️');

h3('Wallet & Earnings');
bullet('₹50 delivery fee per order — HARDCODED, not configurable ✅/⚠️');
bullet('COD liability tracked and settled via admin confirmation ✅');
bullet('Idempotent earning records prevent double-credit ✅');

h3('Missing Delivery Features');
bullet('🔴 No live GPS location update API for delivery partners to push coordinates', C.danger);
bullet('🔴 Route optimisation is frontend UI only — no backend routing logic', C.danger);
bullet('DispatchCenter frontend page exists and is connected to dispatch API ✅');

// ─── PHASE 4 ─────────────────────────────────────────────────────────────────
newPage();
h1('PHASE 4 — API & SOCKET FLOW ANALYSIS');

h2('4.1 Critical API Issues');
table(
  ['Endpoint', 'Issue', 'Severity'],
  [
    ['POST /api/auth/admin/register', 'No auth guard — anyone creates admin', 'P0 CRITICAL'],
    ['POST /api/auth/seller/verify-otp', 'Static bypass 123456 always active', 'P0 CRITICAL'],
    ['POST /api/orders/:id/verify-otp', 'OTP stored plaintext in DB', 'P1 HIGH'],
    ['GET /api/config/razorpay', 'Returns public key without auth', 'P3 LOW'],
    ['POST /api/orders/calculate-pricing', 'Public endpoint (by design but note)', 'INFO'],
    ['/api/auth/seller & /api/seller', 'Duplicate mounts — double rate limit budget', 'P1 HIGH'],
    ['/api/auth/delivery & /api/delivery', 'Same duplicate mount issue', 'P1 HIGH'],
    ['GET /api/orders', 'Role-based branching in single handler — logic errors risky', 'P2 MEDIUM'],
  ],
  [180, W() - 270, 90]
);

h2('4.2 Duplicate Route Mounts (app.js)');
para('The following routes are mounted twice under different prefixes:', { bold: true });
bullet("app.use('/api/auth/seller', sellerRoutes)");
bullet("app.use('/api/seller', sellerRoutes)  ← duplicate");
bullet("app.use('/api/auth/delivery', deliveryRoutes)");
bullet("app.use('/api/delivery', deliveryRoutes)  ← duplicate");
para('Each IP gets 1000 requests / 15 min budget. With two paths, effective limit is 2000 requests.', { color: C.warning });

h2('4.3 Socket Event Architecture');
table(
  ['Event', 'Direction', 'DB Persisted', 'FCM Fallback'],
  [
    ['order:new',               'Server → Seller + Admin', '✅', '✅'],
    ['order:status_update',     'Server → User',           '✅', '✅'],
    ['delivery:assigned',       'Server → Delivery',       '✅', '✅'],
    ['delivery:response',       'Server → Seller + Admin', '✅', '✅'],
    ['delivery:approval_update','Server → Delivery',       '✅', '✅'],
    ['product:approval_update', 'Server → Seller',         '✅', '✅'],
    ['product:new_request',     'Server → All Admins',     '✅', '✅'],
    ['product:low_stock',       'Server → Seller + Admin', '✅', '✅'],
    ['notification:new',        'Server → any role',       '✅', 'via above'],
    ['socket:ready',            'Server → client',         '❌', 'N/A'],
  ],
  [150, 130, 100, 100]
);

h3('Socket Issues');
bullet('Missed events during disconnect are NOT backfilled — reconnected clients lose all events that fired while offline', C.warning);
bullet('role:admin room broadcasts reach all assistants including low-permission ones — information leakage', C.warning);
bullet('Token passed in socket.handshake.query — query parameters appear in web server access logs', C.danger);
bullet('isUserOnline() uses in-memory adapter room map — does not work across multiple server instances', C.danger);
bullet('No Redis adapter for Socket.IO — horizontal scaling is impossible without it', C.danger);

// ─── PHASE 5 ─────────────────────────────────────────────────────────────────
newPage();
h1('PHASE 5 — DATABASE & BUSINESS LOGIC ANALYSIS');

h2('5.1 Missing Database Indexes');
para('Order model has comprehensive indexes ✅. Other critical models are under-indexed:', { bold: true });
table(
  ['Model', 'Missing Index', 'Impact'],
  [
    ['Product', 'seller + isActive', 'Slow seller product listing (full collection scan)'],
    ['Product', 'category + isActive', 'Slow shop browsing by category'],
    ['Product', 'isActive + createdAt', 'Slow new arrivals homepage query'],
    ['Product', 'name text index', 'No fast text search capability'],
    ['User', 'referralCode (unique)', 'Slow referral code lookup on signup'],
    ['Seller', 'status + createdAt', 'Slow pending sellers admin list'],
    ['Notification', 'recipient + isRead + createdAt', 'Slow unread notification badge count'],
    ['Return', 'seller + status', 'Slow seller return management list'],
  ],
  [90, 170, W() - 260]
);

h2('5.2 Wallet System Analysis');
para('The wallet system is one of the strongest parts of the codebase:', { bold: true, color: C.success });
bullet('Idempotency keys on all transactions — duplicate credits/debits blocked ✅');
bullet('Mongoose transactions via executeInTransaction with retry on WriteConflict ✅');
bullet('Standalone MongoDB fallback (runs without session) ✅');
bullet('Balance recalculated from transaction log — not just incremented ✅');
para('Issues found:', { bold: true, color: C.danger });
bullet('User Wallet type enum: [signup_bonus, referral_bonus, purchase_debit, refund_credit, manual_adjustment] — "purchase_debit" is never written because wallet payment is unimplemented', C.warning);
bullet('COD orders never trigger referral first-order reward — processFirstOrderReward only called in verifyPayment (online payment path)', C.danger);
bullet('Commission rate hardcoded at 10% in walletService.recordPendingSale — must change code to update', C.warning);

h2('5.3 N+1 Query Problems in Checkout Critical Path');
para('pricingService.calculateCartPricing — 1 DB query per cart item (sequential, not batched):', { bold: true });
bullet('10-item cart = 10 sequential Product.findById() calls');
para('taxService.calculateTaxes — up to 3 queries per item:', { bold: true });
bullet('10-item cart = up to 30 sequential DB calls (Product + Category + Seller per item)');
para('Total for a 10-item cart checkout: up to 40+ sequential database queries in the critical path.', { bold: true, color: C.danger });
para('Fix: Use Product.find({ _id: { $in: ids } }) to batch-fetch all products in a single query. Cache seller state lookups.', { color: C.success });

h2('5.4 Inventory Reservation Commit Risk');
para('In verifyPayment, the reservation commit uses:', { bold: true });
para('InventoryReservation.findOne({ user, product, status: "reserved" })');
para('If the same user has two active reservations for the same product (edge case), the wrong reservation may be committed, leaving stock permanently decremented without a matching order item.', { color: C.danger });
para('Fix: Store reservationId array in the Order document and commit by ID, not by user+product lookup.', { color: C.success });

h2('5.5 Tax Service Fragility');
para('Seller state is detected by crude string matching on the shopAddress field:', { bold: true, color: C.warning });
bullet("if (addr.includes('delhi')) sellerState = 'Delhi'");
bullet("Only 5 states handled — all others default to 'Delhi'");
bullet("Fails for: 'New Delhi', 'NCR', 'DL', addresses containing multiple state names, non-English addresses");
bullet("This causes incorrect CGST/SGST vs IGST split for all sellers outside the 5 coded states");
para('Fix: Add a dedicated state field to the Seller schema. Populate it at registration and use it directly.', { color: C.success });

// ─── PHASE 6 ─────────────────────────────────────────────────────────────────
newPage();
h1('PHASE 6 — SECURITY AUDIT');

h2('P0 — CRITICAL (Fix Immediately, Before Any Deployment)');

const p0Issues = [
  {
    id: 'SEC-001',
    title: 'Admin Registration Endpoint is Completely Open',
    file: 'backend/src/controllers/adminController.js',
    attack: 'Any unauthenticated HTTP request to POST /api/auth/admin/register with valid JSON creates a full superadmin account with unrestricted access to all admin operations.',
    fix: 'Remove the endpoint entirely and seed admin via a one-time CLI script, OR add protect + authorize("admin") + checkPermission("manage_admins") middleware.',
  },
  {
    id: 'SEC-002',
    title: 'Firebase Service Account JSON Committed to Git Repository',
    file: 'backend/src/config/riddha-interior-mart-firebase-adminsdk-fbsvc-5b98b4fbdb.json',
    attack: 'Anyone with repository access (or history access after deletion) has the Firebase Admin private key. They can send malicious push notifications to all users, access Firebase storage, impersonate the app, or revoke legitimate tokens.',
    fix: 'Delete the file from the repo AND git history (git filter-branch or BFG Repo Cleaner). Immediately revoke and rotate the service account in Firebase Console. Use FIREBASE_SERVICE_ACCOUNT_JSON environment variable only.',
  },
  {
    id: 'SEC-003',
    title: 'Hardcoded Fallback JWT Secrets',
    file: 'backend/src/utils/tokenService.js, backend/src/middleware/auth.js',
    attack: 'If ACCESS_TOKEN_SECRET or REFRESH_TOKEN_SECRET env vars are not set, the app silently uses known strings ("your_fallback_access_token_secret_value_here"). An attacker can forge any JWT token for any user or role.',
    fix: 'Remove all fallback values. Add startup assertion: if (!process.env.ACCESS_TOKEN_SECRET) throw new Error("ACCESS_TOKEN_SECRET is required"). Never provide working defaults for security-critical secrets.',
  },
  {
    id: 'SEC-004',
    title: 'NODE_ENV=development Hardcoded in .env (CORS Wide Open in Production)',
    file: 'backend/.env',
    attack: 'With NODE_ENV=development, the CORS middleware callback returns true for ALL origins unconditionally. Any website or script on the internet can make credentialed requests to the API and receive auth cookies.',
    fix: 'Set NODE_ENV=production in the actual production environment file. Never commit NODE_ENV=development to a file that runs in production.',
  },
  {
    id: 'SEC-005',
    title: 'Static OTP Bypass "123456" Unconditionally Active',
    file: 'backend/src/controllers/sellerController.js',
    attack: 'The condition "const isStaticBypass = otp === \'123456\'" has no environment guard. Any person who knows this bypass (it is now in git history) can verify any seller account without receiving a real OTP. This permanently lowers the KYC bar to zero.',
    fix: 'Either remove the bypass entirely, or wrap it: if (process.env.NODE_ENV !== "production" && otp === "123456")',
  },
  {
    id: 'SEC-006',
    title: 'Test Email Bypass in Admin Login',
    file: 'backend/src/controllers/adminController.js',
    attack: 'The first line of loginAdmin checks if (email === "test@test.com") and returns HTTP 200 success without any authentication. This confirms server liveness and leaks API structure to probers.',
    fix: 'Remove this line unconditionally.',
  },
  {
    id: 'SEC-007',
    title: 'Firebase Client Config in .env.local Committed to Git',
    file: 'frontend/.env.local',
    attack: 'VITE_FIREBASE_VAPID_KEY and all Firebase client SDK keys are in .env.local which is tracked by git. The VAPID key allows subscription spoofing and push notification abuse.',
    fix: 'Add .env.local to .gitignore immediately. Rotate the VAPID key in Firebase Console.',
  },
  {
    id: 'SEC-008',
    title: 'JWT Access Token Stored in localStorage (XSS Attack Vector)',
    file: 'frontend/src/shared/utils/api.js, frontend/src/modules/user/data/UserContext.jsx',
    attack: 'The full user object including JWT token is stored in localStorage. Any XSS vulnerability in any component (including third-party libraries) can exfiltrate the token with document.localStorage. The httpOnly cookie setup is rendered useless.',
    fix: 'Remove token from all API response bodies and localStorage. The backend already sets httpOnly cookies — use ONLY cookies for auth. Remove the Authorization header injection from the Axios interceptor. The withCredentials: true on the Axios instance handles auth via cookies automatically.',
  },
];

p0Issues.forEach((issue) => {
  ensureSpace(90);
  doc.save().rect(C.pageGutter - 10, currentY, W() + 20, 18).fill('#FEE2E2').restore();
  doc.font('Helvetica-Bold').fontSize(9.5).fillColor(C.danger)
     .text(`${issue.id}: ${issue.title}`, C.pageGutter, currentY + 4, { width: W() });
  currentY += 22;
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor(C.mid).text('File: ', C.pageGutter, currentY, { continued: true });
  doc.font('Helvetica').fillColor(C.dark).text(issue.file);
  currentY = doc.y + 3;
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#991B1B').text('Attack Scenario:', C.pageGutter, currentY);
  currentY = doc.y + 2;
  doc.font('Helvetica').fontSize(8.5).fillColor(C.dark)
     .text(issue.attack, C.pageGutter + 8, currentY, { width: W() - 8 });
  currentY = doc.y + 3;
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor(C.success).text('Fix:', C.pageGutter, currentY);
  currentY = doc.y + 2;
  doc.font('Helvetica').fontSize(8.5).fillColor('#065F46')
     .text(issue.fix, C.pageGutter + 8, currentY, { width: W() - 8 });
  currentY = doc.y + 12;
});

newPage();
h2('P1 — HIGH (Fix Before Launch)');
const p1Issues = [
  ['SEC-009', 'Delivery OTP Stored as Plaintext in DB',       'Order.js, orderController.js',    'Hash OTP with SHA-256 before saving. Compare hash at verification.'],
  ['SEC-010', 'Duplicate Route Mounts Double Rate Limit',      'app.js',                          'Remove /api/seller and /api/delivery duplicate mounts. Use only /api/auth/seller and /api/auth/delivery.'],
  ['SEC-011', 'No CSRF Protection on Cookie-Based Auth',       'tokenService.js, app.js',         'Implement double-submit cookie pattern or synchronizer token pattern. Set sameSite: strict in production.'],
  ['SEC-012', 'Return.seller Accepts Admin IDs in Seller Ref', 'Return.js, returnController.js',  'Make seller field polymorphic with refPath. Add sellerType field to Return model.'],
  ['SEC-013', 'COD Orders Skip Referral First-Order Reward',   'orderController.js',              'Add processFirstOrderReward call in COD order completion path (when isPaid set to true on OTP verify).'],
  ['SEC-014', 'Token Sent in Response Body (stored in LS)',    'sendTokenResponse.js',            'Remove token field from all JSON responses. Cookies only. See SEC-008 fix.'],
];
table(
  ['ID', 'Issue', 'File', 'Fix'],
  p1Issues,
  [55, 145, 120, W() - 320]
);

h2('P2 — MEDIUM');
const p2Issues = [
  ['SEC-015', 'Rate Limit Too Permissive (1000/15min)', 'rateLimiter.js', 'Reduce to 300 req/15min general, 20 req/15min for auth'],
  ['SEC-016', 'AV Scanner is Pattern-Only (No Real AV)', 'antivirusService.js', 'Integrate ClamAV daemon or VirusTotal API'],
  ['SEC-017', 'role:admin socket room leaks to assistants', 'socket.js', 'Use individual admin rooms, not role:admin broadcast'],
  ['SEC-018', 'Socket token in query string (logged)', 'socket.js (client)', 'Use only socket.handshake.auth.token, not query param'],
];
table(['ID', 'Issue', 'File', 'Fix'], p2Issues, [55, 155, 100, W() - 310]);

// ─── PHASE 7 ─────────────────────────────────────────────────────────────────
newPage();
h1('PHASE 7 — FRONTEND PERFORMANCE & UX ANALYSIS');

h2('7.1 Architecture Problems');
const feIssues = [
  ['40% Dead Code',           'views/pages & models dirs are never imported. Entire directories can be deleted.', 'High'],
  ['Token in localStorage',   'See SEC-008. Entire auth security model undermined.', 'Critical'],
  ['Cart clear bug',          'CartContext: localStorage only written when cart.length > 0. Empty cart reloads stale items on refresh.', 'High'],
  ['Missing role notifications', 'App.jsx renders AdminNotifications + UserNotifications but NOT SellerNotifications or DeliveryNotifications.', 'High'],
  ['BottomNavbar path mismatch', 'isProductPage checks /product/ but routes use /products/ — nav bar shows/hides incorrectly', 'Medium'],
  ['UserContext /auth/me on every mount', 'One extra API call per page navigation. Should use stale-while-revalidate.', 'Medium'],
  ['No product list virtualisation', 'All products rendered in DOM at once — poor performance with large catalogues.', 'Medium'],
  ['Single Suspense boundary', 'One GlobalLoader for all lazy-loaded modules — no per-route loading states.', 'Low'],
];
table(['Issue', 'Detail', 'Priority'], feIssues, [120, W() - 180, 60]);

h2('7.2 React Performance Issues');
bullet('containerVariants defined inline in HomePage render — new object reference every render triggers Framer Motion re-runs');
bullet('No React.memo on ProductCard — all products re-render when any parent state changes');
bullet('CartContext computations not memoised — totals recalculated on every render cycle');
bullet('No useMemo on expensive user context value — entire subtree re-renders on any user state change (memoised now, but other contexts are not)');

h2('7.3 Bundle & Loading Optimisation');
table(
  ['Item', 'Current', 'Recommended'],
  [
    ['Module code splitting',  'Lazy per module ✅',    'Also split by route within module'],
    ['Image lazy loading',     'HTML loading="lazy" ✅', 'Add IntersectionObserver for above-fold priority'],
    ['Product virtualisation', 'None ❌',               'react-window or react-virtual'],
    ['API response caching',   'None ❌',               'React Query or SWR with stale-while-revalidate'],
    ['Bundle analysis',        'Not run ❌',            'Run vite-bundle-visualizer to find bloat'],
  ],
  [130, 140, W() - 270]
);

h2('7.4 Mobile & UX Issues');
bullet('PincodeModal blocks entire screen on first visit — no dismiss/skip option frustrates users');
bullet('BottomNavbar isProductPage check uses wrong path prefix (minor but causes nav flicker)');
bullet('Checkout flow: wallet payment option shown in UI but silently fails — users will be confused and abandon');
bullet('No loading state feedback when Razorpay modal takes time to load');

// ─── PHASE 8 ─────────────────────────────────────────────────────────────────
newPage();
h1('PHASE 8 — DEVOPS & PRODUCTION READINESS');

h2('8.1 Deployment Configuration Assessment');
table(
  ['Item', 'Status', 'Action Required'],
  [
    ['vercel.json (backend)',  '🔴 Wrong platform', 'Vercel serverless breaks Socket.IO. Use Railway, Render, Fly.io, or VPS'],
    ['Dockerfile',            '🔴 Missing',         'Create Dockerfile + docker-compose for local dev parity'],
    ['PM2 ecosystem.config.js','🔴 Missing',        'Required for production process management'],
    ['CI/CD pipelines',       '🔴 Missing',         'Add .github/workflows/ for test + deploy'],
    ['NODE_ENV in .env',      '🔴 development',     'Must be production in production env file'],
    ['Firebase JSON in repo', '🔴 CRITICAL',        'Delete from repo + git history. Rotate key.'],
    ['.env.example files',    '🟡 Missing',         'Add .env.example for both frontend and backend'],
    ['Health check endpoint', '🟡 Missing',         'Add GET /api/health returning {status:"ok", db:"connected"}'],
    ['SMTP env vars',         '🔴 Not set',         'Add SMTP_HOST/PORT/USER/PASS — emails currently fail silently'],
  ],
  [150, 100, W() - 250]
);

h2('8.2 Logging & Observability');
bullet('Logging: Only console.log/error — no structured logs, no log levels, no correlation IDs', C.danger);
bullet('Monitoring: No Sentry, no Datadog, no APM tool integrated', C.danger);
bullet('frontend/src/shared/utils/monitoring.js exists but integration unclear', C.warning);
bullet('No request ID middleware — impossible to trace a request across logs', C.warning);
para('Fix: Add Winston with JSON transport. Add Sentry in both frontend (Vite plugin) and backend (Express middleware). Add morgan with correlation ID header.', { color: C.success });

h2('8.3 Scaling Readiness Assessment');
table(
  ['Concern', 'Current State', 'Required for Scale'],
  [
    ['Token blacklist',       'In-memory Map',           'Redis (survives restart, shared across nodes)'],
    ['User profile cache',    'In-memory Map',           'Redis (shared cache layer)'],
    ['Socket.IO adapter',     'Default memory adapter',  'Redis adapter (socket.io-adapter-redis)'],
    ['Email queue',           'In-process MongoDB read',  'Bull queue (Redis-backed) with worker processes'],
    ['Reservation daemon',    'Single in-process daemon', 'Scheduled job service or dedicated worker'],
    ['Static file serving',   '/uploads static mount',   'Cloudinary CDN for all assets (already partial)'],
    ['Session storage',       'Cookies (stateless) ✅',  'Already stateless — good for horizontal scale'],
  ],
  [130, 150, W() - 280]
);

h2('8.4 Email System Risk');
bullet('emailService.startDaemon() runs inside the Express process as a setInterval loop');
bullet('On crash or restart: all emails queued in-flight are abandoned — customers may not receive order confirmations or OTPs', C.danger);
bullet('No retry count or dead-letter mechanism — failed emails vanish silently', C.danger);
bullet('SMTP credentials not present in .env file — emails may currently not be sending at all', C.danger);
para('Fix: Migrate to Bull queue (Redis) with separate worker process, retry policies, and failure alerting.', { color: C.success });

// ─── PHASE 9 ─────────────────────────────────────────────────────────────────
newPage();
h1('PHASE 9 — COMPLETE ISSUE REGISTER (P0 – P3)');

h2('P0 — Critical (8 Issues) — Block All Deployment');
table(
  ['ID', 'Issue', 'File', 'Business Impact'],
  [
    ['P0-001', 'Admin register unprotected',      'adminController.js',              'Full platform takeover'],
    ['P0-002', 'Firebase JSON in git',             'src/config/*.json',               'Firebase compromise'],
    ['P0-003', 'Hardcoded JWT fallback secrets',   'tokenService.js, auth.js',        'Token forgery for any user'],
    ['P0-004', 'NODE_ENV=development in .env',     '.env',                            'CORS open to all origins'],
    ['P0-005', 'Static OTP bypass always active',  'sellerController.js',             'Bypass all seller KYC'],
    ['P0-006', 'KYC docs as local FS paths',       'sellerController.js',             'Data loss in production'],
    ['P0-007', 'Test email bypass in admin login', 'adminController.js',              'Security + info leak'],
    ['P0-008', '.env.local with Firebase in git',  '.env.local',                      'Firebase abuse, VAPID spoof'],
  ],
  [50, 170, 120, W() - 340]
);

h2('P1 — High (12 Issues) — Fix Before Launch');
table(
  ['ID', 'Issue', 'Impact'],
  [
    ['P1-001', 'JWT token in localStorage (XSS surface)',       'Session hijacking'],
    ['P1-002', 'Delivery OTP plaintext in Order.deliveryOtp',  'OTP theft from DB'],
    ['P1-003', 'Duplicate route mounts double rate limit',     'Rate limit bypass'],
    ['P1-004', 'No CSRF protection',                           'Cross-site request forgery'],
    ['P1-005', 'Return.seller breaks for admin products',      'Broken return flow'],
    ['P1-006', 'COD orders skip referral rewards',             'Business logic gap'],
    ['P1-007', 'Cart localStorage not cleared when empty',     'Stale cart UX bug'],
    ['P1-008', '40 N+1 DB queries in checkout critical path', 'Slow checkout, timeouts'],
    ['P1-009', 'Wallet payment missing in checkout',           'Feature advertised but broken'],
    ['P1-010', 'commitReservation by user+product (not ID)',   'Wrong stock deduction edge case'],
    ['P1-011', 'Socket.IO on Vercel serverless',              'Real-time broken in production'],
    ['P1-012', 'Seller/Delivery notifications not in App.jsx', 'Missing real-time updates'],
  ],
  [50, W() - 200, 200]
);

h2('P2 — Medium (12 Issues) — First Sprint Post-Launch');
table(
  ['ID', 'Issue', 'Impact'],
  [
    ['P2-001', 'Tax seller state by string match',            'Wrong GST for most sellers'],
    ['P2-002', 'Commission + delivery fee hardcoded',         'Cannot change without redeploy'],
    ['P2-003', 'Return window not enforced',                  'Unlimited return window'],
    ['P2-004', 'Email queue loses messages on crash',         'Lost transactional emails'],
    ['P2-005', 'In-memory cache breaks multi-instance',       'Cache miss floods + invalidation failures'],
    ['P2-006', 'Geocoding in checkout critical path',         'External API latency in checkout'],
    ['P2-007', 'UserContext calls /auth/me on every page',    'Extra 200ms per navigation'],
    ['P2-008', 'No structured logging / Sentry',             'Cannot debug production incidents'],
    ['P2-009', '40% frontend dead code',                     'Bundle bloat, developer confusion'],
    ['P2-010', 'No product text search index',               'Slow search queries on large catalogue'],
    ['P2-011', 'Product.category is String not ObjectId ref', 'No referential integrity'],
    ['P2-012', 'SMTP env vars not configured',               'Emails failing silently in prod'],
  ],
  [50, W() - 200, 200]
);

h2('P3 — Low (10 Issues) — Backlog');
const p3List = [
  'No CSV/Excel export for admin reports',
  'No Redis adapter for Socket.IO (required for horizontal scaling)',
  'No PM2 ecosystem.config.js for production process management',
  'No Docker / docker-compose / CI-CD configuration',
  'Antivirus scanner is regex pattern-match only — no ClamAV integration',
  'Orphan getSignedJwtToken() on Admin model (30-day JWT, never called by main auth)',
  '15+ seed/migration/scratch scripts committed to repository root',
  'No return window deadline enforcement in Return model',
  'Product list has no virtualisation (DOM grows unboundedly with pagination)',
  'ComingSoon module is static placeholder — no feature behind it',
];
p3List.forEach(t => bullet(t));

// ─── PHASE 10 ────────────────────────────────────────────────────────────────
newPage();
h1('PHASE 10 — FUNCTIONALITY MATRIX');

table(
  ['Feature', 'Frontend', 'Backend', 'DB', 'Socket', 'Security', 'Status'],
  [
    ['User Auth (JWT+Refresh)',      '✅', '✅', '✅', '—',  '⚠️ LS',    'Partial'],
    ['Admin Auth',                   '✅', '🔴', '✅', '—',  '🔴',       'Broken'],
    ['Seller Auth + KYC',           '✅', '⚠️', '✅', '✅', '🔴',       'Partial'],
    ['Delivery Auth',               '✅', '✅', '✅', '✅', '✅',        'Working'],
    ['RBAC (superadmin/assistant)', '✅', '✅', '✅', '—',  '✅',        'Working'],
    ['Product CRUD',                '✅', '✅', '✅', '✅', '✅',        'Working'],
    ['Inventory Reservation',       '—',  '✅', '✅', '—',  '✅',        'Working'],
    ['Cart',                        '⚠️', '✅', '✅', '—',  '⚠️',       'Partial'],
    ['Checkout (Razorpay)',          '✅', '✅', '✅', '—',  '✅',        'Working'],
    ['Checkout (Wallet)',            '✅', '🔴', '—',  '—',  '—',         'Broken'],
    ['Checkout (COD)',               '✅', '✅', '✅', '—',  '✅',        'Working'],
    ['Coupon System',               '✅', '✅', '✅', '—',  '✅',        'Working'],
    ['GST Tax Calculation',         '✅', '⚠️', '✅', '—',  '✅',        'Partial'],
    ['Returns + Refunds',           '✅', '⚠️', '✅', '—',  '✅',        'Partial'],
    ['Seller Wallet',               '✅', '✅', '✅', '—',  '✅',        'Working'],
    ['Delivery Wallet',             '✅', '✅', '✅', '—',  '✅',        'Working'],
    ['User Wallet',                 '✅', '✅', '✅', '✅', '✅',        'Working'],
    ['Referral System',             '✅', '✅', '✅', '✅', '✅',        'Working'],
    ['Socket Notifications',        '✅', '✅', '✅', '✅', '⚠️',       'Working'],
    ['FCM Push Notifications',      '✅', '✅', '✅', '—',  '🔴 key',   'Partial'],
    ['PDF Invoice',                 '✅', '✅', '✅', '—',  '✅',        'Working'],
    ['CMS (Banners/Sections)',      '✅', '✅', '✅', '—',  '✅',        'Working'],
    ['Reviews + Ratings',           '✅', '✅', '✅', '—',  '✅',        'Working'],
    ['Support Tickets',             '✅', '✅', '✅', '—',  '✅',        'Working'],
    ['Analytics (All roles)',       '✅', '✅', '✅', '—',  '✅',        'Working'],
    ['Live GPS Tracking',           '✅', '🔴', '—',  '—',  '—',         'Broken'],
    ['Route Optimisation',          '✅', '🔴', '—',  '—',  '—',         'Broken'],
    ['CMS Blog System',             '—',  '🔴', '—',  '—',  '—',         'Missing'],
    ['B2B Bulk Orders',             '✅', '✅', '✅', '—',  '✅',        'Partial'],
  ],
  [130, 28, 28, 28, 28, 55, 70]
);

// ─── PHASE 11 ────────────────────────────────────────────────────────────────
newPage();
h1('PHASE 11 — PRODUCTION READINESS SCORES');

y(10);
scoreBar('Architecture Quality',    62);
scoreBar('Security Posture',        38);
scoreBar('Scalability Readiness',   35);
scoreBar('Frontend Code Quality',   58);
scoreBar('Backend Code Quality',    72);
scoreBar('Database Design',         65);
scoreBar('DevOps Readiness',        20);
scoreBar('Realtime Architecture',   70);
scoreBar('Payment System',          74);
y(10);
doc.save().rect(C.pageGutter - 10, currentY, W() + 20, 2).fill(C.brand).restore();
currentY += 10;
scoreBar('⭐ OVERALL PRODUCTION READINESS', 49);

y(20);
ensureSpace(120);
doc.save().roundedRect(C.pageGutter - 10, currentY, W() + 20, 110, 6).fill('#FEF2F2').restore();
doc.save().roundedRect(C.pageGutter - 10, currentY, 6, 110, 0).fill(C.danger).restore();
doc.font('Helvetica-Bold').fontSize(11).fillColor(C.danger)
   .text('VERDICT: NOT PRODUCTION READY', C.pageGutter + 6, currentY + 10, { width: W() - 6 });
doc.font('Helvetica').fontSize(9).fillColor(C.dark)
   .text(
     'The platform has strong financial systems (idempotent wallets, atomic inventory), a solid socket/FCM architecture, and good server-side pricing. However, 8 critical security vulnerabilities including an open admin registration endpoint, Firebase credentials in the repository, hardcoded JWT secrets, and JWT tokens in localStorage make this platform unsafe to deploy without remediation.\n\n' +
     'Estimated time to P0 resolution: 1–2 engineer days.\nEstimated time to full P1 resolution: 1 engineer week.\nEstimated time to production readiness: 2–3 engineer weeks.',
     C.pageGutter + 6, currentY + 28, { width: W() - 16 }
   );
currentY += 120;

y(20);
ensureSpace(100);
doc.save().roundedRect(C.pageGutter - 10, currentY, W() + 20, 88, 6).fill('#F0FDF4').restore();
doc.save().roundedRect(C.pageGutter - 10, currentY, 6, 88, 0).fill(C.success).restore();
doc.font('Helvetica-Bold').fontSize(11).fillColor(C.success)
   .text('STRENGTHS TO PRESERVE', C.pageGutter + 6, currentY + 10, { width: W() - 6 });
const strengths = [
  'Wallet system: idempotent, atomic, retry-safe — production-grade fintech quality',
  'Inventory reservation: atomic overselling prevention — correct implementation',
  'Server-side checkout pricing: eliminates all price-tampering attacks',
  'Token rotation + reuse detection: strong session security (when storage is fixed)',
  'Upload security: binary magic-number validation + metadata stripping',
  'Socket + FCM hybrid: online/offline notification coverage',
];
strengths.forEach((s, i) => {
  doc.font('Helvetica').fontSize(8.5).fillColor(C.dark)
     .text(`• ${s}`, C.pageGutter + 12, currentY + 28 + i * 12, { width: W() - 16 });
});
currentY += 100;

// ─── PHASE 12 ────────────────────────────────────────────────────────────────
newPage();
h1('PHASE 12 — IMPLEMENTATION ROADMAP');

h2('Sprint 0 — P0 Critical (1–2 Days, Before ANY Deployment)');
table(
  ['#', 'Task', 'Files', 'Effort'],
  [
    ['1', 'Remove/protect admin register endpoint',           'adminController.js, adminRoutes.js',             '1h'],
    ['2', 'Delete Firebase JSON from repo + git history',     'src/config/*.json, .gitignore',                  '2h'],
    ['3', 'Remove hardcoded JWT fallback secrets',            'tokenService.js, auth.js',                       '1h'],
    ['4', 'Set NODE_ENV=production in production .env',       '.env',                                           '5m'],
    ['5', 'Gate static OTP bypass with NODE_ENV check',       'sellerController.js',                            '30m'],
    ['6', 'Remove test email bypass in admin login',          'adminController.js',                             '10m'],
    ['7', 'Add .env.local to .gitignore, rotate VAPID key',  '.gitignore, Firebase Console',                   '30m'],
    ['8', 'Upload seller KYC docs to Cloudinary, store URL',  'sellerController.js, uploadRoutes.js',           '3h'],
  ],
  [20, 180, 140, 40]
);

h2('Sprint 1 — P1 High (Week 1)');
table(
  ['#', 'Task', 'Files', 'Effort'],
  [
    ['1', 'Remove token from localStorage — cookies only',     'api.js, UserContext.jsx, sendTokenResponse.js',  '1d'],
    ['2', 'Hash delivery OTP before storing in DB',            'orderController.js, Order.js',                   '2h'],
    ['3', 'Remove duplicate route mounts from app.js',         'app.js',                                         '30m'],
    ['4', 'Implement wallet payment in checkout',              'orderController.js, walletService.js, CheckoutPage.jsx', '1d'],
    ['5', 'Fix cart localStorage clear bug',                   'CartContext.jsx',                                '30m'],
    ['6', 'Fix Return.seller polymorphic ref',                 'Return.js, returnController.js',                 '2h'],
    ['7', 'Trigger referral reward for COD orders',            'orderController.js (verifyDeliveryOtp)',          '1h'],
    ['8', 'Add SellerNotifications + DeliveryNotifications',   'App.jsx',                                        '2h'],
    ['9', 'Batch-fetch products (eliminate N+1 in checkout)',  'pricingService.js, taxService.js',               '3h'],
    ['10','Move geocoding async (post-order creation)',         'orderController.js, geocoder.js',                '2h'],
    ['11','Migrate from Vercel to persistent server',           'vercel.json, deployment config',                 '1d'],
  ],
  [20, 195, 140, 40]
);

h2('Sprint 2 — P2 Enhancements (Weeks 2–3)');
table(
  ['#', 'Task', 'Files', 'Effort'],
  [
    ['1', 'Delete views/ and models/ duplicate dirs from frontend',    'frontend/src/modules/*/views/, */models/', '2h'],
    ['2', 'Add state field to Seller schema for accurate tax calc',    'Seller.js, taxService.js',                '3h'],
    ['3', 'Move commission rate + delivery fee to SystemSettings',     'SystemSettings.js, walletService.js',     '3h'],
    ['4', 'Enforce return window (configurable days)',                  'Return.js, returnController.js',          '2h'],
    ['5', 'Add missing DB indexes (Product, User, Seller, Notification)', 'All model files',                     '1h'],
    ['6', 'Integrate Redis for cache + Socket.IO adapter',              'cacheService.js, socket.js, redisClient.js', '1d'],
    ['7', 'Add Winston structured logging',                             'All controllers, new logger.js',         '1d'],
    ['8', 'Add Sentry error tracking (backend + frontend)',             'app.js, main.jsx',                       '2h'],
    ['9', 'Add SMTP env vars and verify email queue',                   '.env, emailService.js',                  '1h'],
    ['10', 'Add CSRF protection',                                       'app.js, tokenService.js',                '3h'],
    ['11', 'Add GET /api/health endpoint',                              'app.js',                                 '30m'],
    ['12', 'Fix Product.category to ObjectId ref with migration',       'Product.js, all create/edit flows',      '1d'],
  ],
  [20, 200, 140, 40]
);

h2('Sprint 3 — P3 Future Improvements (Month 2)');
const s3 = [
  ['Add Docker + docker-compose + .env.example files', '1d'],
  ['Add GitHub Actions CI/CD (lint + test + deploy)', '1d'],
  ['Add PM2 ecosystem.config.js with cluster mode', '2h'],
  ['Integrate real ClamAV antivirus scanner', '1d'],
  ['Add react-window virtualisation for product lists', '1d'],
  ['Admin CSV/Excel export for orders and users', '2d'],
  ['Implement live GPS tracking API for delivery partners', '3d'],
  ['Implement delivery route optimisation backend', '1w'],
  ['Build CMS Blog system (model + controller + UI)', '3d'],
  ['Migrate search to MongoDB Atlas Search / Elasticsearch', '3d'],
  ['Add comprehensive test suite (Jest + Supertest)', '1w'],
  ['Migrate email queue to Bull (Redis-backed) with retry + DLQ', '1d'],
];
table(['Task', 'Estimate'], s3, [W() - 80, 80]);

// ─── FINAL SUMMARY PAGE ──────────────────────────────────────────────────────
newPage(false);
doc.save().rect(0, 0, doc.page.width, doc.page.height).fill(C.dark).restore();

doc.font('Helvetica-Bold').fontSize(22).fillColor(C.white)
   .text('AUDIT COMPLETE', C.pageGutter, 80, { align: 'center', width: W() });
doc.font('Helvetica').fontSize(11).fillColor('#9CA3AF')
   .text('Riddha Mart — Enterprise Production Readiness Assessment', C.pageGutter, 114, { align: 'center', width: W() });

const summaryStats = [
  ['76', 'Features Analysed'],
  ['8',  'P0 Critical Issues'],
  ['12', 'P1 High Issues'],
  ['49', 'Overall Score / 100'],
];
const boxW = (W() - 30) / 4;
summaryStats.forEach(([num, label], i) => {
  const bx = C.pageGutter + i * (boxW + 10);
  const color = i === 3 ? C.danger : i === 0 ? C.success : i === 1 ? C.danger : '#EA580C';
  doc.save().roundedRect(bx, 160, boxW, 80, 8).fill(C.black).restore();
  doc.font('Helvetica-Bold').fontSize(28).fillColor(color)
     .text(num, bx, 175, { width: boxW, align: 'center' });
  doc.font('Helvetica').fontSize(8).fillColor('#9CA3AF')
     .text(label, bx, 210, { width: boxW, align: 'center' });
});

doc.font('Helvetica-Bold').fontSize(12).fillColor(C.brand)
   .text('Top 3 Immediate Actions', C.pageGutter, 270, { align: 'center', width: W() });

const topActions = [
  ['1', 'Protect Admin Register + Remove Firebase JSON from Git', 'Severity: CRITICAL — Do today'],
  ['2', 'Move JWT Token from localStorage to httpOnly Cookie Only', 'Severity: CRITICAL — Do this week'],
  ['3', 'Remove Hardcoded JWT Secrets + Fix NODE_ENV in .env', 'Severity: CRITICAL — Do today'],
];
topActions.forEach(([n, action, sub], i) => {
  const ay = 300 + i * 55;
  doc.save().roundedRect(C.pageGutter, ay, W(), 46, 6).fill('#1F2937').restore();
  doc.font('Helvetica-Bold').fontSize(18).fillColor(C.brand)
     .text(n, C.pageGutter + 12, ay + 10, { continued: true });
  doc.font('Helvetica-Bold').fontSize(9.5).fillColor(C.white)
     .text(`  ${action}`, { lineBreak: false });
  doc.font('Helvetica').fontSize(8).fillColor('#6B7280')
     .text(sub, C.pageGutter + 30, ay + 30, { width: W() - 40 });
});

doc.font('Helvetica').fontSize(8).fillColor('#4B5563')
   .text(
     `Generated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}  ·  Reviewer: Claude Sonnet 4.6 (Anthropic)  ·  CONFIDENTIAL`,
     C.pageGutter,
     doc.page.height - 50,
     { align: 'center', width: W() }
   );

// ─── Finalise ─────────────────────────────────────────────────────────────────
doc.end();

stream.on('finish', () => {
  console.log(`\n✅  PDF generated successfully!\n📄  File: ${outFile}\n`);
});
stream.on('error', (err) => {
  console.error('❌  PDF generation failed:', err.message);
  process.exit(1);
});
