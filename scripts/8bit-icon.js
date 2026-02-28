/* ============================================
   8-bit Icon Tool Script
   ============================================ */

const Bit8Icon = {
	canvas: null,
	ctx: null,
	pixelSize: 20,
	isDrawing: false,
	isEraser: false,
	currentColor: '#000000',

	init() {
		this.canvas = document.getElementById('pixel-canvas');
		const colorPicker = document.getElementById('pixel-color');
		const sizeSelect = document.getElementById('canvas-size');
		const clearBtn = document.getElementById('clear-canvas');
		const downloadBtn = document.getElementById('download-icon');
		const eraserBtn = document.getElementById('eraser-btn');
		
		if (!this.canvas) return;

		this.ctx = this.canvas.getContext('2d');
		this.initCanvas();

		// Event listeners
		this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
		this.canvas.addEventListener('mousemove', (e) => this.draw(e));
		this.canvas.addEventListener('mouseup', () => this.stopDrawing());
		this.canvas.addEventListener('mouseleave', () => this.stopDrawing());

		if (colorPicker) {
			colorPicker.addEventListener('input', (e) => {
				this.currentColor = e.target.value;
				this.isEraser = false;
				if (eraserBtn) eraserBtn.classList.remove('active');
			});
		}

		if (sizeSelect) {
			sizeSelect.addEventListener('change', () => this.initCanvas());
		}

		if (eraserBtn) {
			eraserBtn.addEventListener('click', () => {
				this.isEraser = !this.isEraser;
				eraserBtn.classList.toggle('active', this.isEraser);
			});
		}

		if (clearBtn) {
			clearBtn.addEventListener('click', () => this.clearCanvas());
		}

		if (downloadBtn) {
			downloadBtn.addEventListener('click', () => this.download());
		}
	},

	initCanvas() {
		const sizeSelect = document.getElementById('canvas-size');
		const size = parseInt(sizeSelect?.value) || 16;
		
		this.canvas.width = size * this.pixelSize;
		this.canvas.height = size * this.pixelSize;
		
		this.ctx.fillStyle = '#ffffff';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		
		this.drawGrid(size);
	},

	drawGrid(size) {
		this.ctx.strokeStyle = '#e0e0e0';
		this.ctx.lineWidth = 1;
		
		for (let i = 0; i <= size; i++) {
			this.ctx.beginPath();
			this.ctx.moveTo(i * this.pixelSize, 0);
			this.ctx.lineTo(i * this.pixelSize, this.canvas.height);
			this.ctx.stroke();
			
			this.ctx.beginPath();
			this.ctx.moveTo(0, i * this.pixelSize);
			this.ctx.lineTo(this.canvas.width, i * this.pixelSize);
			this.ctx.stroke();
		}
	},

	getMousePos(evt) {
		const rect = this.canvas.getBoundingClientRect();
		return {
			x: Math.floor((evt.clientX - rect.left) / this.pixelSize) * this.pixelSize,
			y: Math.floor((evt.clientY - rect.top) / this.pixelSize) * this.pixelSize
		};
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
		const sizeSelect = document.getElementById('canvas-size');
		const size = parseInt(sizeSelect?.value) || 16;
		
		this.ctx.fillStyle = '#ffffff';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.drawGrid(size);
	},

	download() {
		const sizeSelect = document.getElementById('canvas-size');
		const size = parseInt(sizeSelect?.value) || 16;
		
		// Create a temporary canvas without grid
		const tempCanvas = document.createElement('canvas');
		tempCanvas.width = size * this.pixelSize;
		tempCanvas.height = size * this.pixelSize;
		const tempCtx = tempCanvas.getContext('2d');
		tempCtx.drawImage(this.canvas, 0, 0);
		
		const link = document.createElement('a');
		link.download = '8bit-icon.png';
		link.href = tempCanvas.toDataURL('image/png');
		link.click();
	}
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => Bit8Icon.init());
} else {
	Bit8Icon.init();
}
