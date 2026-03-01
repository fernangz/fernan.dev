/* ============================================
   Reading Time Calculator
   Estimates reading time based on word count
   ============================================ */

const ReadingTime = {
	// Average reading speed: 200 words per minute
	wordsPerMinute: 200,
	
	init() {
		// Calculate reading time for all articles
		this.calculateAll();
	},
	
	calculateAll() {
		const articles = document.querySelectorAll('.articles-list li a');
		
		articles.forEach(link => {
			const href = link.getAttribute('href');
			if (!href || !href.includes('/articles/')) return;
			
			// Extract article slug
			const slug = href.replace('/articles/', '').replace('/', '');
			if (!slug) return;
			
			// For now, use estimated times based on known article lengths
			const estimates = {
				'the-dom': 8,
				'cascade-of-styles': 10,
				'ecmascript': 12,
				'javascript-events': 10,
				'number-8': 8,
				'flexbox-grid': 15,
				'responsive-design': 12,
				'css-custom-properties': 8,
				'web-accessibility': 10,
				'web-security': 15,
				'browser-devtools': 10,
				'performance-optimization': 15,
				'seo-llmo': 12
			};
			
			const minutes = estimates[slug] || 10;
			this.displayReadingTime(link, minutes);
		});
	},
	
	displayReadingTime(link, minutes) {
		// Check if already added
		if (link.querySelector('.reading-time')) return;
		
		const badge = document.createElement('span');
		badge.className = 'reading-time';
		badge.textContent = `${minutes} min read`;
		
		// Wrap link content
		const content = document.createElement('div');
		content.className = 'article-link-content';
		
		// Move all children except reading-time to content wrapper
		while (link.firstChild && !link.firstChild.className?.includes('reading-time')) {
			content.appendChild(link.firstChild);
		}
		
		link.appendChild(content);
		content.appendChild(badge);
	}
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => ReadingTime.init());
} else {
	ReadingTime.init();
}
