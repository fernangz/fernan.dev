/* ============================================
   Articles Index Search Script
   Real-time search filtering for articles
   ============================================ */

const ArticlesSearch = {
	init() {
		this.searchInput = document.getElementById('articles-search');
		this.countDisplay = document.getElementById('articles-count');
		this.articleLinks = document.querySelectorAll('.articles-list a');
		
		if (!this.searchInput || !this.countDisplay) return;
		
		this.searchInput.addEventListener('input', (e) => {
			this.filterArticles(e.target.value.toLowerCase());
		});
		
		// Initial count
		this.updateCount(this.articleLinks.length);
	},
	
	filterArticles(query) {
		let visibleCount = 0;
		
		this.articleLinks.forEach(link => {
			const text = link.textContent.toLowerCase();
			const parent = link.closest('li');
			
			if (text.includes(query)) {
				parent.style.display = '';
				visibleCount++;
			} else {
				parent.style.display = 'none';
			}
		});
		
		this.updateCount(visibleCount);
		
		// Hide empty sections
		document.querySelectorAll('.articles-section').forEach(section => {
			let hasVisible = false;
			const allItems = section.querySelectorAll('.articles-list li');
			
			allItems.forEach(item => {
				if (item.style.display !== 'none') {
					hasVisible = true;
				}
			});
			
			section.style.display = hasVisible || query === '' ? '' : 'none';
		});
	},
	
	updateCount(count) {
		this.countDisplay.textContent = `${count} article${count !== 1 ? 's' : ''} found`;
	}
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => ArticlesSearch.init());
} else {
	ArticlesSearch.init();
}
