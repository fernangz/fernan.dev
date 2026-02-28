/* ============================================
   Contrast Checker Tool Script
   ============================================ */

const ContrastChecker = {
	foreground: '#000000',
	background: '#ffffff',

	init() {
		this.elements = {
			foregroundPicker: document.getElementById('foreground-color'),
			foregroundText: document.getElementById('foreground-text'),
			backgroundPicker: document.getElementById('background-color'),
			backgroundText: document.getElementById('background-text'),
			previewBox: document.getElementById('preview-box'),
			previewText: document.getElementById('preview-text'),
			results: {
				normal: {
					ratio: document.getElementById('ratio-normal'),
					status: document.getElementById('status-normal')
				},
				large: {
					ratio: document.getElementById('ratio-large'),
					status: document.getElementById('status-large')
				},
				ui: {
					ratio: document.getElementById('ratio-ui'),
					status: document.getElementById('status-ui')
				}
			}
		};

		this.bindEvents();
		this.update();
	},

	bindEvents() {
		// Foreground color
		this.elements.foregroundPicker.addEventListener('input', (e) => {
			this.setForegroundColor(e.target.value);
		});

		this.elements.foregroundText.addEventListener('input', (e) => {
			const hex = this.normalizeHex(e.target.value);
			if (this.isValidHex(hex)) {
				this.setForegroundColor(hex);
			}
		});

		// Background color
		this.elements.backgroundPicker.addEventListener('input', (e) => {
			this.setBackgroundColor(e.target.value);
		});

		this.elements.backgroundText.addEventListener('input', (e) => {
			const hex = this.normalizeHex(e.target.value);
			if (this.isValidHex(hex)) {
				this.setBackgroundColor(hex);
			}
		});
	},

	setForegroundColor(hex) {
		this.foreground = hex;
		this.elements.foregroundPicker.value = hex;
		this.elements.foregroundText.value = hex;
		this.update();
	},

	setBackgroundColor(hex) {
		this.background = hex;
		this.elements.backgroundPicker.value = hex;
		this.elements.backgroundText.value = hex;
		this.update();
	},

	update() {
		// Update preview
		this.elements.previewBox.style.backgroundColor = this.background;
		this.elements.previewText.style.color = this.foreground;

		// Calculate and display ratio
		const ratio = this.calculateContrastRatio(this.foreground, this.background);
		const ratioFormatted = ratio.toFixed(2);

		// Update all result cards
		this.updateResult('normal', ratio, ratioFormatted, 4.5, 7);
		this.updateResult('large', ratio, ratioFormatted, 3, 4.5);
		this.updateResult('ui', ratio, ratioFormatted, 3, 3);
	},

	updateResult(type, ratio, ratioFormatted, aaThreshold, aaaThreshold) {
		const result = this.elements.results[type];
		result.ratio.textContent = `${ratioFormatted}:1`;

		let badgeClass, badgeText;
		if (ratio >= aaaThreshold) {
			badgeClass = 'pass-aaa';
			badgeText = 'AAA Pass';
		} else if (ratio >= aaThreshold) {
			badgeClass = 'pass-aa';
			badgeText = 'AA Pass';
		} else {
			badgeClass = 'fail';
			badgeText = 'Fail';
		}

		result.status.innerHTML = `<span class="badge ${badgeClass}">${badgeText}</span>`;
	},

	calculateContrastRatio(color1, color2) {
		const l1 = this.getRelativeLuminance(color1);
		const l2 = this.getRelativeLuminance(color2);
		const lighter = Math.max(l1, l2);
		const darker = Math.min(l1, l2);
		return (lighter + 0.05) / (darker + 0.05);
	},

	getRelativeLuminance(hex) {
		const rgb = this.hexToRgb(hex);
		const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(v => {
			v = v / 255;
			return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
		});
		return 0.2126 * r + 0.7152 * g + 0.0722 * b;
	},

	hexToRgb(hex) {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : { r: 0, g: 0, b: 0 };
	},

	normalizeHex(hex) {
		hex = hex.trim();
		if (!hex.startsWith('#')) {
			hex = '#' + hex;
		}
		return hex;
	},

	isValidHex(hex) {
		return /^#[0-9A-F]{6}$/i.test(hex);
	}
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => ContrastChecker.init());
} else {
	ContrastChecker.init();
}
