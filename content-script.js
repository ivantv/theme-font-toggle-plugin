/**
 * Chrome Extension Content Script
 * Applies theme and font changes to web pages
 */

// Initialize theme toggle for the current page
let pageThemeToggle = null;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeContentScript);
} else {
    initializeContentScript();
}

function initializeContentScript() {
    // Load saved preferences from Chrome storage
    chrome.storage.sync.get(['theme', 'font', 'fontSize'], (result) => {
        // Apply saved settings to the page
        if (result.theme) {
            applyTheme(result.theme);
        }
        if (result.font) {
            applyFont(result.font);
        }
        if (result.fontSize) {
            applyFontSize(result.fontSize);
        }
    });
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case 'setTheme':
            applyTheme(message.theme);
            sendResponse({ success: true });
            break;
            
        case 'setFont':
            applyFont(message.font);
            sendResponse({ success: true });
            break;
            
        case 'setFontSize':
            applyFontSize(message.fontSize);
            sendResponse({ success: true });
            break;
            
        case 'applySettings':
            if (message.settings) {
                if (message.settings.theme) applyTheme(message.settings.theme);
                if (message.settings.font) applyFont(message.settings.font);
                if (message.settings.fontSize) applyFontSize(message.settings.fontSize);
            }
            sendResponse({ success: true });
            break;
            
        default:
            sendResponse({ success: false, error: 'Unknown action' });
    }
});

// Apply theme to the current page
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Inject theme CSS if not already present
    if (!document.getElementById('theme-toggle-styles')) {
        injectThemeStyles();
    }
}

// Apply font to the current page
function applyFont(font) {
    document.documentElement.setAttribute('data-font', font);
}

// Apply font size to the current page
function applyFontSize(fontSize) {
    document.documentElement.setAttribute('data-font-size', fontSize);
}

// Inject theme styles into the page
function injectThemeStyles() {
    const styleElement = document.createElement('style');
    styleElement.id = 'theme-toggle-styles';
    styleElement.textContent = `
        /* Theme Toggle Extension Styles */
        :root {
            --bg-primary: #ffffff;
            --bg-secondary: #f8f9fa;
            --text-primary: #212529;
            --text-secondary: #6c757d;
            --border-color: #dee2e6;
            --accent-color: #007bff;
            --accent-hover: #0056b3;
            --shadow: rgba(0, 0, 0, 0.1);
            --font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            --font-size: 16px;
            --line-height: 1.6;
        }

        [data-theme="dark"] {
            --bg-primary: #1a1a1a !important;
            --bg-secondary: #2d2d2d !important;
            --text-primary: #ffffff !important;
            --text-secondary: #b0b0b0 !important;
            --border-color: #404040 !important;
            --accent-color: #4dabf7 !important;
            --accent-hover: #339af0 !important;
            --shadow: rgba(255, 255, 255, 0.1) !important;
        }

        @media (prefers-color-scheme: dark) {
            [data-theme="auto"] {
                --bg-primary: #1a1a1a !important;
                --bg-secondary: #2d2d2d !important;
                --text-primary: #ffffff !important;
                --text-secondary: #b0b0b0 !important;
                --border-color: #404040 !important;
                --accent-color: #4dabf7 !important;
                --accent-hover: #339af0 !important;
                --shadow: rgba(255, 255, 255, 0.1) !important;
            }
        }

        [data-font="system"] {
            --font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }

        [data-font="serif"] {
            --font-family: Georgia, 'Times New Roman', Times, serif !important;
        }

        [data-font="sans-serif"] {
            --font-family: Arial, Helvetica, sans-serif !important;
        }

        [data-font="monospace"] {
            --font-family: 'Courier New', Courier, monospace !important;
        }

        [data-font="cursive"] {
            --font-family: 'Brush Script MT', cursive !important;
        }

        [data-font-size="small"] {
            --font-size: 14px !important;
        }

        [data-font-size="medium"] {
            --font-size: 16px !important;
        }

        [data-font-size="large"] {
            --font-size: 18px !important;
        }

        [data-font-size="extra-large"] {
            --font-size: 20px !important;
        }

        /* Apply theme to body and common elements */
        body {
            background-color: var(--bg-primary) !important;
            color: var(--text-primary) !important;
            font-family: var(--font-family) !important;
            font-size: var(--font-size) !important;
            line-height: var(--line-height) !important;
            transition: all 0.3s ease !important;
        }

        /* Apply to common elements */
        div, p, span, h1, h2, h3, h4, h5, h6, article, section, main, aside, header, footer {
            color: var(--text-primary) !important;
            font-family: var(--font-family) !important;
        }

        /* Links */
        a {
            color: var(--accent-color) !important;
        }

        a:hover {
            color: var(--accent-hover) !important;
        }

        /* Form elements */
        input, textarea, select, button {
            background-color: var(--bg-secondary) !important;
            color: var(--text-primary) !important;
            border-color: var(--border-color) !important;
            font-family: var(--font-family) !important;
        }

        /* Cards and containers */
        .card, .container, .content, .main, .wrapper {
            background-color: var(--bg-primary) !important;
            color: var(--text-primary) !important;
        }
    `;
    
    document.head.appendChild(styleElement);
}

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync') {
        if (changes.theme) {
            applyTheme(changes.theme.newValue);
        }
        if (changes.font) {
            applyFont(changes.font.newValue);
        }
        if (changes.fontSize) {
            applyFontSize(changes.fontSize.newValue);
        }
    }
});
