/* ============================================
   HTML Entities Tool Script
   ============================================ */

const HtmlEntities = {
	entities: [
		{ symbol: '<', code: '&lt;', name: 'Less Than' },
		{ symbol: '>', code: '&gt;', name: 'Greater Than' },
		{ symbol: '&', code: '&amp;', name: 'Ampersand' },
		{ symbol: '"', code: '&quot;', name: 'Quotation Mark' },
		{ symbol: '\'', code: '&apos;', name: 'Apostrophe' },
		{ symbol: '©', code: '&copy;', name: 'Copyright' },
		{ symbol: '®', code: '&reg;', name: 'Registered' },
		{ symbol: '™', code: '&trade;', name: 'Trademark' },
		{ symbol: '€', code: '&euro;', name: 'Euro' },
		{ symbol: '£', code: '&pound;', name: 'Pound' },
		{ symbol: '¥', code: '&yen;', name: 'Yen' },
		{ symbol: '¢', code: '&cent;', name: 'Cent' },
		{ symbol: '§', code: '&sect;', name: 'Section' },
		{ symbol: '¶', code: '&para;', name: 'Paragraph' },
		{ symbol: '†', code: '&dagger;', name: 'Dagger' },
		{ symbol: '‡', code: '&Dagger;', name: 'Double Dagger' },
		{ symbol: '•', code: '&bull;', name: 'Bullet' },
		{ symbol: '…', code: '&hellip;', name: 'Ellipsis' },
		{ symbol: '—', code: '&mdash;', name: 'Em Dash' },
		{ symbol: '–', code: '&ndash;', name: 'En Dash' },
		{ symbol: '°', code: '&deg;', name: 'Degree' },
		{ symbol: '±', code: '&plusmn;', name: 'Plus Minus' },
		{ symbol: '×', code: '&times;', name: 'Multiply' },
		{ symbol: '÷', code: '&divide;', name: 'Divide' },
		{ symbol: '√', code: '&radic;', name: 'Square Root' },
		{ symbol: '∞', code: '&infin;', name: 'Infinity' },
		{ symbol: 'π', code: '&pi;', name: 'Pi' },
		{ symbol: 'Δ', code: '&Delta;', name: 'Delta' },
		{ symbol: 'Ω', code: '&Omega;', name: 'Omega' },
		{ symbol: 'µ', code: '&micro;', name: 'Micro' },
		{ symbol: '←', code: '&larr;', name: 'Left Arrow' },
		{ symbol: '→', code: '&rarr;', name: 'Right Arrow' },
		{ symbol: '↑', code: '&uarr;', name: 'Up Arrow' },
		{ symbol: '↓', code: '&darr;', name: 'Down Arrow' },
		{ symbol: '♥', code: '&hearts;', name: 'Heart' },
		{ symbol: '♦', code: '&diams;', name: 'Diamond' },
		{ symbol: '♣', code: '&clubs;', name: 'Club' },
		{ symbol: '♠', code: '&spades;', name: 'Spade' },
	],

	init() {
		const container = document.getElementById('entities-container');
		if (!container) return;

		this.renderEntities(container);
	},

	renderEntities(container) {
		container.innerHTML = '';

		this.entities.forEach(item => {
			const entityEl = document.createElement('div');
			entityEl.className = 'symbol-item';
			entityEl.innerHTML = `
				<span class="symbol">${item.symbol}</span>
				<span class="code">${item.code}</span>
			`;
			entityEl.addEventListener('click', () => {
				navigator.clipboard.writeText(item.code);
				if (ui && ui.notify) {
					ui.notify(`<i>📋</i> ${item.code} copied!`);
				}
			});
			container.appendChild(entityEl);
		});
	}
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => HtmlEntities.init());
} else {
	HtmlEntities.init();
}
