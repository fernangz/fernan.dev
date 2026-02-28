/* ============================================
   MIME Types Tool Script
   ============================================ */

const MimeTypes = {
	mimeTypes: [
		{ extension: '.html', mime: 'text/html' },
		{ extension: '.htm', mime: 'text/html' },
		{ extension: '.css', mime: 'text/css' },
		{ extension: '.js', mime: 'application/javascript' },
		{ extension: '.json', mime: 'application/json' },
		{ extension: '.xml', mime: 'application/xml' },
		{ extension: '.txt', mime: 'text/plain' },
		{ extension: '.rtf', mime: 'application/rtf' },
		{ extension: '.csv', mime: 'text/csv' },
		{ extension: '.jpg', mime: 'image/jpeg' },
		{ extension: '.jpeg', mime: 'image/jpeg' },
		{ extension: '.png', mime: 'image/png' },
		{ extension: '.gif', mime: 'image/gif' },
		{ extension: '.svg', mime: 'image/svg+xml' },
		{ extension: '.webp', mime: 'image/webp' },
		{ extension: '.ico', mime: 'image/x-icon' },
		{ extension: '.bmp', mime: 'image/bmp' },
		{ extension: '.mp3', mime: 'audio/mpeg' },
		{ extension: '.wav', mime: 'audio/wav' },
		{ extension: '.ogg', mime: 'audio/ogg' },
		{ extension: '.mp4', mime: 'video/mp4' },
		{ extension: '.webm', mime: 'video/webm' },
		{ extension: '.avi', mime: 'video/x-msvideo' },
		{ extension: '.pdf', mime: 'application/pdf' },
		{ extension: '.doc', mime: 'application/msword' },
		{ extension: '.docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
		{ extension: '.xls', mime: 'application/vnd.ms-excel' },
		{ extension: '.xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
		{ extension: '.ppt', mime: 'application/vnd.ms-powerpoint' },
		{ extension: '.pptx', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' },
		{ extension: '.zip', mime: 'application/zip' },
		{ extension: '.rar', mime: 'application/vnd.rar' },
		{ extension: '.tar', mime: 'application/x-tar' },
		{ extension: '.gz', mime: 'application/gzip' },
		{ extension: '.7z', mime: 'application/x-7z-compressed' },
		{ extension: '.woff', mime: 'font/woff' },
		{ extension: '.woff2', mime: 'font/woff2' },
		{ extension: '.ttf', mime: 'font/ttf' },
		{ extension: '.otf', mime: 'font/otf' },
		{ extension: '.eot', mime: 'application/vnd.ms-fontobject' },
		{ extension: '.wasm', mime: 'application/wasm' },
		{ extension: '.webmanifest', mime: 'application/manifest+json' },
		{ extension: '.ics', mime: 'text/calendar' },
		{ extension: '.vcf', mime: 'text/vcard' },
	],

	init() {
		const container = document.getElementById('mime-container');
		const searchInput = document.getElementById('mime-search');
		if (!container) return;

		this.renderMimeTypes(container);

		if (searchInput) {
			searchInput.addEventListener('input', (e) => {
				this.renderMimeTypes(container, e.target.value);
			});
		}
	},

	renderMimeTypes(container, filter = '') {
		container.innerHTML = '';
		const filtered = this.mimeTypes.filter(item => 
			item.extension.toLowerCase().includes(filter.toLowerCase()) ||
			item.mime.toLowerCase().includes(filter.toLowerCase())
		);

		filtered.forEach(item => {
			const row = document.createElement('tr');
			row.innerHTML = `
				<td>${item.extension}</td>
				<td>${item.mime}</td>
				<td><button class="btn copy-btn" data-mime="${item.mime}">Copy</button></td>
			`;
			container.appendChild(row);
		});

		document.querySelectorAll('.copy-btn').forEach(btn => {
			btn.addEventListener('click', () => {
				navigator.clipboard.writeText(btn.dataset.mime);
				if (ui && ui.notify) {
					ui.notify(`<i>📋</i> ${btn.dataset.mime} copied!`);
				}
			});
		});
	}
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => MimeTypes.init());
} else {
	MimeTypes.init();
}
