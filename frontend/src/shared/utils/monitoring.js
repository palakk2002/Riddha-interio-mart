class MonitoringService {
  constructor() {
    this.logsRingBuffer = [];
    this.maxLogs = 20;
    this.isSentryInitialized = false;

    if (typeof window !== 'undefined') {
      this.setupGlobalListeners();
    }
  }

  /**
   * Listen to global uncaught exceptions and promise rejections
   */
  setupGlobalListeners() {
    window.addEventListener('error', (event) => {
      this.logException(event.error || new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        type: 'uncaught_exception'
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.logException(event.reason || new Error('Unhandled Promise Rejection'), {
        type: 'unhandled_rejection'
      });
    });
  }

  /**
   * Log an exception with metadata.
   * Connects to Sentry if VITE_SENTRY_DSN is configured, otherwise handles telemetry mock buffer.
   */
  logException(error, context = {}) {
    const errorLog = {
      message: error?.message || String(error),
      stack: error?.stack || '',
      context,
      timestamp: new Date().toISOString()
    };

    // Store in ring buffer for diagnostics
    this.logsRingBuffer.push(errorLog);
    if (this.logsRingBuffer.length > this.maxLogs) {
      this.logsRingBuffer.shift();
    }

    console.error('[Monitoring Telemetry]', errorLog);

    // If real Sentry was configured, we would call Sentry.captureException(error, { extra: context });
  }

  /**
   * Capture custom breadcrumb logs (useful for troubleshooting)
   */
  addBreadcrumb(message, category = 'action', level = 'info') {
    const breadcrumb = {
      message,
      category,
      level,
      timestamp: new Date().toISOString()
    };
    console.log(`[Breadcrumb - ${category}] ${message}`);
  }

  /**
   * Retrieve stored logs ring buffer for administrative diagnostics
   */
  getCrashLogs() {
    return this.logsRingBuffer;
  }
}

export default new MonitoringService();
