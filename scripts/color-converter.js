/* ============================================
   Color Converter Tool Script
   ============================================ */

const ColorConverter = {
	init() {
		const colorInput = document.getElementById('color-input');
		const hexInput = document.getElementById('hex-input');
		const rgbInput = document.getElementById('rgb-input');
		const hslInput = document.getElementById('hsl-input');
		const generatePaletteBtn = document.getElementById('generate-palette');
		const paletteContainer = document.getElementById('palette-container');

		if (!colorInput) return;

		colorInput.addEventListener('input', (e) => {
			const hex = e.target.value;
			this.updateColorInputs(hex);
		});

		if (hexInput) {
			hexInput.addEventListener('input', (e) => {
				let hex = e.target.value;
				if (!hex.startsWith('#')) hex = '#' + hex;
				if (/^#[0-9A-F]{6}$/i.test(hex)) {
					this.updateColorInputs(hex);
				}
			});
		}

		if (rgbInput) {
			rgbInput.addEventListener('input', (e) => {
				const rgb = e.target.value;
				const hex = this.rgbToHex(rgb);
				if (hex) {
					this.updateColorInputs(hex);
				}
			});
		}

		if (hslInput) {
			hslInput.addEventListener('input', (e) => {
				const hsl = e.target.value;
				const hex = this.hslToHex(hsl);
				if (hex) {
					this.updateColorInputs(hex);
				}
			});
		}

		if (generatePaletteBtn && paletteContainer) {
			generatePaletteBtn.addEventListener('click', () => {
				const baseColor = colorInput.value;
				this.generatePalette(baseColor, paletteContainer);
			});
		}
	},

	updateColorInputs(hex) {
		const colorInput = document.getElementById('color-input');
		const hexInput = document.getElementById('hex-input');
		const rgbInput = document.getElementById('rgb-input');
		const hslInput = document.getElementById('hsl-input');

		if (colorInput) colorInput.value = hex;
		if (hexInput) hexInput.value = hex;
		if (rgbInput) rgbInput.value = this.hexToRgb(hex);
		if (hslInput) hslInput.value = this.hexToHsl(hex);
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

	generatePalette(baseColor, container) {
		const hex = baseColor.startsWith('#') ? baseColor : '#' + baseColor;
		const hsl = this.hexToHsl(hex);
		const hMatch = hsl.match(/(\d+)/);
		if (!hMatch) return;
		
		const baseHue = parseInt(hMatch[1]);
		const hueOffsets = [0, 30, 60, 120, 180, 210, 240, 300];
		
		container.innerHTML = '';
		
		hueOffsets.forEach((offset) => {
			const newHue = (baseHue + offset) % 360;
			const newHsl = `hsl(${newHue}, 70%, 50%)`;
			const newHex = this.hslToHex(newHsl);
			
			const colorBox = document.createElement('div');
			colorBox.className = 'color-box';
			colorBox.style.backgroundColor = newHex;
			colorBox.innerHTML = `<span>${newHex}</span>`;
			colorBox.addEventListener('click', () => {
				if (ui && ui.notify) {
					ui.notify(`<i>📋</i> ${newHex} copied!`);
				}
				navigator.clipboard.writeText(newHex);
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
