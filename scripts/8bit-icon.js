/* ============================================
   8-bit Icon Tool Script
   ============================================ */

const Bit8Icon = {
	canvas: null,
	ctx: null,
	pixelSize: 1.25, // 20px = 1.25rem base multiplier
	isDrawing: false,
	isEraser: false,
	currentColor: '#000000',
	currentSize: 16,

	init() {
		this.canvas = document.getElementById('pixel-canvas');
		const colorPicker = document.getElementById('pixel-color');
		const sizeSelect = document.getElementById('canvas-size');
		const clearBtn = document.getElementById('clear-canvas');
		const downloadBtn = document.getElementById('download-icon');
		const eraserBtn = document.getElementById('eraser-btn');

		if (!this.canvas) return;

		this.ctx = this.canvas.getContext('2d');
		
		// Get initial size
		this.currentSize = parseInt(sizeSelect?.value) || 16;
		
		// Set canvas display size via CSS, then set internal resolution
		this.updateCanvasDisplaySize();
		this.initCanvas();

		// Event listeners
		this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
		this.canvas.addEventListener('mousemove', (e) => this.draw(e));
		this.canvas.addEventListener('mouseup', () => this.stopDrawing());
		this.canvas.addEventListener('mouseleave', () => this.stopDrawing());
		
		// Touch support
		this.canvas.addEventListener('touchstart', (e) => this.handleTouch(e), { passive: false });
		this.canvas.addEventListener('touchmove', (e) => this.handleTouch(e), { passive: false });
		this.canvas.addEventListener('touchend', () => this.stopDrawing());

		if (colorPicker) {
			colorPicker.addEventListener('input', (e) => {
				this.currentColor = e.target.value;
				this.isEraser = false;
				if (eraserBtn) eraserBtn.classList.remove('active');
			});
		}

		if (sizeSelect) {
			sizeSelect.addEventListener('change', (e) => {
				this.currentSize = parseInt(e.target.value);
				this.updateCanvasDisplaySize();
				this.initCanvas();
			});
		}

		if (eraserBtn) {
			eraserBtn.addEventListener('click', () => {
				this.isEraser = !this.isEraser;
				eraserBtn.classList.toggle('active', this.isEraser);
			});
		}

		if (clearBtn) {
			clearBtn.addEventListener('click', () => {
				this.clearCanvas();
				if (ui && ui.notify) {
					ui.notify('<i>🗑️</i> Canvas cleared!');
				}
			});
		}

		if (downloadBtn) {
			downloadBtn.addEventListener('click', () => this.download());
		}
	},

	updateCanvasDisplaySize() {
		// Set display size based on canvas size (max 512px for large canvases)
		const maxSize = this.currentSize <= 16 ? 20 : 16;
		const displaySize = Math.min(this.currentSize * maxSize, 512);
		this.canvas.style.width = `${displaySize}px`;
		this.canvas.style.height = `${displaySize}px`;
	},

	initCanvas() {
		// Set internal resolution
		const scale = this.currentSize <= 16 ? 20 : 16;
		const size = this.currentSize * scale;

		this.canvas.width = size;
		this.canvas.height = size;
		this.pixelSize = scale;

		this.ctx.fillStyle = '#ffffff';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		this.drawGrid();
	},

	drawGrid() {
		this.ctx.strokeStyle = '#e0e0e0';
		this.ctx.lineWidth = 1;

		for (let i = 0; i <= this.currentSize; i++) {
			// Vertical lines
			this.ctx.beginPath();
			this.ctx.moveTo(i * this.pixelSize, 0);
			this.ctx.lineTo(i * this.pixelSize, this.canvas.height);
			this.ctx.stroke();

			// Horizontal lines
			this.ctx.beginPath();
			this.ctx.moveTo(0, i * this.pixelSize);
			this.ctx.lineTo(this.canvas.width, i * this.pixelSize);
			this.ctx.stroke();
		}
	},

	getMousePos(evt) {
		const rect = this.canvas.getBoundingClientRect();
		const scaleX = this.canvas.width / rect.width;
		const scaleY = this.canvas.height / rect.height;
		
		return {
			x: Math.floor((evt.clientX - rect.left) * scaleX / this.pixelSize) * this.pixelSize,
			y: Math.floor((evt.clientY - rect.top) * scaleY / this.pixelSize) * this.pixelSize
		};
	},

	handleTouch(e) {
		e.preventDefault();
		const touch = e.touches[0];
		const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 'mousemove', {
			clientX: touch.clientX,
			clientY: touch.clientY
		});
		
		if (e.type === 'touchstart') {
			this.startDrawing(mouseEvent);
		} else {
			this.draw(mouseEvent);
		}
	},

	startDrawing(e) {
		this.isDrawing = true;
		const pos = this.getMousePos(e);
		this.drawPixel(pos.x, pos.y);
	},

	draw(e) {
		if (!this.isDrawing) return;
		const pos = this.getMousePos(e);
		this.drawPixel(pos.x, pos.y);
	},

	stopDrawing() {
		this.isDrawing = false;
	},

	drawPixel(x, y) {
		this.ctx.fillStyle = this.isEraser ? '#ffffff' : this.currentColor;
		this.ctx.fillRect(x, y, this.pixelSize, this.pixelSize);
	},

	clearCanvas() {
		this.ctx.fillStyle = '#ffffff';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.drawGrid();
	},

	download() {
		// Create a temporary canvas without grid
		const tempCanvas = document.createElement('canvas');
		tempCanvas.width = this.canvas.width;
		tempCanvas.height = this.canvas.height;
		const tempCtx = tempCanvas.getContext('2d');
		
		// Draw white background
		tempCtx.fillStyle = '#ffffff';
		tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
		
		// Draw pixel data (skip grid lines by sampling center of each pixel)
		for (let row = 0; row < this.currentSize; row++) {
			for (let col = 0; col < this.currentSize; col++) {
				const x = col * this.pixelSize;
				const y = row * this.pixelSize;
				const pixelData = this.ctx.getImageData(x + this.pixelSize / 2, y + this.pixelSize / 2, 1, 1).data;
				
				// Check if pixel is not white (grid color)
				if (pixelData[0] !== 255 || pixelData[1] !== 224 || pixelData[2] !== 224) {
					tempCtx.fillStyle = `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
					tempCtx.fillRect(x, y, this.pixelSize, this.pixelSize);
				}
			}
		}

		// Create download link
		const link = document.createElement('a');
		const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
		link.download = `8bit-icon-${timestamp}.png`;
		link.href = tempCanvas.toDataURL('image/png');
		link.click();
		
		if (ui && ui.notify) {
			ui.notify('<i>⬇️</i> Icon downloaded!');
		}
	}
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => Bit8Icon.init());
} else {
	Bit8Icon.init();
}
