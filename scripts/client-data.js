/* ============================================
   Client Data Visualizer Tool Script
   ============================================ */

const ClientData = {
	data: {},
	
	init() {
		const refreshBtn = document.getElementById('refresh-data');
		const copyBtn = document.getElementById('copy-data');
		
		// Load initial data
		this.collectAllData();
		
		// Set up real-time updates
		this.setupInteractionTracking();
		
		// Event listeners
		if (refreshBtn) {
			refreshBtn.addEventListener('click', () => {
				this.collectAllData();
				if (ui && ui.notify) {
					ui.notify('<i>🔄</i> Data refreshed!');
				}
			});
		}
		
		if (copyBtn) {
			copyBtn.addEventListener('click', () => this.copyAllData());
		}
		
		// Auto-refresh location data every 30 seconds
		setInterval(() => this.fetchLocationData(), 30000);
	},
	
	collectAllData() {
		this.collectNavigatorData();
		this.collectScreenData();
		this.collectNetworkData();
		this.collectWindowData();
		this.collectStorageData();
		this.collectMediaData();
		this.fetchLocationData();
	},
	
	collectNavigatorData() {
		const container = document.getElementById('navigator-data');
		if (!container) return;
		
		const data = {
			'Platform': navigator.platform || 'Unknown',
			'Browser': this.getBrowserName(),
			'User Agent': navigator.userAgent,
			'Language': navigator.language,
			'Languages': navigator.languages?.join(', ') || 'Unknown',
			'Cookie Enabled': navigator.cookieEnabled ? 'Yes' : 'No',
			'Do Not Track': navigator.doNotTrack === '1' ? 'Yes' : 'No',
			'Hardware Concurrency': navigator.hardwareConcurrency || 'Unknown',
			'Max Touch Points': navigator.maxTouchPoints || 0
		};
		
		this.data.navigator = data;
		this.renderDataGrid(container, data);
	},
	
	collectScreenData() {
		const container = document.getElementById('screen-data');
		if (!container) return;
		
		const data = {
			'Screen Width': `${screen.width}px`,
			'Screen Height': `${screen.height}px`,
			'Available Width': `${screen.availWidth}px`,
			'Available Height': `${screen.availHeight}px`,
			'Color Depth': `${screen.colorDepth}-bit`,
			'Pixel Ratio': `${window.devicePixelRatio}x`,
			'Orientation': screen.orientation?.type || 'Unknown',
			'Orientation Angle': `${screen.orientation?.angle || 0}°`
		};
		
		this.data.screen = data;
		this.renderDataGrid(container, data);
	},
	
	collectNetworkData() {
		const container = document.getElementById('network-data');
		if (!container) return;
		
		const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
		
		const data = {
			'Connection Type': connection?.effectiveType || 'Unknown',
			'Downlink Speed': connection?.downlink ? `${connection.downlink} Mbps` : 'Unknown',
			'Round Trip Time': connection?.rtt ? `${connection.rtt}ms` : 'Unknown',
			'Save Data Mode': connection?.saveData ? 'Enabled' : 'Disabled',
			'Online Status': navigator.onLine ? 'Online' : 'Offline'
		};
		
		this.data.network = data;
		this.renderDataGrid(container, data);
	},
	
	collectWindowData() {
		const container = document.getElementById('window-data');
		if (!container) return;
		
		const data = {
			'Window Outer Width': `${window.outerWidth}px`,
			'Window Outer Height': `${window.outerHeight}px`,
			'Window Inner Width': `${window.innerWidth}px`,
			'Window Inner Height': `${window.innerHeight}px`,
			'Page Visibility': document.visibilityState,
			'Referrer': document.referrer || 'Direct/No Referrer',
			'URL': window.location.href,
			'Path': window.location.pathname
		};
		
		this.data.window = data;
		this.renderDataGrid(container, data);
	},
	
	collectStorageData() {
		const container = document.getElementById('storage-data');
		if (!container) return;
		
		// Cookies
		const cookies = document.cookie.split(';').filter(c => c.trim());
		const cookieData = cookies.map(c => {
			const [key, value] = c.trim().split('=');
			return { key, value };
		});
		
		// LocalStorage
		const localStorageData = [];
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			localStorageData.push({
				key,
				value: localStorage.getItem(key)
			});
		}
		
		// SessionStorage
		const sessionStorageData = [];
		for (let i = 0; i < sessionStorage.length; i++) {
			const key = sessionStorage.key(i);
			sessionStorageData.push({
				key,
				value: sessionStorage.getItem(key)
			});
		}
		
		this.data.storage = {
			cookies: cookieData,
			localStorage: localStorageData,
			sessionStorage: sessionStorageData
		};
		
		// Render storage data
		container.innerHTML = `
			<div class="data-item" style="grid-column: 1 / -1;">
				<span class="data-label">Cookies</span>
				<span class="data-value">${cookieData.length} cookie(s)</span>
			</div>
			<div class="data-item" style="grid-column: 1 / -1;">
				<span class="data-label">LocalStorage</span>
				<span class="data-value">${localStorageData.length} item(s)</span>
			</div>
			<div class="data-item" style="grid-column: 1 / -1;">
				<span class="data-label">SessionStorage</span>
				<span class="data-value">${sessionStorageData.length} item(s)</span>
			</div>
		`;
		
		// Add expandable details
		if (localStorageData.length > 0) {
			const lsDiv = document.createElement('div');
			lsDiv.className = 'storage-list';
			lsDiv.innerHTML = '<div class="data-label" style="margin-bottom: 0.5rem;">LocalStorage Items</div>' +
				localStorageData.map(item => `
					<div class="storage-item">
						<span class="storage-key">${this.escapeHtml(item.key)}</span>
						<span class="storage-value">${this.escapeHtml(item.value)}</span>
					</div>
				`).join('');
			container.appendChild(lsDiv);
		}
		
		if (sessionStorageData.length > 0) {
			const ssDiv = document.createElement('div');
			ssDiv.className = 'storage-list';
			ssDiv.innerHTML = '<div class="data-label" style="margin-bottom: 0.5rem;">SessionStorage Items</div>' +
				sessionStorageData.map(item => `
					<div class="storage-item">
						<span class="storage-key">${this.escapeHtml(item.key)}</span>
						<span class="storage-value">${this.escapeHtml(item.value)}</span>
					</div>
				`).join('');
			container.appendChild(ssDiv);
		}
	},
	
	async collectMediaData() {
		const container = document.getElementById('media-data');
		if (!container) return;
		
		try {
			const devices = await navigator.mediaDevices.enumerateDevices();
			const data = {
				'Media Devices Supported': 'Yes',
				'Total Devices': devices.length.toString()
			};
			
			this.data.media = { devices };
			
			// Render basic info
			this.renderDataGrid(container, data);
			
			// Add device list
			if (devices.length > 0) {
				devices.forEach(device => {
					const deviceDiv = document.createElement('div');
					deviceDiv.className = 'device-item';
					const icon = device.kind === 'audioinput' ? '🎤' : 
					           device.kind === 'videoinput' ? '📷' : '🔊';
					deviceDiv.innerHTML = `
						<span class="device-icon">${icon}</span>
						<span>${device.label || `${device.kind} (no permission)`}</span>
					`;
					container.appendChild(deviceDiv);
				});
			}
		} catch (err) {
			this.data.media = { error: 'Permission denied or not supported' };
			container.innerHTML = `
				<div class="data-item" style="grid-column: 1 / -1;">
					<span class="data-label">Media Devices</span>
					<span class="data-value empty">Not accessible (permission denied)</span>
				</div>
			`;
		}
	},
	
	async fetchLocationData() {
		const container = document.getElementById('location-data');
		if (!container) return;
		
		try {
			const response = await fetch('https://www.cloudflare.com/cdn-cgi/trace');
			const text = await response.text();
			const lines = text.split('\n');
			const data = {};
			
			lines.forEach(line => {
				const [key, value] = line.split('=');
				if (key && value) {
					data[key] = value;
				}
			});
			
			this.data.location = {
				'IP': data.ip || 'Unknown',
				'Country': data.loc || 'Unknown',
				'City': data.city || 'Unknown',
				'Region': data.region || 'Unknown',
				'Timezone': data.tz || 'Unknown',
				'ISP': data.isp || 'Unknown',
				'Cloudflare Ray ID': data.ray || 'Unknown'
			};
			
			this.renderDataGrid(container, this.data.location);
		} catch (err) {
			this.data.location = { error: 'Failed to fetch location' };
			container.innerHTML = `
				<div class="data-item" style="grid-column: 1 / -1;">
					<span class="data-label">Location Data</span>
					<span class="data-value empty">Failed to fetch (network error)</span>
				</div>
			`;
		}
	},
	
	setupInteractionTracking() {
		// Mouse tracking
		document.addEventListener('mousemove', (e) => {
			const el = document.getElementById('mouse-pos');
			if (el) {
				el.textContent = `X: ${e.pageX}, Y: ${e.pageY}`;
			}
		});
		
		// Scroll tracking
		window.addEventListener('scroll', () => {
			const el = document.getElementById('scroll-pos');
			if (el) {
				el.textContent = `${Math.round(window.scrollY)}px`;
			}
		});
		
		// Keyboard tracking
		document.addEventListener('keydown', (e) => {
			const el = document.getElementById('last-key');
			if (el) {
				el.textContent = e.code;
			}
		});
	},
	
	renderDataGrid(container, data) {
		container.innerHTML = Object.entries(data)
			.map(([key, value]) => `
				<div class="data-item">
					<span class="data-label">${this.escapeHtml(key)}</span>
					<span class="data-value">${this.escapeHtml(String(value))}</span>
				</div>
			`).join('');
	},
	
	getBrowserName() {
		const ua = navigator.userAgent;
		if (ua.includes('Firefox')) return 'Firefox';
		if (ua.includes('Edg')) return 'Edge';
		if (ua.includes('Chrome')) return 'Chrome';
		if (ua.includes('Safari')) return 'Safari';
		if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
		return 'Unknown';
	},
	
	escapeHtml(text) {
		const div = document.createElement('div');
		div.textContent = text;
		return div.innerHTML;
	},
	
	copyAllData() {
		const text = JSON.stringify(this.data, null, 2);
		navigator.clipboard.writeText(text).then(() => {
			if (ui && ui.notify) {
				ui.notify('<i>📋</i> All data copied to clipboard!');
			}
		}).catch(err => {
			console.error('Failed to copy:', err);
		});
	}
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => ClientData.init());
} else {
	ClientData.init();
}
