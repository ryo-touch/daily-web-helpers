(function() {
  // Configuration object
  const CONFIG = {
    selectors: {
      dialogTitle: 'ビデオ通話の録画',
      checkboxClass: 'KGC9Kd-muHVFf-bMcfAe'
    },
    indices: {
      captionsCheckbox: 0,      // "録画に字幕を含める" - DO NOT touch
      transcriptionCheckbox: 1, // "文字起こしも開始" - AUTO-CHECK
      geminiCheckbox: 2         // "Gemini によるメモ作成も開始する" - AUTO-CHECK
    },
    timings: {
      debounceDelay: 200,
      observerTimeout: 60000
    }
  };

  // Logging helpers
  const LOG_PREFIX = '[Google Meet Auto-Record]';
  const log = (msg) => console.log(`${LOG_PREFIX} ${msg}`);
  const warn = (msg) => console.warn(`${LOG_PREFIX} ${msg}`);

  // State management
  let hasExecuted = false;
  let debounceTimer = null;

  // Helper: Check if recording dialog is visible
  const isRecordingDialogVisible = () => {
    const allText = document.body.textContent;
    return allText.includes(CONFIG.selectors.dialogTitle);
  };

  // Helper: Get all checkboxes in recording panel
  const getAllCheckboxes = () => {
    const checkboxes = document.querySelectorAll(`input.${CONFIG.selectors.checkboxClass}[type="checkbox"]`);
    return Array.from(checkboxes);
  };

  // Helper: Check a checkbox if not already checked
  const checkCheckbox = (checkbox, label) => {
    if (!checkbox) {
      warn(`${label} checkbox not found`);
      return false;
    }

    if (!checkbox.checked) {
      checkbox.click();
      log(`${label} checkbox checked ✓`);
      return true;
    }

    log(`${label} checkbox already checked`);
    return false;
  };

  // Main: Execute auto-checkbox logic
  const executeAutoCheckbox = () => {
    if (hasExecuted) {
      log('Already executed, skipping');
      return;
    }

    if (!isRecordingDialogVisible()) {
      return;
    }

    log('Recording dialog detected');
    hasExecuted = true;

    const allCheckboxes = getAllCheckboxes();

    if (allCheckboxes.length === 0) {
      warn(`No checkboxes found with class: ${CONFIG.selectors.checkboxClass}`);
      hasExecuted = false; // Reset so the next mutation can retry
      return;
    }

    log(`Found ${allCheckboxes.length} checkbox(es)`);

    if (allCheckboxes.length > CONFIG.indices.transcriptionCheckbox) {
      checkCheckbox(allCheckboxes[CONFIG.indices.transcriptionCheckbox], 'Transcription');
    } else {
      warn(`Transcription checkbox not found at index ${CONFIG.indices.transcriptionCheckbox}`);
    }

    if (allCheckboxes.length > CONFIG.indices.geminiCheckbox) {
      checkCheckbox(allCheckboxes[CONFIG.indices.geminiCheckbox], 'Gemini');
    } else {
      warn(`Gemini checkbox not found at index ${CONFIG.indices.geminiCheckbox}`);
    }

    log('Auto-checkbox execution completed. You can now manually click the start recording button.');

    observer.disconnect();
    log('Observer disconnected');
  };

  // Debounced execution to avoid excessive checks
  const debouncedExecute = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(executeAutoCheckbox, CONFIG.timings.debounceDelay);
  };

  // MutationObserver setup
  const observer = new MutationObserver(() => debouncedExecute());

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true
  });

  log('Script initialized. Watching for recording dialog...');

  // Timeout: Disconnect after specified time if dialog never appears
  setTimeout(() => {
    if (!hasExecuted) {
      observer.disconnect();
      log('Recording dialog not detected within timeout period. This may occur if you are not the meeting owner or do not have recording permissions.');
    }
  }, CONFIG.timings.observerTimeout);
})();
