/* ============================================
   Symbols & Emojis Tool Script
   ============================================ */

const SymbolsEmojis = {
	currentCategory: 'all',
	searchQuery: '',
	symbolsData: {},
	emojisData: null,

	async init() {
		const container = document.getElementById('symbols-container');
		const searchInput = document.getElementById('symbol-search');
		const categoryBtns = document.querySelectorAll('.category-btn');
		
		if (!container) return;

		// Load symbol data from JSON files
		await this.loadSymbolData();
		
		// Load emoji data from emoji.json
		if (window.DataLoader) {
			this.emojisData = await DataLoader.load('emoji.json');
		}

		this.renderSymbols(container);

		// Search functionality
		if (searchInput) {
			searchInput.addEventListener('input', (e) => {
				this.searchQuery = e.target.value.toLowerCase();
				this.renderSymbols(container);
			});
		}

		// Category filtering
		categoryBtns.forEach(btn => {
			btn.addEventListener('click', () => {
				// Update active state
				categoryBtns.forEach(b => b.classList.remove('active'));
				btn.classList.add('active');
				
				// Update current category
				this.currentCategory = btn.dataset.category;
				this.renderSymbols(container);
			});
		});
	},

	async loadSymbolData() {
		const categories = ['currency', 'math', 'arrows', 'punctuation', 'technical'];
		
		for (const category of categories) {
			try {
				const response = await fetch(`/data/symbols-${category}.json`);
				if (response.ok) {
					this.symbolsData[category] = await response.json();
				}
			} catch (error) {
				console.error(`Error loading ${category} symbols:`, error);
				this.symbolsData[category] = [];
			}
		}
	},

	getFilteredSymbols() {
		let symbols = [];

		// Get symbols for current category
		if (this.currentCategory === 'all') {
			// Combine all symbol categories
			Object.values(this.symbolsData).forEach(categorySymbols => {
				if (categorySymbols.currency) {
					symbols = symbols.concat(categorySymbols.currency);
				} else {
					symbols = symbols.concat(categorySymbols);
				}
			});
			
			// Add emojis
			if (this.emojisData) {
				const emojiSymbols = Object.keys(this.emojisData).slice(0, 20).map(symbol => ({
					symbol,
					name: this.emojisData[symbol].name
				}));
				symbols = symbols.concat(emojiSymbols);
			}
		} else if (this.currentCategory === 'emoji') {
			// Get emojis from emoji.json
			if (this.emojisData) {
				symbols = Object.keys(this.emojisData).slice(0, 50).map(symbol => ({
					symbol,
					name: this.emojisData[symbol].name
				}));
			}
		} else {
			// Get specific category
			const categoryData = this.symbolsData[this.currentCategory];
			if (categoryData) {
				symbols = categoryData.currency || categoryData;
			}
		}

		// Apply search filter
		if (this.searchQuery) {
			symbols = symbols.filter(item => 
				item.name.toLowerCase().includes(this.searchQuery)
			);
		}

		return symbols;
	},

	renderSymbols(container) {
		const symbols = this.getFilteredSymbols();
		container.innerHTML = '';

		if (symbols.length === 0) {
			container.innerHTML = '<p style="color: var(--gray); grid-column: 1/-1;">No symbols found.</p>';
			return;
		}

		symbols.forEach(item => {
			const symbolEl = document.createElement('div');
			symbolEl.className = 'symbol-item';
			symbolEl.innerHTML = `
				<span class="symbol">${item.symbol}</span>
				<span class="code">${item.name}</span>
			`;
			symbolEl.addEventListener('click', () => {
				navigator.clipboard.writeText(item.symbol);
				if (ui && ui.notify) {
					ui.notify(`<i>📋</i> ${item.symbol} copied!`);
				}
			});
			container.appendChild(symbolEl);
		});
	}
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => SymbolsEmojis.init());
} else {
	SymbolsEmojis.init();
}
