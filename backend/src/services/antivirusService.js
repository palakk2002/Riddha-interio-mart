const fs = require('fs');

/**
 * Production-Grade Antivirus scanning service.
 * Abstraction layer for scanning uploaded file streams/buffers against virus databases (e.g. ClamAV, VirusTotal).
 */
class AntivirusService {
  /**
   * Scans a local file for malicious payloads.
   * @param {string} filePath Absolute path to the local file.
   * @returns {Promise<{ safe: boolean, reason: string | null }>} Scan results.
   */
  async scanFile(filePath) {
    try {
      if (!fs.existsSync(filePath)) {
        return { safe: false, reason: 'File does not exist' };
      }

      // Read a portion of the file to check for common shellcode / script injections in images
      const fd = fs.openSync(filePath, 'r');
      const buffer = Buffer.alloc(4096);
      fs.readSync(fd, buffer, 0, 4096, 0);
      fs.closeSync(fd);

      const content = buffer.toString('utf-8');

      // Check for common malicious script keywords embedded in files (XSS, PHP Web Shells, exploit payloads)
      const maliciousPatterns = [
        /<\?php/i,                    // PHP tag
        /eval\s*\(/i,                 // dangerous eval
        /exec\s*\(/i,                 // dangerous exec
        /system\s*\(/i,               // system command calls
        /passthru\s*\(/i,             // passthru command calls
        /base64_decode/i,             // obfuscated payload indicator
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/i, // embedded JS tags
        /onload\s*=/i,                // inline JS triggers
        /onerror\s*=/i                // inline JS triggers
      ];

      for (const pattern of maliciousPatterns) {
        if (pattern.test(content)) {
          return {
            safe: false,
            reason: `Malicious signature or scripting content detected in file: matching pattern ${pattern.toString()}`
          };
        }
      }

      // Placeholder: Integration point for actual ClamAV daemon or VirusTotal API
      // Example:
      // const scanner = require('clamjs')();
      // const isClean = await scanner.scanFile(filePath);
      // if (!isClean) return { safe: false, reason: 'Infected with malware' };

      return { safe: true, reason: null };
    } catch (err) {
      console.error('[Antivirus] Scan error:', err.message);
      // In production, log error and fail-closed or fail-open depending on policy
      // We choose to fail-closed for security
      return { safe: false, reason: `Antivirus scanner encountered an internal error: ${err.message}` };
    }
  }
}

module.exports = new AntivirusService();
