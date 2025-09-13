class EmailExtractor {
    constructor() {
        this.isRunning = false;
        this.shouldStop = false;
        this.emails = new Set();
        this.currentPage = 0;
        this.totalPages = 0;
        
        this.initializeElements();
        this.setupEventListeners();
        this.loadSavedData();
    }

    initializeElements() {
        this.form = document.getElementById('extractorForm');
        this.dorkInput = document.getElementById('dork');
        this.maxPagesInput = document.getElementById('maxPages');
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.status = document.getElementById('status');
        this.output = document.getElementById('output');
        this.clearBtn = document.getElementById('clearBtn');
        this.progressContainer = document.getElementById('progressContainer');
        this.progressBar = document.getElementById('progressBar');
        this.stats = document.getElementById('stats');
        this.emailCount = document.getElementById('emailCount');
        this.currentPageSpan = document.getElementById('currentPage');
        this.totalPagesSpan = document.getElementById('totalPages');
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleStart(e));
        this.stopBtn.addEventListener('click', () => this.handleStop());
        this.clearBtn.addEventListener('click', () => this.clearEmails());

        // Listen for messages from content script
        chrome.runtime.onMessage.addListener((message) => {
            if (message.type === 'emails_extracted') {
                this.handleExtractedEmails(message.emails);
            }
        });
    }

    async loadSavedData() {
        try {
            const result = await chrome.storage.local.get(['extractedEmails', 'dork', 'maxPages']);
            
            if (result.extractedEmails) {
                result.extractedEmails.forEach(email => this.emails.add(email));
                this.updateDisplay();
            }
            
            if (result.dork) this.dorkInput.value = result.dork;
            if (result.maxPages) this.maxPagesInput.value = result.maxPages;
        } catch (error) {
            console.error('Error loading saved data:', error);
        }
    }

    async saveData() {
        try {
            await chrome.storage.local.set({
                extractedEmails: Array.from(this.emails),
                dork: this.dorkInput.value,
                maxPages: this.maxPagesInput.value
            });
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }

    async handleStart(e) {
        e.preventDefault();
        
        if (this.isRunning) return;

        const dork = this.dorkInput.value.trim();
        const maxPages = parseInt(this.maxPagesInput.value);

        if (!dork || maxPages < 1) {
            this.updateStatus('Please enter valid dork and max pages', 'error');
            return;
        }

        this.isRunning = true;
        this.shouldStop = false;
        this.currentPage = 0;
        this.totalPages = maxPages;

        this.startBtn.disabled = true;
        this.stopBtn.disabled = false;
        this.progressContainer.style.display = 'block';
        this.stats.style.display = 'flex';

        this.updateStatus('Starting extraction...', 'running');
        await this.saveData();

        try {
            await this.extractEmails(dork, maxPages);
        } catch (error) {
            console.error('Extraction error:', error);
            this.updateStatus('Error during extraction', 'error');
        } finally {
            this.handleStop();
        }
    }

    handleStop() {
        this.shouldStop = true;
        this.isRunning = false;
        
        this.startBtn.disabled = false;
        this.stopBtn.disabled = true;
        this.progressContainer.style.display = 'none';
        
        this.updateStatus(`Stopped. Found ${this.emails.size} emails`, 'stopped');
    }

    async extractEmails(dork, maxPages) {
        for (let page = 0; page < maxPages && !this.shouldStop; page++) {
            this.currentPage = page + 1;
            this.updateProgress();
            this.updateStatus(`Searching page ${this.currentPage}...`, 'running');

            try {
                // Create search URL
                const searchUrl = this.buildSearchUrl(dork, page);
                
                // Get current tab
                const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
                const currentTab = tabs[0];

                // Navigate to search results
                await chrome.tabs.update(currentTab.id, { url: searchUrl });
                
                // Wait for page to load
                await this.waitForPageLoad(currentTab.id);
                
                // Extract emails from current page
                await chrome.tabs.sendMessage(currentTab.id, { 
                    action: 'extractEmails' 
                });

                // Wait between requests to avoid rate limiting
                if (page < maxPages - 1 && !this.shouldStop) {
                    await this.delay(2000);
                }
                
            } catch (error) {
                console.error(`Error on page ${page + 1}:`, error);
                this.updateStatus(`Error on page ${page + 1}`, 'error');
                await this.delay(1000);
            }
        }

        if (!this.shouldStop) {
            this.updateStatus(`Completed. Found ${this.emails.size} emails`, 'completed');
        }
    }

    buildSearchUrl(dork, page) {
        const start = page * 10;
        const encodedDork = encodeURIComponent(dork);
        return `https://www.google.com/search?q=${encodedDork}&start=${start}`;
    }

    async waitForPageLoad(tabId) {
        return new Promise((resolve) => {
            const checkLoaded = () => {
                chrome.tabs.get(tabId, (tab) => {
                    if (tab.status === 'complete') {
                        resolve();
                    } else {
                        setTimeout(checkLoaded, 500);
                    }
                });
            };
            checkLoaded();
        });
    }

    handleExtractedEmails(newEmails) {
        let addedCount = 0;
        newEmails.forEach(email => {
            if (!this.emails.has(email)) {
                this.emails.add(email);
                addedCount++;
            }
        });

        if (addedCount > 0) {
            this.updateDisplay();
            this.saveData();
        }
    }

    updateDisplay() {
        this.output.innerHTML = '';
        Array.from(this.emails).forEach(email => {
            const emailDiv = document.createElement('div');
            emailDiv.className = 'email-item';
            emailDiv.textContent = email;
            this.output.appendChild(emailDiv);
        });

        this.emailCount.textContent = this.emails.size;
        
        // Scroll to bottom
        this.output.scrollTop = this.output.scrollHeight;
    }

    updateProgress() {
        const progress = (this.currentPage / this.totalPages) * 100;
        this.progressBar.style.width = `${progress}%`;
        this.currentPageSpan.textContent = this.currentPage;
        this.totalPagesSpan.textContent = this.totalPages;
    }

    updateStatus(message, type = 'normal') {
        this.status.textContent = message;
        this.status.className = `status ${type}`;
    }

    clearEmails() {
        this.emails.clear();
        this.output.innerHTML = '';
        this.emailCount.textContent = '0';
        this.saveData();
        this.updateStatus('Emails cleared', 'normal');
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EmailExtractor();
});