/* ============================================
   8-bit Icon Creator Tool Script
   ============================================ */

const IconCreator = {
	gridSize: 16,
	currentColor: '#000000',
	isEraser: false,
	pixels: {}, // Store pixel colors: { "x,y": "#color" }
	
	// Predefined color palette
	colorPalette: [
		'#000000', '#1a1a2e', '#16213e', '#0f3460', '#533483', '#e94560',
		'#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#5f27cd', '#c8d6e5',
		'#ffffff', '#8395a7', '#576574', '#222f3e', '#ff9ff3', '#54a0ff'
	],

	init() {
		// Initialize color palette
		this.renderColorPalette();
		
		// Set up event listeners
		this.setupSizeButtons();
		this.setupColorPicker();
		this.setupToolButtons();
		this.setupActionButtons();
		
		// Create initial canvas
		this.createCanvas();
	},

	renderColorPalette() {
		const container = document.getElementById('color-palette');
		if (!container) return;
		
		container.innerHTML = this.colorPalette.map(color => 
			`<div class="palette-color" style="background-color: ${color}" data-color="${color}"></div>`
		).join('');
		
		// Add click handlers
		container.querySelectorAll('.palette-color').forEach(el => {
			el.addEventListener('click', () => {
				const color = el.dataset.color;
				this.setColor(color);
				
				// Update active state
				container.querySelectorAll('.palette-color').forEach(c => c.classList.remove('active'));
				el.classList.add('active');
			});
		});
		
		// Set first color as active
		if (container.firstChild) {
			container.firstChild.classList.add('active');
		}
	},

	setupSizeButtons() {
		document.querySelectorAll('.size-btn').forEach(btn => {
			btn.addEventListener('click', () => {
				// Update active state
				document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
				btn.classList.add('active');
				
				// Update grid size
				this.gridSize = parseInt(btn.dataset.size);
				this.pixels = {}; // Clear pixels
				this.createCanvas();
				this.updatePreview();
			});
		});
	},

	setupColorPicker() {
		const colorInput = document.getElementById('pixel-color');
		const colorHex = document.getElementById('color-hex');
		
		if (colorInput) {
			colorInput.addEventListener('input', (e) => {
				this.setColor(e.target.value);
				if (colorHex) {
					colorHex.textContent = e.target.value.toUpperCase();
				}
				
				// Update palette active state
				document.querySelectorAll('.palette-color').forEach(c => {
					c.classList.toggle('active', c.dataset.color === e.target.value);
				});
			});
		}
	},

	setupToolButtons() {
		const eraserBtn = document.getElementById('eraser-btn');
		const clearBtn = document.getElementById('clear-btn');
		
		if (eraserBtn) {
			eraserBtn.addEventListener('click', () => {
				this.isEraser = !this.isEraser;
				eraserBtn.classList.toggle('active', this.isEraser);
			});
		}
		
		if (clearBtn) {
			clearBtn.addEventListener('click', () => {
				this.clearCanvas();
			});
		}
	},

	setupActionButtons() {
		const downloadSvg = document.getElementById('download-svg');
		const downloadPng = document.getElementById('download-png');
		
		if (downloadSvg) {
			downloadSvg.addEventListener('click', () => this.downloadSVG());
		}
		
		if (downloadPng) {
			downloadPng.addEventListener('click', () => this.downloadPNG());
		}
	},

	setColor(color) {
		this.currentColor = color;
		this.isEraser = false;
		document.getElementById('eraser-btn')?.classList.remove('active');
	},

	createCanvas() {
		const container = document.getElementById('pixel-canvas');
		if (!container) return;
		
		// Set grid CSS
		container.style.gridTemplateColumns = `repeat(${this.gridSize}, 1.25rem)`;
		container.style.gridTemplateRows = `repeat(${this.gridSize}, 1.25rem)`;
		
		// Create pixels
		container.innerHTML = '';
		for (let y = 0; y < this.gridSize; y++) {
			for (let x = 0; x < this.gridSize; x++) {
				const pixel = document.createElement('div');
				pixel.className = 'pixel';
				pixel.dataset.x = x;
				pixel.dataset.y = y;
				
				// Restore pixel color if exists
				const key = `${x},${y}`;
				if (this.pixels[key]) {
					pixel.style.backgroundColor = this.pixels[key];
					pixel.classList.remove('transparent');
				} else {
					pixel.classList.add('transparent');
				}
				
				// Add click handler
				pixel.addEventListener('click', () => this.togglePixel(x, y));
				pixel.addEventListener('mouseenter', (e) => {
					if (e.buttons === 1) {
						this.togglePixel(x, y);
					}
				});
				
				container.appendChild(pixel);
			}
		}
		
		this.updatePreview();
	},

	togglePixel(x, y) {
		const key = `${x},${y}`;
		const pixel = document.querySelector(`.pixel[data-x="${x}"][data-y="${y}"]`);
		
		if (this.isEraser) {
			// Eraser mode: remove color
			delete this.pixels[key];
			if (pixel) {
				pixel.classList.add('transparent');
			}
		} else if (this.pixels[key] === this.currentColor) {
			// Same color: remove
			delete this.pixels[key];
			if (pixel) {
				pixel.classList.add('transparent');
			}
		} else {
			// Set new color
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
		
		// Main preview
		const previewIcon = document.getElementById('preview-icon');
		if (previewIcon) {
			previewIcon.innerHTML = svg;
		}
		
		// Size previews
		[16, 32, 64].forEach(size => {
			const el = document.getElementById(`preview-${size}`);
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
		const img = new Image();
		const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
		const url = URL.createObjectURL(svgBlob);
		
		img.onload = () => {
			const canvas = document.createElement('canvas');
			const scale = 32; // Export at higher resolution
			canvas.width = this.gridSize * scale;
			canvas.height = this.gridSize * scale;
			
			const ctx = canvas.getContext('2d');
			ctx.imageSmoothingEnabled = false;
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			
			canvas.toBlob((blob) => {
				const link = document.createElement('a');
				link.download = `icon-${this.gridSize}x${this.gridSize}-${this.getTimestamp()}.png`;
				link.href = URL.createObjectURL(blob);
				link.click();
				
				URL.revokeObjectURL(url);
				
				if (ui && ui.notify) {
					ui.notify('<i>🖼️</i> PNG downloaded!');
				}
			}, 'image/png');
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
