/* ============================================
   fernan.dev - Core JavaScript
   Optimized and Bug-Fixed Version
   ============================================ */

const ui = {
	// Cache for SVG icons to avoid repeated fetches
	svgCache: {},

	files: async () => {
		const svgElements = document.querySelectorAll("[svg]");
		if (svgElements.length === 0) return;

		// Process SVGs in batches to avoid blocking
		for (const tag of svgElements) {
			const icon = tag.getAttribute("svg");
			if (!icon) continue; // Skip if no icon attribute

			// Check cache first
			if (this.svgCache[icon]) {
				this.insertSVG(tag, this.svgCache[icon]);
				continue;
			}

			// Check if already loaded in DOM
			const existingSVG = document.querySelector(`[svgdone="${icon}"]`);
			if (existingSVG) {
				const svgEl = existingSVG.querySelector('svg');
				if (svgEl) {
					this.svgCache[icon] = svgEl.cloneNode(true).outerHTML;
					this.insertSVG(tag, this.svgCache[icon]);
				}
				continue;
			}

			// Fetch new SVG
			try {
				const response = await fetch(`/svgs/${icon}.svg`);
				if (!response.ok) throw new Error(`Failed to load ${icon}`);
				const svgCode = await response.text();
				this.svgCache[icon] = svgCode;
				this.insertSVG(tag, svgCode);
			} catch (error) {
				console.error(`Error loading SVG ${icon}:`, error);
			}
		}

		// Setup code blocks
		this.setupCodeBlocks();
	},

	insertSVG(element, svgCode) {
		element.innerHTML = svgCode + element.innerHTML;
		element.setAttribute("svgdone", element.getAttribute("svg"));
		element.removeAttribute("svg");
	},

	setupCodeBlocks() {
		document.querySelectorAll("pre").forEach((code) => {
			// Only process if not already processed
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

	menu: () => {
		const toggle = document.querySelector('.toggle');
		const nav = document.querySelector('nav');
		if (!toggle || !nav) return;
		
		toggle.addEventListener('click', () => {
			nav.classList.toggle('menu');
		}, { passive: true });
	},

	scroll: () => {
		const existingScroll = document.body.querySelector(".scroll");
		if (existingScroll) {
			existingScroll.remove();
		}
		
		const section = document.body.querySelector("main > section");
		if (!section) return;

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
		
		const scrollRatio = section.clientHeight / section.scrollHeight;
		if (scrollRatio < 1 && scrollRatio > 0) {
			scroll.classList.add("show");
			thumb.style.height = `${Math.max(scrollRatio * 100, 2)}%`;
		} else {
			return; // Don't show scroll if not needed
		}

		let pos = { top: 0, y: 0 };
		
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

		const scrollActionHandler = (e) => {
			const y = e.clientY || e.touches?.[0]?.clientY || 0;
			const bound = track.getBoundingClientRect();
			const percentage = (y - bound.top) / bound.height;
			section.scrollTop = percentage * (section.scrollHeight - section.clientHeight);
		};

		const mouseUpHandler = () => {
			scroll.classList.remove("grabbing");
			thumb.setAttribute('cursor', 'hand');
			document.body.classList.remove("grabbing");
			document.removeEventListener("mousemove", scrollActionHandler);
			document.removeEventListener("touchmove", scrollActionHandler);
			document.removeEventListener("mouseup", mouseUpHandler);
			document.removeEventListener("touchend", mouseUpHandler);
		};

		const scrollSectionHandler = () => {
			window.requestAnimationFrame(() => {
				thumb.style.top = `${(section.scrollTop * 100) / section.scrollHeight}%`;
			});
		};

		section.addEventListener("scroll", scrollSectionHandler, { passive: true });
		thumb.addEventListener("mousedown", mouseDownThumbHandler, { passive: true });
		thumb.addEventListener("touchstart", mouseDownThumbHandler, { passive: true });
		track.addEventListener("click", scrollActionHandler, { passive: true });
	},

	color: () => {
		// Only run if color animation is needed
		let styleElement = document.getElementById("colorGeneratedVariable");
		if (styleElement) return; // Already running

		const style = document.createElement("style");
		style.id = "colorGeneratedVariable";
		document.head.appendChild(style);
		styleElement = style; // Update reference

		let hue = 160;
		let lastUpdate = 0;
		const interval = 1000 / 24; // 24 FPS

		const loop = (timestamp) => {
			if (!styleElement || !styleElement.isConnected) return; // Stop if element removed

			requestAnimationFrame(loop);

			// Throttle updates
			if (timestamp - lastUpdate < interval) return;
			lastUpdate = timestamp;

			hue = (hue + 1) % 360;
			style.textContent = `:root{--color:hsl(${hue},80%,80%);}`;
		};

		requestAnimationFrame(loop);
	},

	notify: (message) => {
		let notice = document.getElementById('notifications');
		if (!notice) {
			notice = document.createElement('aside');
			notice.id = 'notifications';
			document.querySelector('main')?.appendChild(notice);
		}

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

// Initialize on load
window.addEventListener('load', () => {
	ui.files();
	ui.menu();
	ui.scroll();
	ui.color();
}, { passive: true });

// Debounced resize handler
let resizeTimeout;
window.addEventListener('resize', () => {
	clearTimeout(resizeTimeout);
	resizeTimeout = setTimeout(() => {
		ui.scroll();
	}, 150);
}, { passive: true });

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
