/* ============================================
   HTML Entities Tool Script
   ============================================ */

const HtmlEntities = {
	searchQuery: '',

	entities: [
		// Basic HTML special characters
		{ symbol: '<', code: '&lt;', name: 'Less Than' },
		{ symbol: '>', code: '&gt;', name: 'Greater Than' },
		{ symbol: '&', code: '&amp;', name: 'Ampersand' },
		{ symbol: '"', code: '&quot;', name: 'Quotation Mark' },
		{ symbol: '\'', code: '&apos;', name: 'Apostrophe' },
		
		// Copyright and trademarks
		{ symbol: '©', code: '&copy;', name: 'Copyright' },
		{ symbol: '®', code: '&reg;', name: 'Registered' },
		{ symbol: '™', code: '&trade;', name: 'Trademark' },
		
		// Currency
		{ symbol: '€', code: '&euro;', name: 'Euro' },
		{ symbol: '£', code: '&pound;', name: 'Pound' },
		{ symbol: '¥', code: '&yen;', name: 'Yen' },
		{ symbol: '¢', code: '&cent;', name: 'Cent' },
		
		// Punctuation
		{ symbol: '§', code: '&sect;', name: 'Section' },
		{ symbol: '¶', code: '&para;', name: 'Paragraph' },
		{ symbol: '†', code: '&dagger;', name: 'Dagger' },
		{ symbol: '‡', code: '&Dagger;', name: 'Double Dagger' },
		{ symbol: '•', code: '&bull;', name: 'Bullet' },
		{ symbol: '…', code: '&hellip;', name: 'Ellipsis' },
		{ symbol: '—', code: '&mdash;', name: 'Em Dash' },
		{ symbol: '–', code: '&ndash;', name: 'En Dash' },
		
		// Mathematical
		{ symbol: '°', code: '&deg;', name: 'Degree' },
		{ symbol: '±', code: '&plusmn;', name: 'Plus Minus' },
		{ symbol: '×', code: '&times;', name: 'Multiply' },
		{ symbol: '÷', code: '&divide;', name: 'Divide' },
		{ symbol: '√', code: '&radic;', name: 'Square Root' },
		{ symbol: '∞', code: '&infin;', name: 'Infinity' },
		{ symbol: 'π', code: '&pi;', name: 'Pi' },
		{ symbol: '∆', code: '&Delta;', name: 'Delta' },
		{ symbol: 'Ω', code: '&Omega;', name: 'Omega' },
		{ symbol: 'µ', code: '&micro;', name: 'Micro' },
		
		// Arrows
		{ symbol: '←', code: '&larr;', name: 'Left Arrow' },
		{ symbol: '→', code: '&rarr;', name: 'Right Arrow' },
		{ symbol: '↑', code: '&uarr;', name: 'Up Arrow' },
		{ symbol: '↓', code: '&darr;', name: 'Down Arrow' },
		
		// Card suits
		{ symbol: '♥', code: '&hearts;', name: 'Heart' },
		{ symbol: '♦', code: '&diams;', name: 'Diamond' },
		{ symbol: '♣', code: '&clubs;', name: 'Club' },
		{ symbol: '♠', code: '&spades;', name: 'Spade' },
		
		// Greek letters (uppercase)
		{ symbol: 'Α', code: '&Alpha;', name: 'Alpha' },
		{ symbol: 'Β', code: '&Beta;', name: 'Beta' },
		{ symbol: 'Γ', code: '&Gamma;', name: 'Gamma' },
		{ symbol: 'Δ', code: '&Delta;', name: 'Delta' },
		{ symbol: 'Ε', code: '&Epsilon;', name: 'Epsilon' },
		{ symbol: 'Ζ', code: '&Zeta;', name: 'Zeta' },
		{ symbol: 'Η', code: '&Eta;', name: 'Eta' },
		{ symbol: 'Θ', code: '&Theta;', name: 'Theta' },
		{ symbol: 'Ι', code: '&Iota;', name: 'Iota' },
		{ symbol: 'Κ', code: '&Kappa;', name: 'Kappa' },
		{ symbol: 'Λ', code: '&Lambda;', name: 'Lambda' },
		{ symbol: 'Μ', code: '&Mu;', name: 'Mu' },
		{ symbol: 'Ν', code: '&Nu;', name: 'Nu' },
		{ symbol: 'Ξ', code: '&Xi;', name: 'Xi' },
		{ symbol: 'Ο', code: '&Omicron;', name: 'Omicron' },
		{ symbol: 'Π', code: '&Pi;', name: 'Pi' },
		{ symbol: 'Ρ', code: '&Rho;', name: 'Rho' },
		{ symbol: 'Σ', code: '&Sigma;', name: 'Sigma' },
		{ symbol: 'Τ', code: '&Tau;', name: 'Tau' },
		{ symbol: 'Υ', code: '&Upsilon;', name: 'Upsilon' },
		{ symbol: 'Φ', code: '&Phi;', name: 'Phi' },
		{ symbol: 'Χ', code: '&Chi;', name: 'Chi' },
		{ symbol: 'Ψ', code: '&Psi;', name: 'Psi' },
		{ symbol: 'Ω', code: '&Omega;', name: 'Omega' },
		
		// Greek letters (lowercase)
		{ symbol: 'α', code: '&alpha;', name: 'alpha' },
		{ symbol: 'β', code: '&beta;', name: 'beta' },
		{ symbol: 'γ', code: '&gamma;', name: 'gamma' },
		{ symbol: 'δ', code: '&delta;', name: 'delta' },
		{ symbol: 'ε', code: '&epsilon;', name: 'epsilon' },
		{ symbol: 'ζ', code: '&zeta;', name: 'zeta' },
		{ symbol: 'η', code: '&eta;', name: 'eta' },
		{ symbol: 'θ', code: '&theta;', name: 'theta' },
		{ symbol: 'ι', code: '&iota;', name: 'iota' },
		{ symbol: 'κ', code: '&kappa;', name: 'kappa' },
		{ symbol: 'λ', code: '&lambda;', name: 'lambda' },
		{ symbol: 'μ', code: '&mu;', name: 'mu' },
		{ symbol: 'ν', code: '&nu;', name: 'nu' },
		{ symbol: 'ξ', code: '&xi;', name: 'xi' },
		{ symbol: 'ο', code: '&omicron;', name: 'omicron' },
		{ symbol: 'π', code: '&pi;', name: 'pi' },
		{ symbol: 'ρ', code: '&rho;', name: 'rho' },
		{ symbol: 'ς', code: '&sigmaf;', name: 'sigmaf' },
		{ symbol: 'σ', code: '&sigma;', name: 'sigma' },
		{ symbol: 'τ', code: '&tau;', name: 'tau' },
		{ symbol: 'υ', code: '&upsilon;', name: 'upsilon' },
		{ symbol: 'φ', code: '&phi;', name: 'phi' },
		{ symbol: 'χ', code: '&chi;', name: 'chi' },
		{ symbol: 'ψ', code: '&psi;', name: 'psi' },
		{ symbol: 'ω', code: '&omega;', name: 'omega' },
	],

	init() {
		const container = document.getElementById('entities-container');
		const searchInput = document.getElementById('entity-search');
		if (!container) return;

		this.renderEntities(container);

		if (searchInput) {
			searchInput.addEventListener('input', (e) => {
				this.searchQuery = e.target.value.toLowerCase();
				this.renderEntities(container);
			});
		}
	},

	renderEntities(container) {
		container.innerHTML = '';
		
		let filtered = this.entities;
		
		if (this.searchQuery) {
			filtered = this.entities.filter(item => 
				item.name.toLowerCase().includes(this.searchQuery) ||
				item.symbol.includes(this.searchQuery) ||
				item.code.toLowerCase().includes(this.searchQuery)
			);
		}

		if (filtered.length === 0) {
			container.innerHTML = '<p style="color: var(--gray); grid-column: 1/-1;">No entities found.</p>';
			return;
		}

		filtered.forEach(item => {
			const entityEl = document.createElement('div');
			entityEl.className = 'symbol-item';
			entityEl.innerHTML = `
				<div class="symbol-row">
					<span class="symbol">${item.symbol}</span>
					<span class="name">${item.name}</span>
				</div>
				<pre>${this.escapeHtml(item.code)}</pre>
			`;
			entityEl.addEventListener('click', () => {
				navigator.clipboard.writeText(item.code).then(() => {
					if (ui && ui.notify) {
						ui.notify(`<i>📋</i> ${item.code} copied!`);
					}
				}).catch(() => {
					// Fallback
					const textArea = document.createElement('textarea');
					textArea.value = item.code;
					document.body.appendChild(textArea);
					textArea.select();
					document.execCommand('copy');
					document.body.removeChild(textArea);
					if (ui && ui.notify) {
						ui.notify(`<i>📋</i> ${item.code} copied!`);
					}
				});
			});
			container.appendChild(entityEl);
		});
	},

	escapeHtml(text) {
		const div = document.createElement('div');
		div.textContent = text;
		return div.innerHTML;
	}
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => HtmlEntities.init());
} else {
	HtmlEntities.init();
}
