/* ============================================
   Color Converter Tool Script
   ============================================ */

const ColorConverter = {
	currentColor: '#3498db',

	init() {
		const colorInput = document.getElementById('color-input');
		const hexInput = document.getElementById('hex-input');
		const rgbInput = document.getElementById('rgb-input');
		const hslInput = document.getElementById('hsl-input');
		const hsvInput = document.getElementById('hsv-input');
		const colorPreview = document.getElementById('color-preview');
		const paletteContainer = document.getElementById('palette-container');

		if (!colorInput) return;

		// Set initial color preview
		if (colorPreview) {
			colorPreview.style.backgroundColor = this.currentColor;
		}

		// Color picker change
		colorInput.addEventListener('input', (e) => {
			this.currentColor = e.target.value;
			this.updateColorInputs(this.currentColor);
			if (colorPreview) {
				colorPreview.style.backgroundColor = this.currentColor;
			}
		});

		// HEX input change
		if (hexInput) {
			hexInput.addEventListener('input', (e) => {
				let hex = e.target.value;
				if (!hex.startsWith('#')) hex = '#' + hex;
				if (/^#[0-9A-F]{6}$/i.test(hex)) {
					this.currentColor = hex;
					this.updateColorInputs(hex);
					if (colorPreview) {
						colorPreview.style.backgroundColor = hex;
					}
					if (colorInput) {
						colorInput.value = hex;
					}
				}
			});
		}

		// RGB input change
		if (rgbInput) {
			rgbInput.addEventListener('input', (e) => {
				const rgb = e.target.value;
				const hex = this.rgbToHex(rgb);
				if (hex) {
					this.currentColor = hex;
					this.updateColorInputs(hex);
					if (colorPreview) {
						colorPreview.style.backgroundColor = hex;
					}
					if (colorInput) {
						colorInput.value = hex;
					}
				}
			});
		}

		// HSL input change
		if (hslInput) {
			hslInput.addEventListener('input', (e) => {
				const hsl = e.target.value;
				const hex = this.hslToHex(hsl);
				if (hex) {
					this.currentColor = hex;
					this.updateColorInputs(hex);
					if (colorPreview) {
						colorPreview.style.backgroundColor = hex;
					}
					if (colorInput) {
						colorInput.value = hex;
					}
				}
			});
		}

		// HSV input change
		if (hsvInput) {
			hsvInput.addEventListener('input', (e) => {
				const hsv = e.target.value;
				const hex = this.hsvToHex(hsv);
				if (hex) {
					this.currentColor = hex;
					this.updateColorInputs(hex);
					if (colorPreview) {
						colorPreview.style.backgroundColor = hex;
					}
					if (colorInput) {
						colorInput.value = hex;
					}
				}
			});
		}

		// Copy buttons
		document.querySelectorAll('.copy-btn').forEach(btn => {
			btn.addEventListener('click', () => {
				const targetId = btn.dataset.target;
				const input = document.getElementById(targetId);
				if (input) {
					navigator.clipboard.writeText(input.value);
					if (ui && ui.notify) {
						ui.notify(`<i>📋</i> ${input.value} copied!`);
					}
				}
			});
		});

		// Palette generation buttons
		const analogousBtn = document.getElementById('generate-analogous');
		const complementaryBtn = document.getElementById('generate-complementary');
		const triadicBtn = document.getElementById('generate-triadic');
		const splitBtn = document.getElementById('generate-split');

		if (analogousBtn) {
			analogousBtn.addEventListener('click', () => {
				this.generatePalette('analogous', paletteContainer);
			});
		}

		if (complementaryBtn) {
			complementaryBtn.addEventListener('click', () => {
				this.generatePalette('complementary', paletteContainer);
			});
		}

		if (triadicBtn) {
			triadicBtn.addEventListener('click', () => {
				this.generatePalette('triadic', paletteContainer);
			});
		}

		if (splitBtn) {
			splitBtn.addEventListener('click', () => {
				this.generatePalette('split', paletteContainer);
			});
		}
	},

	updateColorInputs(hex) {
		const colorInput = document.getElementById('color-input');
		const hexInput = document.getElementById('hex-input');
		const rgbInput = document.getElementById('rgb-input');
		const hslInput = document.getElementById('hsl-input');
		const hsvInput = document.getElementById('hsv-input');

		if (colorInput) colorInput.value = hex;
		if (hexInput) hexInput.value = hex;
		if (rgbInput) rgbInput.value = this.hexToRgb(hex);
		if (hslInput) hslInput.value = this.hexToHsl(hex);
		if (hsvInput) hsvInput.value = this.hexToHsv(hex);
		
		// Update contrast ratios
		this.updateContrastRatios(hex);
	},
	
	updateContrastRatios(hex) {
		const contrastBlackEl = document.getElementById('contrast-black');
		const contrastWhiteEl = document.getElementById('contrast-white');
		const indicatorBlackEl = document.getElementById('indicator-black');
		const indicatorWhiteEl = document.getElementById('indicator-white');
		
		if (!contrastBlackEl || !contrastWhiteEl) return;
		
		const ratioBlack = this.calculateContrastRatio(hex, '#000000');
		const ratioWhite = this.calculateContrastRatio(hex, '#ffffff');
		
		contrastBlackEl.textContent = `${ratioBlack.toFixed(2)}:1`;
		contrastWhiteEl.textContent = `${ratioWhite.toFixed(2)}:1`;
		
		// Update indicators
		if (indicatorBlackEl) {
			indicatorBlackEl.className = 'contrast-indicator ' + this.getContrastClass(ratioBlack);
		}
		if (indicatorWhiteEl) {
			indicatorWhiteEl.className = 'contrast-indicator ' + this.getContrastClass(ratioWhite);
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
		const match = rgb.match(/(\d+),\s*(\d+),\s*(\d+)/);
		
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

	hexToRgb(hex) {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		if (result) {
			const r = parseInt(result[1], 16);
			const g = parseInt(result[2], 16);
			const b = parseInt(result[3], 16);
			return `rgb(${r}, ${g}, ${b})`;
		}
		return '';
	},

	rgbToHex(rgb) {
		const match = rgb.match(/(\d+),\s*(\d+),\s*(\d+)/);
		if (match) {
			const r = parseInt(match[1]);
			const g = parseInt(match[2]);
			const b = parseInt(match[3]);
			return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
		}
		return '';
	},

	hexToHsl(hex) {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		if (result) {
			let r = parseInt(result[1], 16) / 255;
			let g = parseInt(result[2], 16) / 255;
			let b = parseInt(result[3], 16) / 255;

			const max = Math.max(r, g, b);
			const min = Math.min(r, g, b);
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
		}
		return '';
	},

	hslToHex(hsl) {
		const match = hsl.match(/(\d+),\s*(\d+)%,\s*(\d+)%/);
		if (match) {
			let h = parseInt(match[1]) / 360;
			let s = parseInt(match[2]) / 100;
			let l = parseInt(match[3]) / 100;

			let r, g, b;
			if (s === 0) {
				r = g = b = l;
			} else {
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
				r = hue2rgb(p, q, h + 1/3);
				g = hue2rgb(p, q, h);
				b = hue2rgb(p, q, h - 1/3);
			}

			return '#' + [r, g, b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
		}
		return '';
	},

	hexToHsv(hex) {
		const rgbResult = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		if (rgbResult) {
			let r = parseInt(rgbResult[1], 16) / 255;
			let g = parseInt(rgbResult[2], 16) / 255;
			let b = parseInt(rgbResult[3], 16) / 255;

			const max = Math.max(r, g, b);
			const min = Math.min(r, g, b);
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
			const v = max;

			return `hsv(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(v * 100)}%)`;
		}
		return '';
	},

	hsvToHex(hsv) {
		const match = hsv.match(/(\d+),\s*(\d+)%,\s*(\d+)%/);
		if (match) {
			let h = parseInt(match[1]) / 360;
			let s = parseInt(match[2]) / 100;
			let v = parseInt(match[3]) / 100;

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

			return '#' + [r, g, b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
		}
		return '';
	},

	generatePalette(type, container) {
		const hex = this.currentColor.startsWith('#') ? this.currentColor : '#' + this.currentColor;
		const hsl = this.hexToHsl(hex);
		const hMatch = hsl.match(/(\d+)/);
		if (!hMatch) return;
		
		const baseHue = parseInt(hMatch[1]);
		let colors = [];

		switch (type) {
			case 'analogous':
				colors = [
					{ offset: -30, name: 'Analogous -30°' },
					{ offset: -15, name: 'Analogous -15°' },
					{ offset: 0, name: 'Base Color' },
					{ offset: 15, name: 'Analogous +15°' },
					{ offset: 30, name: 'Analogous +30°' }
				];
				break;
			case 'complementary':
				colors = [
					{ offset: 0, name: 'Base Color' },
					{ offset: 180, name: 'Complementary' }
				];
				break;
			case 'triadic':
				colors = [
					{ offset: 0, name: 'Base Color' },
					{ offset: 120, name: 'Triadic +120°' },
					{ offset: 240, name: 'Triadic +240°' }
				];
				break;
			case 'split':
				colors = [
					{ offset: 0, name: 'Base Color' },
					{ offset: 150, name: 'Split +150°' },
					{ offset: 210, name: 'Split +210°' }
				];
				break;
		}
		
		container.innerHTML = '';
		
		colors.forEach(({ offset, name }) => {
			const newHue = ((baseHue + offset) % 360 + 360) % 360;
			const newHsl = `hsl(${newHue}, 70%, 50%)`;
			const newHex = this.hslToHex(newHsl);
			
			const colorBox = document.createElement('div');
			colorBox.className = 'color-box';
			colorBox.style.backgroundColor = newHex;
			colorBox.innerHTML = `
				<span class="color-name">${name}</span>
				<span>${newHex}</span>
			`;
			colorBox.addEventListener('click', () => {
				navigator.clipboard.writeText(newHex);
				if (ui && ui.notify) {
					ui.notify(`<i>📋</i> ${newHex} copied!`);
				}
			});
			
			container.appendChild(colorBox);
		});
	}
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => ColorConverter.init());
} else {
	ColorConverter.init();
}
