/* ============================================
   Tools Index Search Script
   Real-time search filtering for tools
   ============================================ */

const ToolsSearch = {
	init() {
		this.searchInput = document.getElementById('tools-search');
		this.countDisplay = document.getElementById('tools-count');
		this.toolLinks = document.querySelectorAll('.tools-list a');
		
		if (!this.searchInput || !this.countDisplay) return;
		
		this.searchInput.addEventListener('input', (e) => {
			this.filterTools(e.target.value.toLowerCase());
		});
		
		// Initial count
		this.updateCount(this.toolLinks.length);
	},
	
	filterTools(query) {
		let visibleCount = 0;
		
		this.toolLinks.forEach(link => {
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
		document.querySelectorAll('.tools-section').forEach(section => {
			const visibleItems = section.querySelectorAll('.tools-list li[style=""]');
			const allItems = section.querySelectorAll('.tools-list li');
			
			// Check if any items are visible
			let hasVisible = false;
			allItems.forEach(item => {
				if (item.style.display !== 'none') {
					hasVisible = true;
				}
			});
			
			section.style.display = hasVisible || query === '' ? '' : 'none';
		});
	},
	
	updateCount(count) {
		this.countDisplay.textContent = `${count} tool${count !== 1 ? 's' : ''} found`;
	}
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => ToolsSearch.init());
} else {
	ToolsSearch.init();
}
