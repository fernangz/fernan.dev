/* ============================================
   Symbols & Emojis Tool Script
   Loads symbols from JSON files and renders them in a grid
   Supports search, category filtering, and clipboard copy
   ============================================ */

const SymbolsEmojis = {
	// Store all loaded data
	data: {
		emojis: {},
		symbols: {}
	},
	
	// Current filter state
	state: {
		category: 'all',
		searchQuery: ''
	},
	
	// DOM elements cache
	elements: {},
	
	/**
	 * Initialize the tool
	 * Loads data and sets up event listeners
	 */
	async init() {
		this.cacheElements();
		this.showLoading(true);
		
		try {
			// Load emoji and symbol data in parallel
			await Promise.all([
				this.loadEmojis(),
				this.loadSymbols()
			]);
			
			this.setupEventListeners();
			this.render();
		} catch (error) {
			console.error('Error loading data:', error);
			this.showError('Failed to load symbols and emojis');
		} finally {
			this.showLoading(false);
		}
	},
	
	/**
	 * Cache DOM elements for performance
	 */
	cacheElements() {
		this.elements = {
			container: document.getElementById('symbols-container'),
			searchInput: document.getElementById('symbol-search'),
			searchCount: document.getElementById('search-count'),
			categoryTabs: document.getElementById('category-tabs'),
			loadingState: document.getElementById('loading-state')
		};
	},
	
	/**
	 * Load emoji data from JSON file
	 */
	async loadEmojis() {
		try {
			this.data.emojis = await DataLoader.load('emoji.json');
		} catch (error) {
			console.error('Error loading emojis:', error);
			this.data.emojis = {};
		}
	},
	
	/**
	 * Load symbol data from JSON file
	 */
	async loadSymbols() {
		try {
			this.data.symbols = await DataLoader.load('symbols.json');
		} catch (error) {
			console.error('Error loading symbols:', error);
			this.data.symbols = {};
		}
	},
	
	/**
	 * Set up event listeners for search and category tabs
	 */
	setupEventListeners() {
		// Search input
		if (this.elements.searchInput) {
			this.elements.searchInput.addEventListener('input', (e) => {
				this.state.searchQuery = e.target.value.toLowerCase();
				this.render();
			});
		}
		
		// Category tabs
		if (this.elements.categoryTabs) {
			this.elements.categoryTabs.addEventListener('click', (e) => {
				if (e.target.classList.contains('tab-btn')) {
					// Update active tab
					this.elements.categoryTabs.querySelectorAll('.tab-btn').forEach(btn => {
						btn.classList.remove('active');
					});
					e.target.classList.add('active');
					
					// Update state and render
					this.state.category = e.target.dataset.category;
					this.render();
				}
			});
		}
	},
	
	/**
	 * Get filtered items based on current state
	 * @returns {Array} Array of symbol/emoji objects
	 */
	getFilteredItems() {
		const items = [];
		const { category, searchQuery } = this.state;
		
		// Add emojis if category is 'all' or 'emoji'
		if (category === 'all' || category === 'emoji') {
			Object.entries(this.data.emojis || {}).forEach(([symbol, data]) => {
				if (this.matchesFilter(symbol, data, searchQuery)) {
					items.push({ symbol, ...data, type: 'emoji' });
				}
			});
		}
		
		// Add symbols if category is 'all' or matches specific category
		if (category === 'all' || (category !== 'emoji' && this.data.symbols[category])) {
			const categories = category === 'all' 
				? Object.keys(this.data.symbols) 
				: [category];
			
			categories.forEach(cat => {
				Object.entries(this.data.symbols[cat] || {}).forEach(([symbol, data]) => {
					if (this.matchesFilter(symbol, data, searchQuery)) {
						items.push({ symbol, ...data, type: 'symbol' });
					}
				});
			});
		}
		
		return items;
	},
	
	/**
	 * Check if an item matches the current filter
	 * @param {string} symbol - The symbol character
	 * @param {object} data - The symbol/emoji data
	 * @param {string} query - The search query
	 * @returns {boolean} True if item matches filter
	 */
	matchesFilter(symbol, data, query) {
		if (!query) return true;
		
		const name = (data.name || '').toLowerCase();
		const group = (data.group || '').toLowerCase();
		
		return name.includes(query) || 
		       group.includes(query) || 
		       symbol.includes(query);
	},
	
	/**
	 * Render the symbols grid
	 */
	render() {
		const items = this.getFilteredItems();
		
		// Update count
		if (this.elements.searchCount) {
			this.elements.searchCount.textContent = `${items.length} item${items.length !== 1 ? 's' : ''} found`;
		}
		
		// Clear container
		this.elements.container.innerHTML = '';
		
		// Show empty state if no items
		if (items.length === 0) {
			this.elements.container.innerHTML = `
				<div class="empty-state">
					<p>No symbols found matching your criteria.</p>
				</div>
			`;
			return;
		}
		
		// Create document fragment for better performance
		const fragment = document.createDocumentFragment();
		
		// Render each item
		items.forEach(item => {
			const card = this.createSymbolCard(item);
			fragment.appendChild(card);
		});
		
		this.elements.container.appendChild(fragment);
	},
	
	/**
	 * Create a symbol card element
	 * @param {object} item - The symbol/emoji data
	 * @returns {HTMLElement} The card element
	 */
	createSymbolCard(item) {
		const card = document.createElement('div');
		card.className = 'symbol-card';
		card.setAttribute('tabindex', '0');
		card.setAttribute('role', 'button');
		card.setAttribute('aria-label', `Copy ${item.name}`);
		
		card.innerHTML = `
			<span class="symbol">${item.symbol}</span>
			<span class="name">${item.name}</span>
			<span class="group">${item.group}</span>
		`;
		
		// Click to copy
		card.addEventListener('click', () => {
			this.copyToClipboard(item.symbol, item.name);
		});
		
		// Keyboard support
		card.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				this.copyToClipboard(item.symbol, item.name);
			}
		});
		
		return card;
	},
	
	/**
	 * Copy text to clipboard with feedback
	 * @param {string} text - The text to copy
	 * @param {string} name - The name for feedback message
	 */
	copyToClipboard(text, name) {
		navigator.clipboard.writeText(text).then(() => {
			if (ui && ui.notify) {
				ui.notify(`<i>📋</i> ${name} copied!`);
			}
		}).catch((err) => {
			console.error('Failed to copy:', err);
			// Fallback for older browsers
			const textArea = document.createElement('textarea');
			textArea.value = text;
			document.body.appendChild(textArea);
			textArea.select();
			document.execCommand('copy');
			document.body.removeChild(textArea);
			if (ui && ui.notify) {
				ui.notify(`<i>📋</i> ${name} copied!`);
			}
		});
	},
	
	/**
	 * Show/hide loading state
	 * @param {boolean} show - Whether to show loading
	 */
	showLoading(show) {
		if (this.elements.loadingState) {
			this.elements.loadingState.classList.toggle('visible', show);
		}
		if (this.elements.container) {
			this.elements.container.style.display = show ? 'none' : 'grid';
		}
	},
	
	/**
	 * Show error message
	 * @param {string} message - The error message
	 */
	showError(message) {
		if (this.elements.container) {
			this.elements.container.innerHTML = `
				<div class="empty-state">
					<p>${message}</p>
				</div>
			`;
		}
		this.showLoading(false);
	}
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => SymbolsEmojis.init());
} else {
	SymbolsEmojis.init();
}
