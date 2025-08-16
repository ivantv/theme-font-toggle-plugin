/**
 * Chrome Extension Popup Script
 * Handles communication between popup and content scripts
 */

// Extension-specific functionality
document.addEventListener('DOMContentLoaded', () => {
    // Get current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        
        // Load saved preferences from Chrome storage
        chrome.storage.sync.get(['theme', 'font', 'fontSize'], (result) => {
            if (result.theme) {
                const themeSelector = document.getElementById('theme-toggle');
                if (themeSelector) themeSelector.value = result.theme;
            }
            if (result.font) {
                const fontSelector = document.getElementById('font-toggle');
                if (fontSelector) fontSelector.value = result.font;
            }
            if (result.fontSize) {
                const fontSizeSelector = document.getElementById('font-size-toggle');
                if (fontSizeSelector) fontSizeSelector.value = result.fontSize;
            }
            
            // Apply settings to popup
            if (window.themeFontToggle) {
                window.themeFontToggle.applySettings();
            }
        });
    });
    
    // Listen for changes and apply to current tab
    document.addEventListener('themeFontToggle:themeChanged', (e) => {
        // Save to Chrome storage
        chrome.storage.sync.set({ theme: e.detail.theme });
        
        // Apply to current tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'setTheme',
                theme: e.detail.theme
            });
        });
    });
    
    document.addEventListener('themeFontToggle:fontChanged', (e) => {
        // Save to Chrome storage
        chrome.storage.sync.set({ font: e.detail.font });
        
        // Apply to current tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'setFont',
                font: e.detail.font
            });
        });
    });
    
    document.addEventListener('themeFontToggle:fontSizeChanged', (e) => {
        // Save to Chrome storage
        chrome.storage.sync.set({ fontSize: e.detail.fontSize });
        
        // Apply to current tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: 'setFontSize',
                fontSize: e.detail.fontSize
            });
        });
    });
});

// Apply settings to all tabs button (optional)
function applyToAllTabs() {
    chrome.tabs.query({}, (tabs) => {
        const settings = window.themeFontToggle ? window.themeFontToggle.getSettings() : {};
        
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, {
                action: 'applySettings',
                settings: settings
            }).catch(() => {
                // Ignore errors for tabs that can't receive messages
            });
        });
    });
}

// Add apply to all tabs button functionality
document.addEventListener('DOMContentLoaded', () => {
    // Create apply to all button
    const controlsDiv = document.querySelector('.plugin-controls');
    if (controlsDiv) {
        const applyButton = document.createElement('button');
        applyButton.textContent = 'Apply to All Tabs';
        applyButton.className = 'apply-all-btn';
        applyButton.style.cssText = `
            width: 100%;
            padding: 8px 12px;
            margin-top: 10px;
            background-color: var(--accent-color);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-family: var(--font-family);
            transition: background-color 0.3s ease;
        `;
        
        applyButton.addEventListener('click', applyToAllTabs);
        applyButton.addEventListener('mouseover', () => {
            applyButton.style.backgroundColor = 'var(--accent-hover)';
        });
        applyButton.addEventListener('mouseout', () => {
            applyButton.style.backgroundColor = 'var(--accent-color)';
        });
        
        controlsDiv.appendChild(applyButton);
    }
});
