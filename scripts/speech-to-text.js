/* ============================================
   Speech to Text Tool Script
   ============================================ */

const SpeechToText = {
	recognition: null,
	isRecording: false,

	init() {
		const startBtn = document.getElementById('start-speech');
		const stopBtn = document.getElementById('stop-speech');
		const outputArea = document.getElementById('speech-output');
		const statusEl = document.getElementById('speech-status');
		const clearBtn = document.getElementById('clear-speech');
		const copyBtn = document.getElementById('copy-speech');
		
		if (!startBtn || !outputArea) return;

		// Check for browser support
		if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
			const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
			this.recognition = new SpeechRecognition();
			this.recognition.continuous = true;
			this.recognition.interimResults = true;
			this.recognition.lang = 'en-US';

			this.recognition.onstart = () => {
				this.isRecording = true;
				if (statusEl) {
					statusEl.textContent = 'Listening...';
					statusEl.classList.add('recording');
				}
				if (startBtn) startBtn.disabled = true;
				if (stopBtn) stopBtn.disabled = false;
			};

			this.recognition.onresult = (event) => {
				let interimTranscript = '';
				let finalTranscript = '';

				for (let i = event.resultIndex; i < event.results.length; i++) {
					const transcript = event.results[i][0].transcript;
					if (event.results[i].isFinal) {
						finalTranscript += transcript + ' ';
					} else {
						interimTranscript += transcript;
					}
				}

				if (finalTranscript) {
					outputArea.value += finalTranscript;
				}
			};

			this.recognition.onerror = (event) => {
				this.isRecording = false;
				if (statusEl) {
					statusEl.textContent = 'Error: ' + event.error;
					statusEl.classList.remove('recording');
				}
				if (startBtn) startBtn.disabled = false;
				if (stopBtn) stopBtn.disabled = true;
			};

			this.recognition.onend = () => {
				this.isRecording = false;
				if (statusEl) {
					statusEl.textContent = 'Ready';
					statusEl.classList.remove('recording');
				}
				if (startBtn) startBtn.disabled = false;
				if (stopBtn) stopBtn.disabled = true;
			};
		} else {
			if (statusEl) {
				statusEl.textContent = 'Speech recognition not supported';
			}
			if (startBtn) startBtn.disabled = true;
		}

		// Event listeners
		if (startBtn) {
			startBtn.addEventListener('click', () => this.start());
		}

		if (stopBtn) {
			stopBtn.addEventListener('click', () => this.stop());
		}

		if (clearBtn) {
			clearBtn.addEventListener('click', () => {
				outputArea.value = '';
			});
		}

		if (copyBtn) {
			copyBtn.addEventListener('click', () => {
				navigator.clipboard.writeText(outputArea.value);
				if (ui && ui.notify) {
					ui.notify('<i>📋</i> Text copied!');
				}
			});
		}
	},

	start() {
		if (this.recognition) {
			this.recognition.start();
		}
	},

	stop() {
		if (this.recognition) {
			this.recognition.stop();
		}
	}
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => SpeechToText.init());
} else {
	SpeechToText.init();
}
