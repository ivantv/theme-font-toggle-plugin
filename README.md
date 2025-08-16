# Theme & Font Toggle Plugin

A lightweight, customizable JavaScript plugin for managing theme and font preferences with local storage persistence and system preference detection.

## Features

- ✅ **Theme Support**: Light, Dark, and Auto (system preference) themes
- ✅ **Font Families**: System default, Serif, Sans-serif, Monospace, and Cursive
- ✅ **Font Sizes**: Small, Medium, Large, and Extra Large
- ✅ **Local Storage**: Automatically saves and restores user preferences
- ✅ **System Integration**: Auto-detects system dark/light mode preference
- ✅ **Accessibility**: Full keyboard navigation and screen reader support
- ✅ **Responsive**: Works on all device sizes
- ✅ **Events**: Custom events for integration with other components
- ✅ **No Dependencies**: Pure vanilla JavaScript

## Quick Start

1. Include the CSS and JavaScript files in your HTML:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="theme-font-toggle.css">
</head>
<body>
    <!-- Your content here -->
    
    <!-- Plugin controls -->
    <select id="theme-toggle">
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="auto">Auto</option>
    </select>
    
    <select id="font-toggle">
        <option value="system">System Default</option>
        <option value="serif">Serif</option>
        <option value="sans-serif">Sans Serif</option>
        <option value="monospace">Monospace</option>
        <option value="cursive">Cursive</option>
    </select>
    
    <select id="font-size-toggle">
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
        <option value="extra-large">Extra Large</option>
    </select>
    
    <script src="theme-font-toggle.js"></script>
</body>
</html>
```

2. The plugin will automatically initialize when the DOM is ready if it finds the default selectors.

## Advanced Usage

### Manual Initialization

```javascript
// Initialize with custom options
const plugin = new ThemeFontToggle({
    themeSelector: '#my-theme-selector',
    fontSelector: '#my-font-selector',
    fontSizeSelector: '#my-font-size-selector',
    defaultTheme: 'dark',
    defaultFont: 'serif',
    defaultFontSize: 'large'
});
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `themeSelector` | string | `'#theme-toggle'` | CSS selector for theme dropdown |
| `fontSelector` | string | `'#font-toggle'` | CSS selector for font dropdown |
| `fontSizeSelector` | string | `'#font-size-toggle'` | CSS selector for font size dropdown |
| `storagePrefix` | string | `'theme-font-toggle'` | Prefix for localStorage keys |
| `defaultTheme` | string | `'light'` | Default theme (`'light'`, `'dark'`, `'auto'`) |
| `defaultFont` | string | `'system'` | Default font family |
| `defaultFontSize` | string | `'medium'` | Default font size |
| `autoDetectSystemTheme` | boolean | `true` | Enable system theme detection |

### API Methods

```javascript
const plugin = new ThemeFontToggle();

// Get current settings
plugin.getTheme();        // Returns current theme
plugin.getFont();         // Returns current font
plugin.getFontSize();     // Returns current font size
plugin.getSettings();     // Returns all settings object

// Set preferences programmatically
plugin.setTheme('dark');
plugin.setFont('serif');
plugin.setFontSize('large');

// Reset to defaults
plugin.reset();

// Clear stored preferences
plugin.clearStorage();

// Destroy plugin instance
plugin.destroy();
```

### Events

The plugin dispatches custom events that you can listen for:

```javascript
// Plugin initialized
document.addEventListener('themeFontToggle:initialized', (e) => {
    console.log('Settings:', e.detail);
});

// Theme changed
document.addEventListener('themeFontToggle:themeChanged', (e) => {
    console.log('New theme:', e.detail.theme);
});

// Font changed
document.addEventListener('themeFontToggle:fontChanged', (e) => {
    console.log('New font:', e.detail.font);
});

// Font size changed
document.addEventListener('themeFontToggle:fontSizeChanged', (e) => {
    console.log('New font size:', e.detail.fontSize);
});

// Settings reset
document.addEventListener('themeFontToggle:reset', (e) => {
    console.log('Settings reset to:', e.detail);
});
```

### Keyboard Shortcuts

- `Ctrl/Cmd + Shift + T`: Toggle between light and dark themes

## Customization

### CSS Custom Properties

The plugin uses CSS custom properties (variables) that you can override:

```css
:root {
    --bg-primary: #ffffff;
    --bg-secondary: #f8f9fa;
    --text-primary: #212529;
    --text-secondary: #6c757d;
    --border-color: #dee2e6;
    --accent-color: #007bff;
    --accent-hover: #0056b3;
    --shadow: rgba(0, 0, 0, 0.1);
    --font-family: system-ui, sans-serif;
    --font-size: 16px;
    --line-height: 1.6;
}
```

### Adding Custom Themes

You can add custom themes by defining new CSS rules:

```css
[data-theme="custom"] {
    --bg-primary: #your-color;
    --text-primary: #your-text-color;
    /* ... other properties */
}
```

Then add the option to your HTML:

```html
<select id="theme-toggle">
    <option value="light">Light</option>
    <option value="dark">Dark</option>
    <option value="custom">Custom</option>
</select>
```

### Adding Custom Fonts

Add new font options by defining CSS rules:

```css
[data-font="custom-font"] {
    --font-family: 'Your Custom Font', fallback, sans-serif;
}
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## File Structure

```
theme-font-toggle/
├── index.html              # Demo page
├── theme-font-toggle.css   # Plugin styles
├── theme-font-toggle.js    # Plugin JavaScript
└── README.md              # Documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use in personal and commercial projects.

## Changelog

### v1.0.0
- Initial release
- Theme switching (light/dark/auto)
- Font family selection
- Font size adjustment
- Local storage persistence
- System theme detection
- Accessibility features
- Custom events
- Keyboard shortcuts
