/* ============================================
   Data Loader Utility
   ============================================ */

const DataLoader = {
	cache: {},

	async load(filename) {
		if (this.cache[filename]) {
			return this.cache[filename];
		}

		try {
			const response = await fetch(`/data/${filename}`);
			if (!response.ok) {
				throw new Error(`Failed to load ${filename}`);
			}
			const data = await response.json();
			this.cache[filename] = data;
			return data;
		} catch (error) {
			console.error(`Error loading ${filename}:`, error);
			return null;
		}
	},

	getEmoji(symbol) {
		const emojis = this.cache['emoji.json'];
		if (!emojis || !emojis[symbol]) {
			return null;
		}
		return emojis[symbol];
	},

	getAllEmojis() {
		return this.cache['emoji.json'] || {};
	},

	searchEmojis(query) {
		const emojis = this.cache['emoji.json'];
		if (!emojis) return [];

		const lowerQuery = query.toLowerCase();
		const results = [];

		for (const [symbol, data] of Object.entries(emojis)) {
			if (data.name.toLowerCase().includes(lowerQuery) ||
				data.group.toLowerCase().includes(lowerQuery)) {
				results.push({ symbol, ...data });
			}
		}

		return results;
	}
};

// Export for use in other scripts
window.DataLoader = DataLoader;
