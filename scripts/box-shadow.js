/* ============================================
   Box Shadow Generator Script
   ============================================ */

const BoxShadowGenerator = {
	values: {
		offsetX: 0,
		offsetY: 0,
		blur: 0,
		spread: 0,
		color: '#000000',
		opacity: 30,
		inset: false
	},

	init() {
		this.elements = {
			previewBox: document.getElementById('preview-box'),
			offsetX: document.getElementById('offset-x'),
			offsetY: document.getElementById('offset-y'),
			blur: document.getElementById('blur'),
			spread: document.getElementById('spread'),
			color: document.getElementById('shadow-color'),
			opacity: document.getElementById('opacity'),
			inset: document.getElementById('inset'),
			output: document.getElementById('css-output'),
			copyBtn: document.getElementById('copy-btn'),
			values: {
				offsetX: document.getElementById('offset-x-value'),
				offsetY: document.getElementById('offset-y-value'),
				blur: document.getElementById('blur-value'),
				spread: document.getElementById('spread-value'),
				opacity: document.getElementById('opacity-value')
			}
		};

		this.bindEvents();
		this.update();
	},

	bindEvents() {
		this.elements.offsetX.addEventListener('input', (e) => {
			this.values.offsetX = parseInt(e.target.value);
			this.elements.values.offsetX.textContent = `${this.values.offsetX}px`;
			this.update();
		});

		this.elements.offsetY.addEventListener('input', (e) => {
			this.values.offsetY = parseInt(e.target.value);
			this.elements.values.offsetY.textContent = `${this.values.offsetY}px`;
			this.update();
		});

		this.elements.blur.addEventListener('input', (e) => {
			this.values.blur = parseInt(e.target.value);
			this.elements.values.blur.textContent = `${this.values.blur}px`;
			this.update();
		});

		this.elements.spread.addEventListener('input', (e) => {
			this.values.spread = parseInt(e.target.value);
			this.elements.values.spread.textContent = `${this.values.spread}px`;
			this.update();
		});

		this.elements.color.addEventListener('input', (e) => {
			this.values.color = e.target.value;
			this.update();
		});

		this.elements.opacity.addEventListener('input', (e) => {
			this.values.opacity = parseInt(e.target.value);
			this.elements.values.opacity.textContent = `${this.values.opacity}%`;
			this.update();
		});

		this.elements.inset.addEventListener('change', (e) => {
			this.values.inset = e.target.checked;
			this.update();
		});

		this.elements.copyBtn.addEventListener('click', () => {
			navigator.clipboard.writeText(this.elements.output.textContent);
			if (ui && ui.notify) {
				ui.notify('<i>📋</i> CSS copied!');
			}
		});
	},

	update() {
		const rgba = this.hexToRgba(this.values.color, this.values.opacity / 100);
		const inset = this.values.inset ? 'inset ' : '';
		
		const shadow = `${inset}${this.values.offsetX}px ${this.values.offsetY}px ${this.values.blur}px ${this.values.spread}px ${rgba}`;
		
		this.elements.previewBox.style.boxShadow = shadow;
		this.elements.output.textContent = `box-shadow: ${shadow};`;
	},

	hexToRgba(hex, alpha) {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	}
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => BoxShadowGenerator.init());
} else {
	BoxShadowGenerator.init();
}
