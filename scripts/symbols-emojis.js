/* ============================================
   Symbols & Emojis Tool Script
   ============================================ */

const SymbolsEmojis = {
	currentCategory: 'all',
	searchQuery: '',

	symbols: {
		currency: [
			{ symbol: '$', name: 'Dollar' },
			{ symbol: '€', name: 'Euro' },
			{ symbol: '£', name: 'Pound' },
			{ symbol: '¥', name: 'Yen' },
			{ symbol: '¢', name: 'Cent' },
			{ symbol: '₿', name: 'Bitcoin' },
			{ symbol: '₹', name: 'Rupee' },
			{ symbol: '₽', name: 'Ruble' },
			{ symbol: '₩', name: 'Won' },
			{ symbol: '₺', name: 'Lira' },
		],
		math: [
			{ symbol: '±', name: 'Plus Minus' },
			{ symbol: '×', name: 'Multiply' },
			{ symbol: '÷', name: 'Divide' },
			{ symbol: '√', name: 'Square Root' },
			{ symbol: '∞', name: 'Infinity' },
			{ symbol: '≠', name: 'Not Equal' },
			{ symbol: '≈', name: 'Approximately' },
			{ symbol: '≤', name: 'Less or Equal' },
			{ symbol: '≥', name: 'Greater or Equal' },
			{ symbol: 'π', name: 'Pi' },
			{ symbol: '∑', name: 'Sum' },
			{ symbol: '∏', name: 'Product' },
			{ symbol: '∂', name: 'Partial' },
			{ symbol: '∫', name: 'Integral' },
		],
		arrows: [
			{ symbol: '←', name: 'Left Arrow' },
			{ symbol: '→', name: 'Right Arrow' },
			{ symbol: '↑', name: 'Up Arrow' },
			{ symbol: '↓', name: 'Down Arrow' },
			{ symbol: '↔', name: 'Left Right Arrow' },
			{ symbol: '↕', name: 'Up Down Arrow' },
			{ symbol: '⇒', name: 'Double Right Arrow' },
			{ symbol: '⇐', name: 'Double Left Arrow' },
			{ symbol: '⇑', name: 'Double Up Arrow' },
			{ symbol: '⇓', name: 'Double Down Arrow' },
			{ symbol: '↗', name: 'North East Arrow' },
			{ symbol: '↘', name: 'South East Arrow' },
			{ symbol: '↙', name: 'South West Arrow' },
			{ symbol: '↖', name: 'North West Arrow' },
		],
		punctuation: [
			{ symbol: '©', name: 'Copyright' },
			{ symbol: '®', name: 'Registered' },
			{ symbol: '™', name: 'Trademark' },
			{ symbol: '§', name: 'Section' },
			{ symbol: '¶', name: 'Paragraph' },
			{ symbol: '†', name: 'Dagger' },
			{ symbol: '‡', name: 'Double Dagger' },
			{ symbol: '•', name: 'Bullet' },
			{ symbol: '…', name: 'Ellipsis' },
			{ symbol: '—', name: 'Em Dash' },
			{ symbol: '–', name: 'En Dash' },
			{ symbol: '°', name: 'Degree' },
		],
		technical: [
			{ symbol: '∀', name: 'For All' },
			{ symbol: '∃', name: 'Exists' },
			{ symbol: '∅', name: 'Empty Set' },
			{ symbol: '∈', name: 'Element of' },
			{ symbol: '∉', name: 'Not Element of' },
			{ symbol: 'Ω', name: 'Omega' },
			{ symbol: 'Δ', name: 'Delta' },
			{ symbol: 'Σ', name: 'Sigma' },
			{ symbol: 'µ', name: 'Micro' },
			{ symbol: '∆', name: 'Increment' },
			{ symbol: '∇', name: 'Nabla' },
			{ symbol: '√', name: 'Root' },
		],
		emoji: [
			{ symbol: '😀', name: 'Grinning Face' },
			{ symbol: '😂', name: 'Joy' },
			{ symbol: '🥰', name: 'Smiling Hearts' },
			{ symbol: '😍', name: 'Heart Eyes' },
			{ symbol: '🤔', name: 'Thinking' },
			{ symbol: '👍', name: 'Thumbs Up' },
			{ symbol: '👎', name: 'Thumbs Down' },
			{ symbol: '❤️', name: 'Heart' },
			{ symbol: '🔥', name: 'Fire' },
			{ symbol: '✨', name: 'Sparkles' },
			{ symbol: '🎉', name: 'Party' },
			{ symbol: '✅', name: 'Check Mark' },
			{ symbol: '❌', name: 'Cross Mark' },
			{ symbol: '⭐', name: 'Star' },
			{ symbol: '🌟', name: 'Glowing Star' },
			{ symbol: '💡', name: 'Light Bulb' },
			{ symbol: '📌', name: 'Pin' },
			{ symbol: '🔗', name: 'Link' },
			{ symbol: '⚠️', name: 'Warning' },
			{ symbol: '💻', name: 'Laptop' },
		]
	},

	init() {
		const container = document.getElementById('symbols-container');
		const searchInput = document.getElementById('symbol-search');
		const categoryBtns = document.querySelectorAll('.category-btn');
		
		if (!container) return;

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

	getFilteredSymbols() {
		let symbols = [];

		// Get symbols for current category
		if (this.currentCategory === 'all') {
			Object.values(this.symbols).forEach(category => {
				symbols = symbols.concat(category);
			});
		} else {
			symbols = this.symbols[this.currentCategory] || [];
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
