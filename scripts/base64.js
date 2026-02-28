/* ============================================
   Base64 Tool Script
   ============================================ */

const Base64Tool = {
	init() {
		this.elements = {
			input: document.getElementById('input'),
			output: document.getElementById('output'),
			encodeBtn: document.getElementById('encode-btn'),
			decodeBtn: document.getElementById('decode-btn'),
			copyBtn: document.getElementById('copy-btn'),
			clearBtn: document.getElementById('clear-btn'),
			swapBtn: document.getElementById('swap-btn'),
			status: document.getElementById('status-message')
		};

		this.bindEvents();
	},

	bindEvents() {
		this.elements.encodeBtn.addEventListener('click', () => this.encode());
		this.elements.decodeBtn.addEventListener('click', () => this.decode());
		this.elements.copyBtn.addEventListener('click', () => this.copy());
		this.elements.clearBtn.addEventListener('click', () => this.clear());
		this.elements.swapBtn.addEventListener('click', () => this.swap());
	},

	encode() {
		try {
			const input = this.elements.input.value;
			if (!input) {
				this.showStatus('Please enter text to encode', 'error');
				return;
			}
			const encoded = btoa(unescape(encodeURIComponent(input)));
			this.elements.output.value = encoded;
			this.showStatus('Encoded successfully!', 'success');
		} catch (e) {
			this.showStatus(`Encoding error: ${e.message}`, 'error');
		}
	},

	decode() {
		try {
			const input = this.elements.input.value;
			if (!input) {
				this.showStatus('Please enter Base64 to decode', 'error');
				return;
			}
			const decoded = decodeURIComponent(escape(atob(input)));
			this.elements.output.value = decoded;
			this.showStatus('Decoded successfully!', 'success');
		} catch (e) {
			this.showStatus('Invalid Base64 string', 'error');
		}
	},

	copy() {
		const text = this.elements.output.value || this.elements.input.value;
		if (!text) {
			this.showStatus('Nothing to copy', 'error');
			return;
		}
		navigator.clipboard.writeText(text).then(() => {
			this.showStatus('Copied to clipboard!', 'success');
		}).catch(() => {
			this.showStatus('Failed to copy', 'error');
		});
	},

	clear() {
		this.elements.input.value = '';
		this.elements.output.value = '';
		this.hideStatus();
	},

	swap() {
		const temp = this.elements.input.value;
		this.elements.input.value = this.elements.output.value;
		this.elements.output.value = temp;
	}
,

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
	document.addEventListener('DOMContentLoaded', () => Base64Tool.init());
} else {
	Base64Tool.init();
}
