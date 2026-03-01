/* ============================================
   Color Tools Script
   Mobile-first color converter, contrast checker, and palette generator
   ============================================ */

const ColorTools = {
	currentColor: '#3498db',
	fgColor: '#000000',
	bgColor: '#ffffff',

	init() {
		this.cacheElements();
		this.bindEvents();
		this.updateColorTrigger('color-trigger-fill', this.currentColor);
		this.updateContrast();
	},

	cacheElements() {
		this.elements = {
			// Color picker
			colorInput: document.getElementById('color-input'),
			colorTrigger: document.getElementById('color-trigger'),
			colorTriggerFill: document.getElementById('color-trigger-fill'),
			
			// Color formats
			hexInput: document.getElementById('hex-input'),
			rgbInput: document.getElementById('rgb-input'),
			hslInput: document.getElementById('hsl-input'),
			hsvInput: document.getElementById('hsv-input'),
			
			// Contrast checker
			fgColor: document.getElementById('fg-color'),
			fgTrigger: document.getElementById('fg-trigger'),
			fgTriggerFill: document.getElementById('fg-trigger-fill'),
			fgText: document.getElementById('fg-text'),
			bgColor: document.getElementById('bg-color'),
			bgTrigger: document.getElementById('bg-trigger'),
			bgTriggerFill: document.getElementById('bg-trigger-fill'),
			bgText: document.getElementById('bg-text'),
			previewBox: document.getElementById('preview-box'),
			previewText: document.getElementById('preview-text'),
			ratioNormal: document.getElementById('ratio-normal'),
			ratioLarge: document.getElementById('ratio-large'),
			ratioUi: document.getElementById('ratio-ui'),
			statusNormal: document.getElementById('status-normal'),
			statusLarge: document.getElementById('status-large'),
			statusUi: document.getElementById('status-ui'),
			
			// Palette generator
			paletteContainer: document.getElementById('palette-container'),
			paletteBtns: document.querySelectorAll('.palette-btn')
		};
	},

	bindEvents() {
		// Main color picker trigger
		if (this.elements.colorTrigger && this.elements.colorInput) {
			this.elements.colorTrigger.addEventListener('click', () => {
				this.elements.colorInput.click();
			});
			
			this.elements.colorInput.addEventListener('input', (e) => {
				this.currentColor = e.target.value;
				this.updateColorTrigger('color-trigger-fill', this.currentColor);
				this.updateColorFormats(this.currentColor);
			});
		}

		// Contrast checker foreground trigger
		if (this.elements.fgTrigger && this.elements.fgColor) {
			this.elements.fgTrigger.addEventListener('click', () => {
				this.elements.fgColor.click();
			});
			
			this.elements.fgColor.addEventListener('input', (e) => {
				this.fgColor = e.target.value;
				this.updateColorTrigger('fg-trigger-fill', this.fgColor);
				if (this.elements.fgText) this.elements.fgText.value = this.fgColor;
				this.updateContrast();
			});
		}
		
		if (this.elements.fgText) {
			this.elements.fgText.addEventListener('input', (e) => {
				const hex = this.normalizeHex(e.target.value);
				if (this.isValidHex(hex)) {
					this.fgColor = hex;
					this.updateColorTrigger('fg-trigger-fill', hex);
					if (this.elements.fgColor) this.elements.fgColor.value = hex;
					this.updateContrast();
				}
			});
		}
		
		// Contrast checker background trigger
		if (this.elements.bgTrigger && this.elements.bgColor) {
			this.elements.bgTrigger.addEventListener('click', () => {
				this.elements.bgColor.click();
			});
			
			this.elements.bgColor.addEventListener('input', (e) => {
				this.bgColor = e.target.value;
				this.updateColorTrigger('bg-trigger-fill', this.bgColor);
				if (this.elements.bgText) this.elements.bgText.value = this.bgColor;
				this.updateContrast();
			});
		}
		
		if (this.elements.bgText) {
			this.elements.bgText.addEventListener('input', (e) => {
				const hex = this.normalizeHex(e.target.value);
				if (this.isValidHex(hex)) {
					this.bgColor = hex;
					this.updateColorTrigger('bg-trigger-fill', hex);
					if (this.elements.bgColor) this.elements.bgColor.value = hex;
					this.updateContrast();
				}
			});
		}

		// Color format inputs
		this.bindFormatInput('hexInput', this.hexToRgb, this.hexToHsl, this.hexToHsv);
		this.bindFormatInput('rgbInput', this.rgbToHex, this.rgbToHsl, this.rgbToHsv);
		this.bindFormatInput('hslInput', this.hslToHex, this.hslToRgb, this.hslToHsv);
		this.bindFormatInput('hsvInput', this.hsvToHex, this.hsvToRgb, this.hsvToHsl);

		// Copy buttons
		document.querySelectorAll('.copy-btn').forEach(btn => {
			btn.addEventListener('click', () => {
				const target = document.getElementById(btn.dataset.target);
				if (target) {
					navigator.clipboard.writeText(target.value);
					if (ui && ui.notify) {
						ui.notify(`<i>📋</i> ${target.value} copied!`);
					}
				}
			});
		});

		// Palette buttons
		this.elements.paletteBtns.forEach(btn => {
			btn.addEventListener('click', () => {
				this.elements.paletteBtns.forEach(b => b.classList.remove('active'));
				btn.classList.add('active');
				this.generatePalette(btn.dataset.palette);
			});
		});

		// Initialize first palette
		this.generatePalette('analogous');
	},

	bindFormatInput(elementName, toHex, ...otherConverters) {
		const input = this.elements[elementName];
		if (!input) return;

		input.addEventListener('input', (e) => {
			let value = e.target.value;
			let hex = null;

			if (elementName === 'hexInput') {
				if (!value.startsWith('#')) value = '#' + value;
				if (this.isValidHex(value)) hex = value;
			} else {
				hex = toHex.call(this, value);
			}

			if (hex) {
				this.currentColor = hex;
				this.updateColorTrigger('color-trigger-fill', hex);
				this.updateColorFormats(hex);
			}
		});
	},

	updateColorTrigger(elementId, color) {
		const element = document.getElementById(elementId);
		if (element) {
			element.style.backgroundColor = color;
		}
	},

	updateColorFormats(hex) {
		this.currentColor = hex;

		if (this.elements.hexInput) this.elements.hexInput.value = hex;
		if (this.elements.rgbInput) this.elements.rgbInput.value = this.hexToRgb(hex);
		if (this.elements.hslInput) this.elements.hslInput.value = this.hexToHsl(hex);
		if (this.elements.hsvInput) this.elements.hsvInput.value = this.hexToHsv(hex);
	},

	updateContrast() {
		const ratio = this.calculateContrastRatio(this.fgColor, this.bgColor);
		const ratioFormatted = ratio.toFixed(2);

		// Update preview
		if (this.elements.previewBox) {
			this.elements.previewBox.style.backgroundColor = this.bgColor;
		}
		if (this.elements.previewText) {
			this.elements.previewText.style.color = this.fgColor;
		}

		// Update ratios
		if (this.elements.ratioNormal) this.elements.ratioNormal.textContent = `${ratioFormatted}:1`;
		if (this.elements.ratioLarge) this.elements.ratioLarge.textContent = `${ratioFormatted}:1`;
		if (this.elements.ratioUi) this.elements.ratioUi.textContent = `${ratioFormatted}:1`;

		// Update badges
		this.updateBadge(this.elements.statusNormal, ratio, 4.5, 7);
		this.updateBadge(this.elements.statusLarge, ratio, 3, 4.5);
		this.updateBadge(this.elements.statusUi, ratio, 3, 3);
	},

	updateBadge(container, ratio, aaThreshold, aaaThreshold) {
		if (!container) return;

		let className, text;
		if (ratio >= aaaThreshold) {
			className = 'pass-aaa';
			text = 'AAA Pass';
		} else if (ratio >= aaThreshold) {
			className = 'pass-aa';
			text = 'AA Pass';
		} else {
			className = 'fail';
			text = 'Fail';
		}

		container.innerHTML = `<span class="badge ${className}">${text}</span>`;
	},

	generatePalette(type) {
		if (!this.elements.paletteContainer) return;

		const colors = this.getPaletteColors(type, this.currentColor);
		
		this.elements.paletteContainer.innerHTML = colors.map(color => `
			<div class="color-box" style="background-color: ${color.hex}" data-color="${color.hex}">
				<span class="color-name">${color.name}</span>
				<span>${color.hex}</span>
			</div>
		`).join('');

		// Add click handlers
		this.elements.paletteContainer.querySelectorAll('.color-box').forEach(box => {
			box.addEventListener('click', () => {
				const color = box.dataset.color;
				navigator.clipboard.writeText(color);
				if (ui && ui.notify) {
					ui.notify(`<i>📋</i> ${color} copied!`);
				}
			});
		});
	},

	getPaletteColors(type, baseHex) {
		const hsl = this.hexToHsl(baseHex);
		const match = hsl.match(/(\d+)/);
		if (!match) return [];

		const hue = parseInt(match[1]);

		switch (type) {
			case 'analogous':
				return [
					{ hex: this.hslToHex(`hsl(${(hue - 30 + 360) % 360}, 70%, 50%)`), name: '-30°' },
					{ hex: this.hslToHex(`hsl(${(hue - 15 + 360) % 360}, 70%, 50%)`), name: '-15°' },
					{ hex: baseHex, name: 'Base' },
					{ hex: this.hslToHex(`hsl(${(hue + 15) % 360}, 70%, 50%)`), name: '+15°' },
					{ hex: this.hslToHex(`hsl(${(hue + 30) % 360}, 70%, 50%)`), name: '+30°' }
				];
			case 'complementary':
				return [
					{ hex: baseHex, name: 'Base' },
					{ hex: this.hslToHex(`hsl(${(hue + 180) % 360}, 70%, 50%)`), name: 'Complement' }
				];
			case 'triadic':
				return [
					{ hex: baseHex, name: 'Base' },
					{ hex: this.hslToHex(`hsl(${(hue + 120) % 360}, 70%, 50%)`), name: '+120°' },
					{ hex: this.hslToHex(`hsl(${(hue + 240) % 360}, 70%, 50%)`), name: '+240°' }
				];
			case 'split':
				return [
					{ hex: baseHex, name: 'Base' },
					{ hex: this.hslToHex(`hsl(${(hue + 150) % 360}, 70%, 50%)`), name: '+150°' },
					{ hex: this.hslToHex(`hsl(${(hue + 210) % 360}, 70%, 50%)`), name: '+210°' }
				];
			default:
				return [];
		}
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
		const match = rgb.match(/(\d+)/g);
		if (!match) return 0;

		const [r, g, b] = match.map(v => {
			v = parseInt(v) / 255;
			return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
		});

		return 0.2126 * r + 0.7152 * g + 0.0722 * b;
	},

	// Color conversion utilities
	hexToRgb(hex) {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : '';
	},

	rgbToHex(rgb) {
		const match = rgb.match(/(\d+)/g);
		if (!match) return '';
		return '#' + match.map(x => {
			const hex = parseInt(x).toString(16);
			return hex.length === 1 ? '0' + hex : hex;
		}).join('');
	},

	hexToHsl(hex) {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		if (!result) return '';

		let r = parseInt(result[1], 16) / 255;
		let g = parseInt(result[2], 16) / 255;
		let b = parseInt(result[3], 16) / 255;

		const max = Math.max(r, g, b), min = Math.min(r, g, b);
		let h, s, l = (max + min) / 2;

		if (max === min) {
			h = s = 0;
		} else {
			const d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
				case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
				case g: h = ((b - r) / d + 2) / 6; break;
				case b: h = ((r - g) / d + 4) / 6; break;
			}
		}

		return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
	},

	hslToHex(hsl) {
		const match = hsl.match(/(\d+)/g);
		if (!match) return '';

		let h = parseInt(match[0]) / 360;
		let s = parseInt(match[1]) / 100;
		let l = parseInt(match[2]) / 100;

		const hue2rgb = (p, q, t) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1/6) return p + (q - p) * 6 * t;
			if (t < 1/2) return q;
			if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
			return p;
		};

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;

		return '#' + [
			Math.round(hue2rgb(p, q, h + 1/3) * 255).toString(16).padStart(2, '0'),
			Math.round(hue2rgb(p, q, h) * 255).toString(16).padStart(2, '0'),
			Math.round(hue2rgb(p, q, h - 1/3) * 255).toString(16).padStart(2, '0')
		].join('');
	},

	hexToHsv(hex) {
		const rgb = this.hexToRgb(hex);
		return this.rgbToHsv(rgb);
	},

	rgbToHsv(rgb) {
		const match = rgb.match(/(\d+)/g);
		if (!match) return '';

		let r = parseInt(match[0]) / 255;
		let g = parseInt(match[1]) / 255;
		let b = parseInt(match[2]) / 255;

		const max = Math.max(r, g, b), min = Math.min(r, g, b);
		const d = max - min;
		let h = 0;
		const s = max === 0 ? 0 : d / max;
		const v = max;

		if (max !== min) {
			switch (max) {
				case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
				case g: h = ((b - r) / d + 2) / 6; break;
				case b: h = ((r - g) / d + 4) / 6; break;
			}
		}

		return `hsv(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(v * 100)}%)`;
	},

	hsvToHex(hsv) {
		const rgb = this.hsvToRgb(hsv);
		return this.rgbToHex(rgb);
	},

	hsvToRgb(hsv) {
		const match = hsv.match(/(\d+)/g);
		if (!match) return '';

		let h = parseInt(match[0]) / 360;
		let s = parseInt(match[1]) / 100;
		let v = parseInt(match[2]) / 100;

		let r, g, b;
		const i = Math.floor(h * 6);
		const f = h * 6 - i;
		const p = v * (1 - s);
		const q = v * (1 - f * s);
		const t = v * (1 - (1 - f) * s);

		switch (i % 6) {
			case 0: r = v; g = t; b = p; break;
			case 1: r = q; g = v; b = p; break;
			case 2: r = p; g = v; b = t; break;
			case 3: r = p; g = q; b = v; break;
			case 4: r = t; g = p; b = v; break;
			case 5: r = v; g = p; b = q; break;
		}

		return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
	},

	hslToRgb(hsl) {
		const hex = this.hslToHex(hsl);
		return this.hexToRgb(hex);
	},

	hsvToHsl(hsv) {
		const hex = this.hsvToHex(hsv);
		return this.hexToHsl(hex);
	},

	normalizeHex(hex) {
		hex = hex.trim();
		if (!hex.startsWith('#')) hex = '#' + hex;
		return hex;
	},

	isValidHex(hex) {
		return /^#[0-9A-F]{6}$/i.test(hex);
	}
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => ColorTools.init());
} else {
	ColorTools.init();
}
