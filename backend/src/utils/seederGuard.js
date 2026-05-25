/**
 * Production Seeding Safeguard Utility
 * Aborts script execution immediately if NODE_ENV is set to 'production' 
 * unless ALLOW_PRODUCTION_SEED is explicitly set to 'true'.
 *
 * @param {string} scriptName Name of the script being guarded
 */
const enforceDevMode = (scriptName) => {
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_PRODUCTION_SEED !== 'true') {
    console.error(`\n======================================================================`);
    console.error(`[SECURITY ERROR] Blocked execution of "${scriptName}" on a production database!`);
    console.error(`Database seeding is highly destructive and blocked by default in production.`);
    console.error(`----------------------------------------------------------------------`);
    console.error(`To bypass this safeguard (e.g., in a secure staging/sandbox cluster):`);
    console.error(`Set ALLOW_PRODUCTION_SEED=true in your environment variables.`);
    console.error(`======================================================================\n`);
    process.exit(1);
  }
};

module.exports = enforceDevMode;
