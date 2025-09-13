// Content script for extracting emails from Google search results
class GoogleEmailExtractor {
    constructor() {
        this.emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        this.setupMessageListener();
    }

    setupMessageListener() {
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.action === 'extractEmails') {
                this.extractEmailsFromPage()
                    .then(emails => {
                        sendResponse({ success: true, emails });
                        // Also send to popup
                        chrome.runtime.sendMessage({ 
                            type: 'emails_extracted', 
                            emails: emails 
                        });
                    })
                    .catch(error => {
                        console.error('Email extraction error:', error);
                        sendResponse({ success: false, error: error.message });
                    });
                return true; // Keep message channel open for async response
            }
        });
    }

    async extractEmailsFromPage() {
        const emails = new Set();

        try {
            // Wait a bit for page to fully load
            await this.delay(1000);

            // Extract emails from search results
            this.extractFromSearchResults(emails);
            
            // Extract emails from snippets and cached pages
            this.extractFromSnippets(emails);
            
            // Extract emails from any visible text
            this.extractFromPageText(emails);

            console.log(`Found ${emails.size} emails on current page`);
            return Array.from(emails);

        } catch (error) {
            console.error('Error extracting emails:', error);
            return [];
        }
    }

    extractFromSearchResults(emails) {
        // Look for emails in search result links and titles
        const searchResults = document.querySelectorAll('div[data-header-feature], .g, .MjjYud');
        
        searchResults.forEach(result => {
            const text = result.innerText || result.textContent || '';
            const matches = text.match(this.emailRegex);
            if (matches) {
                matches.forEach(email => emails.add(email.toLowerCase()));
            }

            // Check href attributes for mailto links
            const links = result.querySelectorAll('a[href*="mailto:"]');
            links.forEach(link => {
                const href = link.getAttribute('href');
                const emailMatch = href.match(/mailto:([^?&]+)/);
                if (emailMatch) {
                    emails.add(emailMatch[1].toLowerCase());
                }
            });
        });
    }

    extractFromSnippets(emails) {
        // Look for emails in search result snippets
        const snippets = document.querySelectorAll('.VwiC3b, .s3v9rd, .hgKElc, .IsZvec');
        
        snippets.forEach(snippet => {
            const text = snippet.innerText || snippet.textContent || '';
            const matches = text.match(this.emailRegex);
            if (matches) {
                matches.forEach(email => emails.add(email.toLowerCase()));
            }
        });
    }

    extractFromPageText(emails) {
        // Extract from any visible text on the page
        const textElements = document.querySelectorAll('p, div, span, td, th, li');
        
        textElements.forEach(element => {
            // Skip if element is not visible
            if (element.offsetParent === null) return;
            
            const text = element.innerText || element.textContent || '';
            const matches = text.match(this.emailRegex);
            if (matches) {
                matches.forEach(email => {
                    // Filter out common false positives
                    if (this.isValidEmail(email)) {
                        emails.add(email.toLowerCase());
                    }
                });
            }
        });
    }

    isValidEmail(email) {
        // Filter out common false positives
        const commonFalsePositives = [
            'example@example.com',
            'user@example.com',
            'admin@localhost',
            'test@test.com',
            'no-reply@google.com',
            'noreply@google.com'
        ];

        const lowercaseEmail = email.toLowerCase();
        
        // Skip common false positives
        if (commonFalsePositives.includes(lowercaseEmail)) {
            return false;
        }

        // Skip emails with common placeholder domains
        const placeholderDomains = ['example.com', 'test.com', 'localhost', 'domain.com'];
        const domain = email.split('@')[1];
        if (placeholderDomains.includes(domain)) {
            return false;
        }

        // Basic email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email) && email.length < 254;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the extractor when the script loads
const extractor = new GoogleEmailExtractor();