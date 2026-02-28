/* ============================================
   8-bit Icon Creator Tool Script
   Optimized with DocumentFragment and Fixed PNG Export
   ============================================ */

const IconCreator = {
	gridSize: 16,
	currentColor: '#000000',
	isEraser: false,
	pixels: {},
	isDrawing: false,

	colorPalette: [
		'#000000', '#1a1a2e', '#16213e', '#0f3460', '#533483', '#e94560',
		'#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#5f27cd', '#c8d6e5',
		'#ffffff', '#8395a7', '#576574', '#222f3e', '#ff9ff3', '#54a0ff'
	],

	init() {
		this.cacheElements();
		this.renderColorPalette();
		this.bindEvents();
		this.createCanvas();
	},

	cacheElements() {
		this.elements = {
			canvas: document.getElementById('pixel-canvas'),
			colorInput: document.getElementById('pixel-color'),
			colorHex: document.getElementById('color-hex'),
			eraserBtn: document.getElementById('eraser-btn'),
			clearBtn: document.getElementById('clear-btn'),
			downloadSvg: document.getElementById('download-svg'),
			downloadPng: document.getElementById('download-png'),
			previewIcon: document.getElementById('preview-icon'),
			previews: {
				16: document.getElementById('preview-16'),
				32: document.getElementById('preview-32'),
				64: document.getElementById('preview-64')
			}
		};
	},

	bindEvents() {
		// Size buttons
		document.querySelectorAll('.size-btn').forEach(btn => {
			btn.addEventListener('click', (e) => {
				document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
				e.target.classList.add('active');
				this.gridSize = parseInt(e.target.dataset.size);
				this.pixels = {};
				this.createCanvas();
			});
		});

		// Color picker
		if (this.elements.colorInput) {
			this.elements.colorInput.addEventListener('input', (e) => {
				this.setColor(e.target.value);
				if (this.elements.colorHex) {
					this.elements.colorHex.textContent = e.target.value.toUpperCase();
				}
			});
		}

		// Tool buttons
		if (this.elements.eraserBtn) {
			this.elements.eraserBtn.addEventListener('click', () => {
				this.isEraser = !this.isEraser;
				this.elements.eraserBtn.classList.toggle('active', this.isEraser);
			});
		}

		if (this.elements.clearBtn) {
			this.elements.clearBtn.addEventListener('click', () => {
				this.clearCanvas();
			});
		}

		// Download buttons
		if (this.elements.downloadSvg) {
			this.elements.downloadSvg.addEventListener('click', () => this.downloadSVG());
		}

		if (this.elements.downloadPng) {
			this.elements.downloadPng.addEventListener('click', () => this.downloadPNG());
		}

		// Canvas events
		if (this.elements.canvas) {
			this.elements.canvas.addEventListener('mousedown', (e) => {
				this.isDrawing = true;
				this.handlePixelInteraction(e);
			});
			this.elements.canvas.addEventListener('mousemove', (e) => {
				if (this.isDrawing) {
					this.handlePixelInteraction(e);
				}
			});
			this.elements.canvas.addEventListener('mouseup', () => {
				this.isDrawing = false;
			});
			this.elements.canvas.addEventListener('mouseleave', () => {
				this.isDrawing = false;
			});
		}
	},

	renderColorPalette() {
		const container = document.getElementById('color-palette');
		if (!container) return;

		const fragment = document.createDocumentFragment();
		
		this.colorPalette.forEach((color, index) => {
			const div = document.createElement('div');
			div.className = 'palette-color' + (index === 0 ? ' active' : '');
			div.style.backgroundColor = color;
			div.dataset.color = color;
			div.addEventListener('click', () => {
				this.setColor(color);
				document.querySelectorAll('.palette-color').forEach(c => c.classList.remove('active'));
				div.classList.add('active');
			});
			fragment.appendChild(div);
		});

		container.appendChild(fragment);
	},

	setColor(color) {
		this.currentColor = color;
		this.isEraser = false;
		this.elements.eraserBtn?.classList.remove('active');
	},

	createCanvas() {
		if (!this.elements.canvas) return;

		// Set grid CSS
		this.elements.canvas.style.gridTemplateColumns = `repeat(${this.gridSize}, 1.25rem)`;
		this.elements.canvas.style.gridTemplateRows = `repeat(${this.gridSize}, 1.25rem)`;

		// Use DocumentFragment for better performance
		const fragment = document.createDocumentFragment();

		for (let y = 0; y < this.gridSize; y++) {
			for (let x = 0; x < this.gridSize; x++) {
				const pixel = document.createElement('div');
				pixel.className = 'pixel';
				pixel.dataset.x = x;
				pixel.dataset.y = y;

				const key = `${x},${y}`;
				if (this.pixels[key]) {
					pixel.style.backgroundColor = this.pixels[key];
				} else {
					pixel.classList.add('transparent');
				}

				fragment.appendChild(pixel);
			}
		}

		this.elements.canvas.innerHTML = '';
		this.elements.canvas.appendChild(fragment);
		this.updatePreview();
	},

	handlePixelInteraction(e) {
		const pixel = e.target;
		if (!pixel.classList.contains('pixel')) return;

		const x = parseInt(pixel.dataset.x);
		const y = parseInt(pixel.dataset.y);
		this.togglePixel(x, y, pixel);
	},

	togglePixel(x, y, pixel) {
		const key = `${x},${y}`;

		if (this.isEraser) {
			delete this.pixels[key];
			if (pixel) {
				pixel.classList.add('transparent');
				pixel.style.backgroundColor = '';
			}
		} else if (this.pixels[key] === this.currentColor) {
			delete this.pixels[key];
			if (pixel) {
				pixel.classList.add('transparent');
				pixel.style.backgroundColor = '';
			}
		} else {
			this.pixels[key] = this.currentColor;
			if (pixel) {
				pixel.style.backgroundColor = this.currentColor;
				pixel.classList.remove('transparent');
			}
		}

		this.updatePreview();
	},

	clearCanvas() {
		this.pixels = {};
		this.createCanvas();
		if (ui && ui.notify) {
			ui.notify('<i>🗑️</i> Canvas cleared!');
		}
	},

	updatePreview() {
		const svg = this.generateSVG();

		if (this.elements.previewIcon) {
			this.elements.previewIcon.innerHTML = svg;
		}

		// Update size previews
		[16, 32, 64].forEach(size => {
			const el = this.elements.previews[size];
			if (el) {
				el.innerHTML = svg;
				const svgEl = el.querySelector('svg');
				if (svgEl) {
					svgEl.setAttribute('width', size);
					svgEl.setAttribute('height', size);
				}
			}
		});
	},

	generateSVG() {
		const pixelSize = 100 / this.gridSize;
		let rects = '';

		Object.entries(this.pixels).forEach(([key, color]) => {
			const [x, y] = key.split(',').map(Number);
			rects += `<rect x="${x * pixelSize}" y="${y * pixelSize}" width="${pixelSize}" height="${pixelSize}" fill="${color}"/>`;
		});

		return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${this.gridSize * 4}" height="${this.gridSize * 4}">${rects}</svg>`;
	},

	downloadSVG() {
		const svg = this.generateSVG();
		const blob = new Blob([svg], { type: 'image/svg+xml' });
		const url = URL.createObjectURL(blob);

		const link = document.createElement('a');
		link.download = `icon-${this.gridSize}x${this.gridSize}-${this.getTimestamp()}.svg`;
		link.href = url;
		link.click();

		URL.revokeObjectURL(url);

		if (ui && ui.notify) {
			ui.notify('<i>📥</i> SVG downloaded!');
		}
	},

	downloadPNG() {
		const svg = this.generateSVG();
		const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
		const url = URL.createObjectURL(svgBlob);

		const img = new Image();
		img.onload = () => {
			const canvas = document.createElement('canvas');
			const scale = 32;
			canvas.width = this.gridSize * scale;
			canvas.height = this.gridSize * scale;

			const ctx = canvas.getContext('2d');
			
			// Clear canvas with transparent background
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.imageSmoothingEnabled = false;
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

			canvas.toBlob((blob) => {
				if (!blob) return;
				
				const link = document.createElement('a');
				link.download = `icon-${this.gridSize}x${this.gridSize}-${this.getTimestamp()}.png`;
				link.href = URL.createObjectURL(blob);
				link.click();
				URL.revokeObjectURL(link.href);

				if (ui && ui.notify) {
					ui.notify('<i>🖼️</i> PNG downloaded!');
				}
			}, 'image/png');
		};

		img.onerror = () => {
			if (ui && ui.notify) {
				ui.notify('<i>❌</i> Error generating PNG');
			}
		};

		img.src = url;
	},

	getTimestamp() {
		return new Date().toISOString().slice(0, 10).replace(/-/g, '');
	}
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => IconCreator.init());
} else {
	IconCreator.init();
}
