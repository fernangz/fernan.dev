/* ============================================
   Client Data Visualizer Tool Script
   ============================================ */

const ClientDataVisualizer = {
	init() {
		const refreshBtn = document.getElementById('refresh-data');
		
		this.refreshData();

		if (refreshBtn) {
			refreshBtn.addEventListener('click', () => this.refreshData());
		}
	},

	refreshData() {
		this.renderCookies();
		this.renderLocalStorage();
		this.renderSessionStorage();
	},

	renderCookies() {
		const container = document.getElementById('cookies-container');
		if (!container) return;

		const cookies = this.getCookies();
		this.renderData(container, cookies);
	},

	renderLocalStorage() {
		const container = document.getElementById('localstorage-container');
		if (!container) return;

		const data = this.getLocalStorage();
		this.renderData(container, data);
	},

	renderSessionStorage() {
		const container = document.getElementById('sessionstorage-container');
		if (!container) return;

		const data = this.getSessionStorage();
		this.renderData(container, data);
	},

	getCookies() {
		const cookies = {};
		document.cookie.split(';').forEach(cookie => {
			const [key, value] = cookie.trim().split('=');
			if (key) cookies[key] = value;
		});
		return cookies;
	},

	getLocalStorage() {
		const data = {};
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			data[key] = localStorage.getItem(key);
		}
		return data;
	},

	getSessionStorage() {
		const data = {};
		for (let i = 0; i < sessionStorage.length; i++) {
			const key = sessionStorage.key(i);
			data[key] = sessionStorage.getItem(key);
		}
		return data;
	},

	renderData(container, data) {
		container.innerHTML = '';
		
		if (Object.keys(data).length === 0) {
			container.innerHTML = '<p class="no-data">No data available</p>';
			return;
		}

		Object.entries(data).forEach(([key, value]) => {
			const item = document.createElement('div');
			item.className = 'data-item';
			item.innerHTML = `
				<span class="data-key">${key}</span>
				<span class="data-value">${typeof value === 'object' ? JSON.stringify(value) : value}</span>
			`;
			container.appendChild(item);
		});
	}
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => ClientDataVisualizer.init());
} else {
	ClientDataVisualizer.init();
}
