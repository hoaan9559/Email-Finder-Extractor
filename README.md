# Email Dork Extractor 📧

A powerful Chrome extension that automates email extraction using Google Dork techniques. Built with a modern, minimalist dark theme interface for efficient lead generation and research.

## 🚀 Features

- **🔍 Advanced Google Dork Integration**: Leverage powerful search operators to find targeted email addresses
- **📊 Real-time Progress Tracking**: Monitor extraction progress with live stats and progress bar
- **🎨 Modern Dark Theme**: Clean, professional interface optimized for extended use
- **⚡ Smart Extraction**: Automatically processes multiple search result pages
- **🛡️ Duplicate Protection**: Filters out duplicate emails and common false positives
- **💾 Auto-Save Functionality**: Preserves extracted emails and settings across sessions
- **🚦 Rate Limiting**: Built-in delays to prevent being blocked by search engines
- **📱 Responsive Design**: Works seamlessly in the extension popup

## 🛠️ Installation

### Method 1: Install from Source (Recommended for Development)

1. **Download the Extension**:
   ```bash
   git clone https://github.com/yourusername/email-dork-extractor.git
   cd email-dork-extractor
   ```

2. **Load in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked" 
   - Select the extension folder
   - The extension icon will appear in your toolbar

### Method 2: Chrome Web Store
*Coming soon - Extension is under review*

## 📖 Usage

### Basic Usage

1. **Click the Extension Icon** in your Chrome toolbar
2. **Enter your Google Dork query** in the search field:
   ```
   Examples:
   • "contact us" email site:example.com
   • "email" OR "contact" filetype:pdf site:linkedin.com
   • "@gmail.com" OR "@yahoo.com" "marketing manager"
   ```
3. **Set Maximum Pages** to search (1-50 pages)
4. **Click "Start"** to begin extraction
5. **Monitor Progress** in real-time
6. **View Results** in the output area below

### Advanced Dork Examples

```bash
# Find contact emails on specific domains
"contact" OR "reach us" email site:target-domain.com

# Extract emails from PDF documents
"@company.com" filetype:pdf

# Find marketing contacts
"marketing" OR "sales" email "@gmail.com"

# Search specific file types
"contact" email filetype:doc OR filetype:pdf

# Industry-specific searches
"hr" OR "human resources" email site:*.edu

# Social media profiles with emails
site:twitter.com "@gmail.com" OR "@yahoo.com"
```

## 🎯 Use Cases

- **Lead Generation**: Find potential customers and business contacts
- **Market Research**: Analyze competitor contact information
- **Outreach Campaigns**: Build targeted email lists for marketing
- **Business Development**: Discover key personnel at target companies
- **Academic Research**: Collect contact information for surveys or studies

## 🔧 Technical Details

### Architecture
- **Manifest Version**: 3 (Latest Chrome Extension Standard)
- **Core Technologies**: Vanilla JavaScript, CSS3, HTML5
- **Storage**: Chrome Local Storage API
- **Permissions**: Active Tab, Storage, Google.com host permissions

### File Structure
```
email-dork-extractor/
├── manifest.json          # Extension configuration
├── popup.html             # Main interface
├── popup.js              # UI logic and extraction controller
├── content.js            # Email extraction from pages
├── background.js         # Service worker
└── README.md            # This file
```

### Key Components

1. **popup.js**: Main controller handling UI interactions and orchestrating the extraction process
2. **content.js**: Injected script that extracts emails from Google search result pages
3. **background.js**: Service worker for handling inter-script communication
4. **manifest.json**: Extension configuration with required permissions

## 🛡️ Privacy & Security

- **Local Storage Only**: All extracted emails are stored locally on your device
- **No External Servers**: No data is sent to external servers or third parties
- **Respectful Extraction**: Built-in rate limiting to avoid overwhelming servers
- **User Control**: Full control over what gets extracted and stored

## ⚙️ Configuration

The extension automatically saves your settings including:
- Last used Google Dork query
- Maximum pages preference  
- Previously extracted emails

## 🚨 Important Notes

### Legal Compliance
- Always respect robots.txt files
- Follow website terms of service
- Comply with GDPR and data protection regulations
- Use extracted emails responsibly and ethically
- Consider obtaining consent before sending marketing emails

### Rate Limiting
The extension includes built-in delays between requests to:
- Prevent being blocked by Google
- Reduce server load
- Maintain ethical scraping practices

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature-name`
3. **Make your changes** and test thoroughly
4. **Commit your changes**: `git commit -m 'Add some feature'`
5. **Push to the branch**: `git push origin feature-name`
6. **Submit a Pull Request**

## 🐛 Bug Reports & Feature Requests

Please use the [GitHub Issues](https://github.com/hoaan9559/email-dork-extractor/issues) page to:
- Report bugs
- Request new features
- Ask questions
- Provide feedback

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⭐ Support

If you find this extension helpful, please:
- ⭐ Star this repository
- 🐛 Report any issues you encounter
- 💡 Suggest improvements
- 📢 Share with others who might find it useful

## 🔮 Roadmap

- [ ] Export functionality (CSV, JSON formats)
- [ ] Email validation and verification
- [ ] Custom search filters
- [ ] Batch processing capabilities
- [ ] Integration with popular CRM systems
- [ ] Chrome Web Store publication
- [ ] Analytics and reporting features

---

**Disclaimer**: This tool is for educational and legitimate business purposes only. Users are responsible for complying with applicable laws and website terms of service. Always use responsibly and ethically.
