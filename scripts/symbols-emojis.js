/* ============================================
   Symbols & Emojis Tool Script
   ============================================ */

const SymbolsEmojis = {
	symbols: [
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
		{ symbol: '±', name: 'Plus Minus' },
		{ symbol: '×', name: 'Multiply' },
		{ symbol: '÷', name: 'Divide' },
		{ symbol: '√', name: 'Square Root' },
		{ symbol: '∞', name: 'Infinity' },
		{ symbol: '≠', name: 'Not Equal' },
		{ symbol: '≈', name: 'Approximately' },
		{ symbol: '≤', name: 'Less or Equal' },
		{ symbol: '≥', name: 'Greater or Equal' },
		{ symbol: '←', name: 'Left Arrow' },
		{ symbol: '→', name: 'Right Arrow' },
		{ symbol: '↑', name: 'Up Arrow' },
		{ symbol: '↓', name: 'Down Arrow' },
		{ symbol: '⇒', name: 'Double Right Arrow' },
		{ symbol: '∀', name: 'For All' },
		{ symbol: '∂', name: 'Partial' },
		{ symbol: '∃', name: 'Exists' },
		{ symbol: '∅', name: 'Empty Set' },
		{ symbol: '∈', name: 'Element of' },
		{ symbol: '∉', name: 'Not Element of' },
		{ symbol: '∑', name: 'Sum' },
		{ symbol: '∏', name: 'Product' },
		{ symbol: 'π', name: 'Pi' },
		{ symbol: 'Ω', name: 'Omega' },
		{ symbol: 'Δ', name: 'Delta' },
		{ symbol: 'Σ', name: 'Sigma' },
		{ symbol: 'µ', name: 'Micro' },
		{ symbol: '$', name: 'Dollar' },
		{ symbol: '€', name: 'Euro' },
		{ symbol: '£', name: 'Pound' },
		{ symbol: '¥', name: 'Yen' },
		{ symbol: '¢', name: 'Cent' },
		{ symbol: '₿', name: 'Bitcoin' },
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
		{ symbol: '📌', name: 'Pin' },
		{ symbol: '💡', name: 'Light Bulb' },
		{ symbol: '📝', name: 'Memo' },
		{ symbol: '🔗', name: 'Link' },
		{ symbol: '⚠️', name: 'Warning' },
		{ symbol: '📱', name: 'Phone' },
		{ symbol: '💻', name: 'Laptop' },
		{ symbol: '🖥️', name: 'Desktop' },
		{ symbol: '⌨️', name: 'Keyboard' },
		{ symbol: '🖱️', name: 'Mouse' },
	],

	init() {
		const container = document.getElementById('symbols-container');
		if (!container) return;

		this.renderSymbols(container);
	},

	renderSymbols(container) {
		container.innerHTML = '';

		this.symbols.forEach(item => {
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
