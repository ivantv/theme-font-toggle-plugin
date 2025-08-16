/**
 * Theme & Font Toggle Plugin
 * A lightweight JavaScript plugin for managing theme and font preferences
 * with local storage persistence and system preference detection.
 */

class ThemeFontToggle {
    constructor(options = {}) {
        // Default configuration
        this.config = {
            themeSelector: '#theme-toggle',
            fontSelector: '#font-toggle',
            fontSizeSelector: '#font-size-toggle',
            storagePrefix: 'theme-font-toggle',
            defaultTheme: 'light',
            defaultFont: 'system',
            defaultFontSize: 'medium',
            autoDetectSystemTheme: true,
            ...options
        };

        // Storage keys
        this.storageKeys = {
            theme: `${this.config.storagePrefix}-theme`,
            font: `${this.config.storagePrefix}-font`,
            fontSize: `${this.config.storagePrefix}-font-size`
        };

        // Initialize the plugin
        this.init();
    }

    /**
     * Initialize the plugin
     */
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    /**
     * Setup the plugin after DOM is ready
     */
    setup() {
        // Get DOM elements
        this.themeSelector = document.querySelector(this.config.themeSelector);
        this.fontSelector = document.querySelector(this.config.fontSelector);
        this.fontSizeSelector = document.querySelector(this.config.fontSizeSelector);

        // Load saved preferences or defaults
        this.loadPreferences();

        // Set up event listeners
        this.setupEventListeners();

        // Listen for system theme changes
        if (this.config.autoDetectSystemTheme) {
            this.setupSystemThemeListener();
        }

        // Apply initial settings
        this.applySettings();

        // Dispatch initialization event
        this.dispatchEvent('initialized', {
            theme: this.currentTheme,
            font: this.currentFont,
            fontSize: this.currentFontSize
        });
    }

    /**
     * Load preferences from localStorage or use defaults
     */
    loadPreferences() {
        this.currentTheme = this.getStoredValue('theme') || this.config.defaultTheme;
        this.currentFont = this.getStoredValue('font') || this.config.defaultFont;
        this.currentFontSize = this.getStoredValue('fontSize') || this.config.defaultFontSize;
    }

    /**
     * Get stored value from localStorage
     */
    getStoredValue(key) {
        try {
            return localStorage.getItem(this.storageKeys[key]);
        } catch (error) {
            console.warn('ThemeFontToggle: localStorage not available', error);
            return null;
        }
    }

    /**
     * Store value in localStorage
     */
    setStoredValue(key, value) {
        try {
            localStorage.setItem(this.storageKeys[key], value);
        } catch (error) {
            console.warn('ThemeFontToggle: localStorage not available', error);
        }
    }

    /**
     * Setup event listeners for the selectors
     */
    setupEventListeners() {
        if (this.themeSelector) {
            this.themeSelector.addEventListener('change', (e) => {
                this.setTheme(e.target.value);
            });
        }

        if (this.fontSelector) {
            this.fontSelector.addEventListener('change', (e) => {
                this.setFont(e.target.value);
            });
        }

        if (this.fontSizeSelector) {
            this.fontSizeSelector.addEventListener('change', (e) => {
                this.setFontSize(e.target.value);
            });
        }
    }

    /**
     * Setup system theme change listener
     */
    setupSystemThemeListener() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', () => {
                if (this.currentTheme === 'auto') {
                    this.applyTheme('auto');
                }
            });
        }
    }

    /**
     * Set theme and save to localStorage
     */
    setTheme(theme) {
        this.currentTheme = theme;
        this.setStoredValue('theme', theme);
        this.applyTheme(theme);
        this.updateSelector(this.themeSelector, theme);
        
        this.dispatchEvent('themeChanged', {
            theme: theme,
            font: this.currentFont,
            fontSize: this.currentFontSize
        });
    }

    /**
     * Set font and save to localStorage
     */
    setFont(font) {
        this.currentFont = font;
        this.setStoredValue('font', font);
        this.applyFont(font);
        this.updateSelector(this.fontSelector, font);
        
        this.dispatchEvent('fontChanged', {
            theme: this.currentTheme,
            font: font,
            fontSize: this.currentFontSize
        });
    }

    /**
     * Set font size and save to localStorage
     */
    setFontSize(fontSize) {
        this.currentFontSize = fontSize;
        this.setStoredValue('fontSize', fontSize);
        this.applyFontSize(fontSize);
        this.updateSelector(this.fontSizeSelector, fontSize);
        
        this.dispatchEvent('fontSizeChanged', {
            theme: this.currentTheme,
            font: this.currentFont,
            fontSize: fontSize
        });
    }

    /**
     * Apply theme to the document
     */
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }

    /**
     * Apply font to the document
     */
    applyFont(font) {
        document.documentElement.setAttribute('data-font', font);
    }

    /**
     * Apply font size to the document
     */
    applyFontSize(fontSize) {
        document.documentElement.setAttribute('data-font-size', fontSize);
    }

    /**
     * Apply all current settings
     */
    applySettings() {
        this.applyTheme(this.currentTheme);
        this.applyFont(this.currentFont);
        this.applyFontSize(this.currentFontSize);
        
        // Update selector values
        this.updateSelector(this.themeSelector, this.currentTheme);
        this.updateSelector(this.fontSelector, this.currentFont);
        this.updateSelector(this.fontSizeSelector, this.currentFontSize);
    }

    /**
     * Update selector value
     */
    updateSelector(selector, value) {
        if (selector && selector.value !== value) {
            selector.value = value;
        }
    }

    /**
     * Get current theme
     */
    getTheme() {
        return this.currentTheme;
    }

    /**
     * Get current font
     */
    getFont() {
        return this.currentFont;
    }

    /**
     * Get current font size
     */
    getFontSize() {
        return this.currentFontSize;
    }

    /**
     * Get all current settings
     */
    getSettings() {
        return {
            theme: this.currentTheme,
            font: this.currentFont,
            fontSize: this.currentFontSize
        };
    }

    /**
     * Reset to default settings
     */
    reset() {
        this.setTheme(this.config.defaultTheme);
        this.setFont(this.config.defaultFont);
        this.setFontSize(this.config.defaultFontSize);
        
        this.dispatchEvent('reset', this.getSettings());
    }

    /**
     * Clear all stored preferences
     */
    clearStorage() {
        try {
            Object.values(this.storageKeys).forEach(key => {
                localStorage.removeItem(key);
            });
        } catch (error) {
            console.warn('ThemeFontToggle: Error clearing localStorage', error);
        }
        
        this.dispatchEvent('storageCleared', this.getSettings());
    }

    /**
     * Dispatch custom event
     */
    dispatchEvent(eventName, detail) {
        const event = new CustomEvent(`themeFontToggle:${eventName}`, {
            detail: detail,
            bubbles: true
        });
        document.dispatchEvent(event);
    }

    /**
     * Destroy the plugin instance
     */
    destroy() {
        // Remove event listeners
        if (this.themeSelector) {
            this.themeSelector.removeEventListener('change', this.setTheme);
        }
        if (this.fontSelector) {
            this.fontSelector.removeEventListener('change', this.setFont);
        }
        if (this.fontSizeSelector) {
            this.fontSizeSelector.removeEventListener('change', this.setFontSize);
        }

        // Clear references
        this.themeSelector = null;
        this.fontSelector = null;
        this.fontSizeSelector = null;

        this.dispatchEvent('destroyed', this.getSettings());
    }
}

// Auto-initialize if selectors are found
document.addEventListener('DOMContentLoaded', () => {
    const themeSelector = document.querySelector('#theme-toggle');
    const fontSelector = document.querySelector('#font-toggle');
    const fontSizeSelector = document.querySelector('#font-size-toggle');

    if (themeSelector || fontSelector || fontSizeSelector) {
        window.themeFontToggle = new ThemeFontToggle();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeFontToggle;
}

// AMD support
if (typeof define === 'function' && define.amd) {
    define([], function() {
        return ThemeFontToggle;
    });
}

// Global export
if (typeof window !== 'undefined') {
    window.ThemeFontToggle = ThemeFontToggle;
}

// Example usage and event listeners for demo
document.addEventListener('DOMContentLoaded', () => {
    // Listen for plugin events
    document.addEventListener('themeFontToggle:initialized', (e) => {
        console.log('Plugin initialized with settings:', e.detail);
    });

    document.addEventListener('themeFontToggle:themeChanged', (e) => {
        console.log('Theme changed:', e.detail);
    });

    document.addEventListener('themeFontToggle:fontChanged', (e) => {
        console.log('Font changed:', e.detail);
    });

    document.addEventListener('themeFontToggle:fontSizeChanged', (e) => {
        console.log('Font size changed:', e.detail);
    });

    // Add keyboard shortcuts (optional)
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Shift + T for theme toggle
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            if (window.themeFontToggle) {
                const currentTheme = window.themeFontToggle.getTheme();
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                window.themeFontToggle.setTheme(newTheme);
            }
        }
    });
});
