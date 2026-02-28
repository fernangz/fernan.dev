/* ============================================
   CSS Unit Converter Script
   ============================================ */

const UnitConverter = {
	settings: {
		baseSize: 16,
		parentSize: 16,
		viewportWidth: 1920,
		viewportHeight: 1080
	},

	init() {
		this.elements = {
			settings: {
				baseSize: document.getElementById('base-size'),
				parentSize: document.getElementById('parent-size'),
				viewportWidth: document.getElementById('viewport-width'),
				viewportHeight: document.getElementById('viewport-height')
			},
			input: {
				value: document.getElementById('input-value'),
				unit: document.getElementById('input-unit')
			},
			results: {
				px: document.getElementById('result-px'),
				rem: document.getElementById('result-rem'),
				em: document.getElementById('result-em'),
				vh: document.getElementById('result-vh'),
				vw: document.getElementById('result-vw'),
				percent: document.getElementById('result-percent')
			}
		};

		this.bindEvents();
		this.convert();
	},

	bindEvents() {
		// Settings
		Object.keys(this.elements.settings).forEach(key => {
			this.elements.settings[key].addEventListener('input', () => {
				this.settings[key] = parseFloat(this.elements.settings[key].value);
				this.convert();
			});
		});

		// Input
		this.elements.input.value.addEventListener('input', () => this.convert());
		this.elements.input.unit.addEventListener('change', () => this.convert());
	},

	convert() {
		// Update settings
		this.settings.baseSize = parseFloat(this.elements.settings.baseSize.value);
		this.settings.parentSize = parseFloat(this.elements.settings.parentSize.value);
		this.settings.viewportWidth = parseFloat(this.elements.settings.viewportWidth.value);
		this.settings.viewportHeight = parseFloat(this.elements.settings.viewportHeight.value);

		const value = parseFloat(this.elements.input.value.value);
		const unit = this.elements.input.unit.value;

		// Convert to px first
		let pxValue;
		switch (unit) {
			case 'px': pxValue = value; break;
			case 'rem': pxValue = value * this.settings.baseSize; break;
			case 'em': pxValue = value * this.settings.parentSize; break;
			case 'vh': pxValue = (value / 100) * this.settings.viewportHeight; break;
			case 'vw': pxValue = (value / 100) * this.settings.viewportWidth; break;
			case '%': pxValue = (value / 100) * this.settings.parentSize; break;
			default: pxValue = value;
		}

		// Convert from px to all units
		this.elements.results.px.textContent = `${this.round(pxValue)}px`;
		this.elements.results.rem.textContent = `${this.round(pxValue / this.settings.baseSize)}rem`;
		this.elements.results.em.textContent = `${this.round(pxValue / this.settings.parentSize)}em`;
		this.elements.results.vh.textContent = `${this.round((pxValue / this.settings.viewportHeight) * 100)}vh`;
		this.elements.results.vw.textContent = `${this.round((pxValue / this.settings.viewportWidth) * 100)}vw`;
		this.elements.results.percent.textContent = `${this.round((pxValue / this.settings.parentSize) * 100)}%`;
	},

	round(value) {
		return Math.round(value * 100) / 100;
	}
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => UnitConverter.init());
} else {
	UnitConverter.init();
}
