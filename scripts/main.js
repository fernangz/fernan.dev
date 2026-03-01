/* ============================================
   fernan.dev - Core JavaScript
   Handles SVG loading, mobile menu, custom scroll, and color animation
   ============================================ */

const ui = {
	// Cache for SVG icons to avoid repeated fetches
	svgCache: {},

	/**
	 * Load and inject SVG icons
	 * Finds elements with svg="icon-name" attribute and replaces with inline SVG
	 */
	files: async function() {
		const svgElements = document.querySelectorAll("[svg]");
		if (svgElements.length === 0) return;

		// Process SVGs sequentially to avoid blocking
		for (const tag of svgElements) {
			const icon = tag.getAttribute("svg");
			if (!icon) continue;

			// Check cache first for performance
			if (ui.svgCache[icon]) {
				ui.insertSVG(tag, ui.svgCache[icon]);
				continue;
			}

			// Check if already loaded in DOM
			const existingSVG = document.querySelector(`[svgdone="${icon}"]`);
			if (existingSVG) {
				const svgEl = existingSVG.querySelector('svg');
				if (svgEl) {
					ui.svgCache[icon] = svgEl.cloneNode(true).outerHTML;
					ui.insertSVG(tag, ui.svgCache[icon]);
				}
				continue;
			}

			// Fetch new SVG from server
			try {
				const response = await fetch(`/svgs/${icon}.svg`);
				if (!response.ok) throw new Error(`Failed to load ${icon}`);
				const svgCode = await response.text();
				ui.svgCache[icon] = svgCode;
				ui.insertSVG(tag, svgCode);
			} catch (error) {
				console.error(`Error loading SVG ${icon}:`, error);
			}
		}

		// Setup code blocks for copying
		ui.setupCodeBlocks();
	},

	/**
	 * Insert SVG code into element
	 * @param {HTMLElement} element - Target element
	 * @param {string} svgCode - SVG markup
	 */
	insertSVG: function(element, svgCode) {
		element.innerHTML = svgCode + element.innerHTML;
		element.setAttribute("svgdone", element.getAttribute("svg"));
		element.removeAttribute("svg");
	},

	/**
	 * Setup code blocks with click-to-copy functionality
	 */
	setupCodeBlocks: function() {
		document.querySelectorAll("pre").forEach((code) => {
			// Skip if already processed
			if (code.querySelector('code')) return;

			code.innerHTML = "<code>" + code.innerHTML + "</code>";
			if (code.hasAttribute("code")) {
				code.classList.add("language-" + code.getAttribute("code"));
			}
			
			code.addEventListener("click", (e) => {
				const codeElement = e.currentTarget.querySelector("code");
				if (!codeElement) return;

				navigator.clipboard.writeText(codeElement.innerText)
					.then(() => {
						if (ui && ui.notify) {
							ui.notify("<i>📋</i> Copied to clipboard.");
						}
					})
					.catch(() => {
						// Fallback for older browsers
						const textArea = document.createElement('textarea');
						textArea.value = codeElement.innerText;
						document.body.appendChild(textArea);
						textArea.select();
						document.execCommand('copy');
						document.body.removeChild(textArea);
						if (ui && ui.notify) {
							ui.notify("<i>📋</i> Copied to clipboard.");
						}
					});
			});
		});
	},

	/**
	 * Setup mobile menu toggle
	 */
	menu: function() {
		const toggle = document.querySelector('.toggle');
		const nav = document.querySelector('nav');
		if (!toggle || !nav) return;

		toggle.addEventListener('click', () => {
			nav.classList.toggle('menu');
		}, { passive: true });
	},

	/**
	 * Setup custom scrollbar
	 * Creates a custom scrollbar for the main content area
	 */
	scroll: function() {
		// Remove existing scroll element
		const existingScroll = document.body.querySelector(".scroll");
		if (existingScroll) {
			existingScroll.remove();
		}

		const section = document.body.querySelector("main > section");
		if (!section) return;

		// Create scroll elements
		const scroll = document.createElement("div");
		scroll.classList.add("scroll");

		const track = document.createElement("div");
		track.classList.add("track");
		scroll.appendChild(track);

		const thumb = document.createElement("div");
		thumb.classList.add("thumb");
		thumb.setAttribute('cursor', 'hand');
		scroll.appendChild(thumb);

		document.body.appendChild(scroll);

		// Calculate scroll ratio
		const scrollRatio = section.clientHeight / section.scrollHeight;
		
		// Only show scroll if content overflows
		if (scrollRatio < 1 && scrollRatio > 0) {
			scroll.classList.add("show");
			thumb.style.height = `${Math.max(scrollRatio * 100, 2)}%`;
		} else {
			return;
		}

		let pos = { top: 0, y: 0 };

		// Mouse/touch down handler
		const mouseDownThumbHandler = (e) => {
			pos = {
				top: section.scrollTop,
				y: e.clientY || e.touches?.[0]?.clientY || 0,
			};
			scroll.classList.add("grabbing");
			thumb.setAttribute('cursor', 'grab');
			document.body.classList.add("grabbing");
			
			document.addEventListener("mousemove", scrollActionHandler, { passive: true });
			document.addEventListener("touchmove", scrollActionHandler, { passive: true });
			document.addEventListener("mouseup", mouseUpHandler, { passive: true });
			document.addEventListener("touchend", mouseUpHandler, { passive: true });
		};

		// Scroll action handler
		const scrollActionHandler = (e) => {
			const y = e.clientY || e.touches?.[0]?.clientY || 0;
			const bound = track.getBoundingClientRect();
			const percentage = (y - bound.top) / bound.height;
			section.scrollTop = percentage * (section.scrollHeight - section.clientHeight);
		};

		// Mouse/touch up handler
		const mouseUpHandler = () => {
			scroll.classList.remove("grabbing");
			thumb.setAttribute('cursor', 'hand');
			document.body.classList.remove("grabbing");
			
			document.removeEventListener("mousemove", scrollActionHandler);
			document.removeEventListener("touchmove", scrollActionHandler);
			document.removeEventListener("mouseup", mouseUpHandler);
			document.removeEventListener("touchend", mouseUpHandler);
		};

		// Section scroll handler
		const scrollSectionHandler = () => {
			window.requestAnimationFrame(() => {
				thumb.style.top = `${(section.scrollTop * 100) / section.scrollHeight}%`;
			});
		};

		// Attach event listeners
		section.addEventListener("scroll", scrollSectionHandler, { passive: true });
		thumb.addEventListener("mousedown", mouseDownThumbHandler, { passive: true });
		thumb.addEventListener("touchstart", mouseDownThumbHandler, { passive: true });
		track.addEventListener("click", scrollActionHandler, { passive: true });
	},

	/**
	 * Animated color accent for links
	 * Cycles through hue values to create dynamic accent color
	 */
	color: function() {
		// Check if already running
		let styleElement = document.getElementById("colorGeneratedVariable");
		if (styleElement) return;

		// Create style element
		styleElement = document.createElement("style");
		styleElement.id = "colorGeneratedVariable";
		document.head.appendChild(styleElement);

		let hue = 160;
		let lastUpdate = 0;
		const interval = 1000 / 24; // 24 FPS

		const loop = (timestamp) => {
			// Stop if element removed
			if (!styleElement || !styleElement.isConnected) return;

			requestAnimationFrame(loop);

			// Throttle updates for performance
			if (timestamp - lastUpdate < interval) return;
			lastUpdate = timestamp;

			hue = (hue + 1) % 360;
			styleElement.textContent = `:root{--color:hsl(${hue},80%,80%);}`;
		};

		requestAnimationFrame(loop);
	},

	/**
	 * Show notification message
	 * @param {string} message - Message to display (can include HTML)
	 */
	notify: function(message) {
		// Get or create notifications container
		let notice = document.getElementById('notifications');
		if (!notice) {
			notice = document.createElement('aside');
			notice.id = 'notifications';
			document.querySelector('main')?.appendChild(notice);
		}

		// Create notification div
		const noticeDiv = document.createElement('div');
		const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
		noticeDiv.id = id;
		noticeDiv.innerHTML = message;
		notice.appendChild(noticeDiv);

		// Auto-remove after 8 seconds
		setTimeout(() => {
			const element = document.getElementById(id);
			if (element) {
				element.remove();
			}
			// Remove container if empty
			if (notice.children.length === 0) {
				notice.remove();
			}
		}, 8000);
	}
};

// Initialize on page load
window.addEventListener('load', () => {
	ui.files();
	ui.menu();
	ui.scroll();
	ui.color();
	
	// Set active navigation state
	ui.setActiveNav();
}, { passive: true });

// Debounced resize handler for scroll
let resizeTimeout;
window.addEventListener('resize', () => {
	clearTimeout(resizeTimeout);
	resizeTimeout = setTimeout(() => {
		ui.scroll();
	}, 150);
}, { passive: true });

/**
 * Set active state on navigation based on current page
 */
ui.setActiveNav = function() {
	const currentPath = window.location.pathname;
	const navLinks = document.querySelectorAll('nav ul li a');
	
	navLinks.forEach(link => {
		const href = link.getAttribute('href');
		if(href === '/' && currentPath === '/') {
			link.classList.add('active');
		} else if (href !== '/' && currentPath.startsWith(href)) {
			link.classList.add('active');
		}
	});
};

// Optimized MutationObserver with proper logic
const observer = new MutationObserver((mutations) => {
	let shouldFireUI = false;
	
	for (const mutation of mutations) {
		for (const node of mutation.addedNodes) {
			if (node.nodeType === 1) { // Element node
				if (node.hasAttribute?.('svg') || node.tagName === 'PRE') {
					shouldFireUI = true;
					break;
				}
			}
		}
		if (shouldFireUI) break;
	}
	
	if (shouldFireUI) {
		ui.files();
	}
});

observer.observe(document, { childList: true, subtree: true });
