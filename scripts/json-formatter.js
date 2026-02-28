/* ============================================
   JSON Formatter Script
   ============================================ */

const JSONFormatter = {
	init() {
		this.elements = {
			input: document.getElementById('json-input'),
			output: document.getElementById('json-output'),
			formatBtn: document.getElementById('format-btn'),
			minifyBtn: document.getElementById('minify-btn'),
			copyBtn: document.getElementById('copy-btn'),
			clearBtn: document.getElementById('clear-btn'),
			status: document.getElementById('status-message')
		};

		this.bindEvents();
	},

	bindEvents() {
		this.elements.formatBtn.addEventListener('click', () => this.format());
		this.elements.minifyBtn.addEventListener('click', () => this.minify());
		this.elements.copyBtn.addEventListener('click', () => this.copy());
		this.elements.clearBtn.addEventListener('click', () => this.clear());
	},

	format() {
		try {
			const input = this.elements.input.value.trim();
			if (!input) {
				this.showStatus('Please enter JSON to format', 'error');
				return;
			}

			const parsed = JSON.parse(input);
			const formatted = JSON.stringify(parsed, null, 2);
			
			this.elements.output.textContent = formatted;
			this.elements.input.classList.add('hidden');
			this.elements.output.classList.remove('hidden');
			this.showStatus('JSON formatted successfully!', 'success');
		} catch (e) {
			this.showStatus(`Invalid JSON: ${e.message}`, 'error');
		}
	},

	minify() {
		try {
			const input = this.elements.input.value.trim();
			if (!input) {
				this.showStatus('Please enter JSON to minify', 'error');
				return;
			}

			const parsed = JSON.parse(input);
			const minified = JSON.stringify(parsed);
			
			this.elements.output.textContent = minified;
			this.elements.input.classList.add('hidden');
			this.elements.output.classList.remove('hidden');
			this.showStatus('JSON minified successfully!', 'success');
		} catch (e) {
			this.showStatus(`Invalid JSON: ${e.message}`, 'error');
		}
	},

	copy() {
		const text = this.elements.output.classList.contains('hidden') 
			? this.elements.input.value 
			: this.elements.output.textContent;

		navigator.clipboard.writeText(text).then(() => {
			this.showStatus('Copied to clipboard!', 'success');
		}).catch(() => {
			this.showStatus('Failed to copy', 'error');
		});
	},

	clear() {
		this.elements.input.value = '';
		this.elements.output.textContent = '';
		this.elements.input.classList.remove('hidden');
		this.elements.output.classList.add('hidden');
		this.hideStatus();
	},

	showStatus(message, type) {
		this.elements.status.textContent = message;
		this.elements.status.className = `status-message ${type}`;
		this.elements.status.classList.remove('hidden');
	},

	hideStatus() {
		this.elements.status.classList.add('hidden');
	}
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => JSONFormatter.init());
} else {
	JSONFormatter.init();
}
