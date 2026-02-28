/* ============================================
   ISO Language Codes Tool Script
   ============================================ */

const IsoLanguageCodes = {
	languages: [
		{ code: 'en', name: 'English' },
		{ code: 'es', name: 'Spanish' },
		{ code: 'fr', name: 'French' },
		{ code: 'de', name: 'German' },
		{ code: 'it', name: 'Italian' },
		{ code: 'pt', name: 'Portuguese' },
		{ code: 'ru', name: 'Russian' },
		{ code: 'ja', name: 'Japanese' },
		{ code: 'zh', name: 'Chinese' },
		{ code: 'ko', name: 'Korean' },
		{ code: 'ar', name: 'Arabic' },
		{ code: 'hi', name: 'Hindi' },
		{ code: 'bn', name: 'Bengali' },
		{ code: 'pa', name: 'Panjabi' },
		{ code: 'te', name: 'Telugu' },
		{ code: 'mr', name: 'Marathi' },
		{ code: 'ta', name: 'Tamil' },
		{ code: 'tr', name: 'Turkish' },
		{ code: 'vi', name: 'Vietnamese' },
		{ code: 'th', name: 'Thai' },
		{ code: 'gu', name: 'Gujarati' },
		{ code: 'pl', name: 'Polish' },
		{ code: 'uk', name: 'Ukrainian' },
		{ code: 'fa', name: 'Persian' },
		{ code: 'ml', name: 'Malayalam' },
		{ code: 'kn', name: 'Kannada' },
		{ code: 'or', name: 'Oriya' },
		{ code: 'my', name: 'Burmese' },
		{ code: 'nl', name: 'Dutch' },
		{ code: 'sv', name: 'Swedish' },
		{ code: 'no', name: 'Norwegian' },
		{ code: 'da', name: 'Danish' },
		{ code: 'fi', name: 'Finnish' },
		{ code: 'el', name: 'Greek' },
		{ code: 'he', name: 'Hebrew' },
		{ code: 'cs', name: 'Czech' },
		{ code: 'sk', name: 'Slovak' },
		{ code: 'hu', name: 'Hungarian' },
		{ code: 'ro', name: 'Romanian' },
		{ code: 'bg', name: 'Bulgarian' },
		{ code: 'hr', name: 'Croatian' },
		{ code: 'sr', name: 'Serbian' },
		{ code: 'sl', name: 'Slovenian' },
		{ code: 'et', name: 'Estonian' },
		{ code: 'lv', name: 'Latvian' },
		{ code: 'lt', name: 'Lithuanian' },
		{ code: 'id', name: 'Indonesian' },
		{ code: 'ms', name: 'Malay' },
		{ code: 'tl', name: 'Tagalog' },
		{ code: 'sw', name: 'Swahili' },
	],

	init() {
		const container = document.getElementById('lang-container');
		const searchInput = document.getElementById('lang-search');
		if (!container) return;

		this.renderLanguages(container);

		if (searchInput) {
			searchInput.addEventListener('input', (e) => {
				this.renderLanguages(container, e.target.value);
			});
		}
	},

	renderLanguages(container, filter = '') {
		container.innerHTML = '';
		const filtered = this.languages.filter(item => 
			item.code.toLowerCase().includes(filter.toLowerCase()) ||
			item.name.toLowerCase().includes(filter.toLowerCase())
		);

		filtered.forEach(item => {
			const row = document.createElement('tr');
			row.innerHTML = `
				<td>${item.code}</td>
				<td>${item.name}</td>
				<td><button class="btn copy-btn" data-code="${item.code}">Copy</button></td>
			`;
			container.appendChild(row);
		});

		document.querySelectorAll('.copy-btn').forEach(btn => {
			btn.addEventListener('click', () => {
				navigator.clipboard.writeText(btn.dataset.code);
				if (ui && ui.notify) {
					ui.notify(`<i>📋</i> ${btn.dataset.code} copied!`);
				}
			});
		});
	}
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => IsoLanguageCodes.init());
} else {
	IsoLanguageCodes.init();
}
