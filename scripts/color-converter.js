/* ============================================
   Color Converter Tool Script
   Optimized with Debouncing and Caching
   ============================================ */

const ColorConverter = {
	currentColor: '#3498db',
	paletteCache: {},
	lastPaletteType: null,

	init() {
		this.elements = {
			colorInput: document.getElementById('color-input'),
			hexInput: document.getElementById('hex-input'),
			rgbInput: document.getElementById('rgb-input'),
			hslInput: document.getElementById('hsl-input'),
			hsvInput: document.getElementById('hsv-input'),
			colorPreview: document.getElementById('color-preview'),
			palettes: {
				analogous: document.getElementById('palette-analogous'),
				complementary: document.getElementById('palette-complementary'),
				triadic: document.getElementById('palette-triadic'),
				split: document.getElementById('palette-split')
			},
			contrast: {
				black: document.getElementById('contrast-black'),
				white: document.getElementById('contrast-white'),
				indicatorBlack: document.getElementById('indicator-black'),
				indicatorWhite: document.getElementById('indicator-white')
			}
		};

		if (!this.elements.colorInput) return;

		// Set initial state
		this.elements.colorPreview.style.backgroundColor = this.currentColor;
		this.generateAllPalettes();

		// Bind event handlers with debouncing
		this.bindEvents();
	},

	bindEvents() {
		// Color picker - immediate update
		this.elements.colorInput.addEventListener('input', (e) => {
			this.setColor(e.target.value);
		});

		// Text inputs - debounced
		const debouncedUpdate = this.debounce((value, type) => {
			this.handleTextInput(value, type);
		}, 150);

		['hexInput', 'rgbInput', 'hslInput', 'hsvInput'].forEach(inputName => {
			const input = this.elements[inputName];
			if (input) {
				input.addEventListener('input', (e) => {
					debouncedUpdate(e.target.value, inputName.replace('Input', ''));
				});
			}
		});

		// Copy buttons
		document.querySelectorAll('.copy-btn').forEach(btn => {
			btn.addEventListener('click', () => {
				const targetId = btn.dataset.target;
				const input = document.getElementById(targetId);
				if (input) {
					this.copyToClipboard(input.value, `${input.value} copied!`);
				}
			});
		});
	},

	debounce(func, wait) {
		let timeout;
		return (...args) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => func.apply(this, args), wait);
		};
	},

	setColor(hex) {
		this.currentColor = hex;
		this.updateColorInputs(hex);
		this.elements.colorPreview.style.backgroundColor = hex;
		this.generateAllPalettes();
	},

	handleTextInput(value, type) {
		let hex = null;

		switch (type) {
			case 'hex':
				if (!value.startsWith('#')) value = '#' + value;
				if (/^#[0-9A-F]{6}$/i.test(value)) {
					hex = value;
				}
				break;
			case 'rgb':
				hex = this.rgbToHex(value);
				break;
			case 'hsl':
				hex = this.hslToHex(value);
				break;
			case 'hsv':
				hex = this.hsvToHex(value);
				break;
		}

		if (hex) {
			this.setColor(hex);
			if (this.elements.colorInput) {
				this.elements.colorInput.value = hex;
			}
		}
	},

	generateAllPalettes() {
		// Generate palettes in next frame to avoid blocking
		requestAnimationFrame(() => {
			this.generatePalette('analogous', this.elements.palettes.analogous);
			this.generatePalette('complementary', this.elements.palettes.complementary);
			this.generatePalette('triadic', this.elements.palettes.triadic);
			this.generatePalette('split', this.elements.palettes.split);
		});
	},

	updateColorInputs(hex) {
		if (this.elements.hexInput) this.elements.hexInput.value = hex;
		if (this.elements.rgbInput) this.elements.rgbInput.value = this.hexToRgb(hex);
		if (this.elements.hslInput) this.elements.hslInput.value = this.hexToHsl(hex);
		if (this.elements.hsvInput) this.elements.hsvInput.value = this.hexToHsv(hex);
		this.updateContrastRatios(hex);
	},

	updateContrastRatios(hex) {
		if (!this.elements.contrast.black || !this.elements.contrast.white) return;

		const ratioBlack = this.calculateContrastRatio(hex, '#000000');
		const ratioWhite = this.calculateContrastRatio(hex, '#ffffff');

		this.elements.contrast.black.textContent = `${ratioBlack.toFixed(2)}:1`;
		this.elements.contrast.white.textContent = `${ratioWhite.toFixed(2)}:1`;

		if (this.elements.contrast.indicatorBlack) {
			this.elements.contrast.indicatorBlack.className = 
				'contrast-indicator ' + this.getContrastClass(ratioBlack);
		}
		if (this.elements.contrast.indicatorWhite) {
			this.elements.contrast.indicatorWhite.className = 
				'contrast-indicator ' + this.getContrastClass(ratioWhite);
		}
	},

	calculateContrastRatio(hex1, hex2) {
		const l1 = this.getRelativeLuminance(hex1);
		const l2 = this.getRelativeLuminance(hex2);
		const lighter = Math.max(l1, l2);
		const darker = Math.min(l1, l2);
		return (lighter + 0.05) / (darker + 0.05);
	},

	getRelativeLuminance(hex) {
		const rgb = this.hexToRgb(hex);
		const match = rgb?.match(/(\d+),\s*(\d+),\s*(\d+)/);
		if (!match) return 0;

		const [r, g, b] = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])].map(v => {
			v = v / 255;
			return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
		});

		return 0.2126 * r + 0.7152 * g + 0.0722 * b;
	},

	getContrastClass(ratio) {
		if (ratio >= 7) return 'pass-aaa';
		if (ratio >= 4.5) return 'pass-aa';
		return 'fail';
	},

	copyToClipboard(text, message) {
		navigator.clipboard.writeText(text)
			.then(() => {
				if (ui && ui.notify) {
					ui.notify(`<i>📋</i> ${message}`);
				}
			})
			.catch(() => {
				// Fallback
				const textArea = document.createElement('textarea');
				textArea.value = text;
				document.body.appendChild(textArea);
				textArea.select();
				document.execCommand('copy');
				document.body.removeChild(textArea);
				if (ui && ui.notify) {
					ui.notify(`<i>📋</i> ${message}`);
				}
			});
	},

	// Color conversion methods
	hexToRgb(hex) {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : '';
	},

	rgbToHex(rgb) {
		const match = rgb?.match(/(\d+),\s*(\d+),\s*(\d+)/);
		if (!match) return '';
		return '#' + [match[1], match[2], match[3]].map(x => {
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
		const match = hsl?.match(/(\d+),\s*(\d+)%,\s*(\d+)%/);
		if (!match) return '';

		let h = parseInt(match[1]) / 360;
		let s = parseInt(match[2]) / 100;
		let l = parseInt(match[3]) / 100;

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
		const rgbResult = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		if (!rgbResult) return '';

		let r = parseInt(rgbResult[1], 16) / 255;
		let g = parseInt(rgbResult[2], 16) / 255;
		let b = parseInt(rgbResult[3], 16) / 255;

		const max = Math.max(r, g, b), min = Math.min(r, g, b);
		const d = max - min;
		let h = 0;

		if (max !== min) {
			switch (max) {
				case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
				case g: h = ((b - r) / d + 2) / 6; break;
				case b: h = ((r - g) / d + 4) / 6; break;
			}
		}

		const s = max === 0 ? 0 : d / max;
		return `hsv(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(max * 100)}%)`;
	},

	hsvToHex(hsv) {
		const match = hsv?.match(/(\d+),\s*(\d+)%,\s*(\d+)%/);
		if (!match) return '';

		let h = parseInt(match[1]) / 360;
		let s = parseInt(match[2]) / 100;
		let v = parseInt(match[3]) / 100;

		const i = Math.floor(h * 6);
		const f = h * 6 - i;
		const p = v * (1 - s);
		const q = v * (1 - f * s);
		const t = v * (1 - (1 - f) * s);

		let r, g, b;
		switch (i % 6) {
			case 0: r = v; g = t; b = p; break;
			case 1: r = q; g = v; b = p; break;
			case 2: r = p; g = v; b = t; break;
			case 3: r = p; g = q; b = v; break;
			case 4: r = t; g = p; b = v; break;
			case 5: r = v; g = p; b = q; break;
		}

		return '#' + [r, g, b].map(x => {
			const hex = Math.round(x * 255).toString(16);
			return hex.length === 1 ? '0' + hex : hex;
		}).join('');
	},

	generatePalette(type, container) {
		if (!container) return;

		const cacheKey = `${this.currentColor}-${type}`;
		if (this.paletteCache[cacheKey]) {
			container.innerHTML = this.paletteCache[cacheKey];
			this.attachPaletteListeners(container);
			return;
		}

		const hex = this.currentColor.startsWith('#') ? this.currentColor : '#' + this.currentColor;
		const hsl = this.hexToHsl(hex);
		const hMatch = hsl?.match(/(\d+)/);
		if (!hMatch) return;

		const baseHue = parseInt(hMatch[1]);
		const offsets = this.getPaletteOffsets(type);

		let html = '';
		offsets.forEach(({ offset, name }) => {
			const newHue = ((baseHue + offset) % 360 + 360) % 360;
			const newHex = this.hslToHex(`hsl(${newHue}, 70%, 50%)`);
			html += `
				<div class="color-box" data-color="${newHex}">
					<span class="color-name">${name}</span>
					<span>${newHex}</span>
				</div>
			`;
		});

		container.innerHTML = html;
		this.paletteCache[cacheKey] = html;
		this.attachPaletteListeners(container);
	},

	getPaletteOffsets(type) {
		switch (type) {
			case 'analogous':
				return [
					{ offset: -30, name: '-30°' }, { offset: -15, name: '-15°' },
					{ offset: 0, name: 'Base' },
					{ offset: 15, name: '+15°' }, { offset: 30, name: '+30°' }
				];
			case 'complementary':
				return [
					{ offset: 0, name: 'Base' },
					{ offset: 180, name: 'Complement' }
				];
			case 'triadic':
				return [
					{ offset: 0, name: 'Base' },
					{ offset: 120, name: '+120°' },
					{ offset: 240, name: '+240°' }
				];
			case 'split':
				return [
					{ offset: 0, name: 'Base' },
					{ offset: 150, name: '+150°' },
					{ offset: 210, name: '+210°' }
				];
			default:
				return [];
		}
	},

	attachPaletteListeners(container) {
		container.querySelectorAll('.color-box').forEach(box => {
			box.addEventListener('click', () => {
				const color = box.dataset.color;
				this.copyToClipboard(color, `${color} copied!`);
			});
		});
	}
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => ColorConverter.init());
} else {
	ColorConverter.init();
}
