const ui = {
	files: () => {
		document.querySelectorAll("[svg]").forEach(async (tag) => {
			var icon = tag.getAttribute("svg");
			if (document.body.querySelector('[svgdone="' + icon + '"]')) {
				var copy = document.body.querySelector('[svgdone="' + icon + '"] svg').cloneNode(true);
				document.querySelectorAll('[svg="' + icon + '"]').forEach((svg) => {
					if (svg.hasAttribute("svg") && svg.getAttribute("svg") == icon) {
						svg.innerHTML = copy + svg.innerHTML;
						svg.setAttribute("svgdone", icon);
						svg.removeAttribute("svg");
					}
				});
			} else {
				let svgCode = await fetch(`/svgs/${icon}.svg`).then(response => response.text()).then(data => { return data; });
				document.querySelectorAll('[svg="' + icon + '"]').forEach((svg) => {
					if (svg.hasAttribute("svg") && svg.getAttribute("svg") == icon) {
						svg.innerHTML = svgCode + svg.innerHTML;
						svg.setAttribute("svgdone", icon);
						svg.removeAttribute("svg");
					}
				});
			}
		});
		document.querySelectorAll("pre").forEach((code) => {
			code.innerHTML = "<code>" + code.innerHTML + "</code>";
			if (code.hasAttribute("code")) {
				code.classList.add("language-" + code.getAttribute("code"));
			}
			code.addEventListener("click", (e) => {
				e = e.currentTarget.querySelector("code");
				navigator.clipboard.writeText(e.innerText);
				ui.notify("<i>📋</i> Copy to clipboard.");
			});
		});
		if (
			document.querySelectorAll("pre").length > 0 &&
			!document.head.querySelector('link[href="/prism.css"]') &&
			!document.body.querySelector('script[src="/prism.js"]')
		) {
			let link = document.createElement("link");
			link.setAttribute("rel", "stylesheet");
			link.setAttribute("href", "/prism.css");
			document.head.append(link);
			let script = document.createElement("script");
			script.setAttribute("type", "text/javascript");
			script.setAttribute("src", "/prism.js");
			document.body.append(script);
		}
	},
	menu: () => {
		document.querySelector('.toggle')?.addEventListener('click', ()=>{
			document.querySelector('nav').classList.toggle('menu');
		}, {passive: true})
	},
	scroll: () => {
		if(document.body.querySelector(".scroll")){
			document.body.querySelector(".scroll").remove();
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
		if (scrollRatio < 1) {
			scroll.classList.add("show");
		}
		thumb.style.height = `${scrollRatio * 100}%`;
		let pos = { top: 0, y: 0 };
		const mouseDownThumbHandler = function (e) {
			pos = {
				top: section.scrollTop,
				y: e.clientY || e.touches[0].clientY,
			};
			scroll.classList.add("grabbing");
			thumb.setAttribute('cursor', 'grab');
			document.body.classList.add("grabbing");
			document.addEventListener("mousemove", scrollActionHandler, {passive: true});
			document.addEventListener("touchmove", scrollActionHandler, {passive: true});
			document.addEventListener("mouseup", mouseUpHandler, {passive: true});
			document.addEventListener("touchend", mouseUpHandler, {passive: true});
		};
		const scrollActionHandler = function (e) {
			let y = e.clientY || e.touches[0].clientY;
			const bound = track.getBoundingClientRect();
			const percentage = (y - bound.top) / bound.height;
			section.scrollTop = percentage * (section.scrollHeight - section.clientHeight);
		};
		const mouseUpHandler = function (e) {
			scroll.classList.remove("grabbing");
			thumb.setAttribute('cursor', 'hand');
			document.body.classList.remove("grabbing");
			document.removeEventListener("mousemove", scrollActionHandler);
			document.removeEventListener("touchmove", scrollActionHandler);
			document.removeEventListener("mouseup", mouseUpHandler);
			document.removeEventListener("touchend", mouseUpHandler);
		};
		const scrollSectionHandler = function () {
			window.requestAnimationFrame(function () {
				thumb.style.top = `${(section.scrollTop * 100) / section.scrollHeight}%`;
			});
		};
		section.addEventListener("scroll", scrollSectionHandler, {passive: true});
		thumb.addEventListener("mousedown", mouseDownThumbHandler, {passive: true});
		thumb.addEventListener("touchstart", mouseDownThumbHandler, {passive: true});
		track.addEventListener("click", scrollActionHandler, {passive: true});
	},
	color: () => {
		if(!document.querySelector("style#colorGeneratedVariable")){
			const style = document.createElement("style");
			style.id = "colorGeneratedVariable";
			document.head.appendChild(style);
		}
		var fps = 24;
		var interval = 1000/fps;
		var then;
		let hue = 160;
		function loop(timestamp) {
			requestAnimationFrame(loop);
			if (then === undefined) {
				then = timestamp;
			}
			const delta = timestamp - then;
			if (delta > interval) {
				then = timestamp - (delta % interval);
				hue = hue + 1 == 360 ? 0 : hue + 1;
				document.querySelector("style#colorGeneratedVariable").textContent = ":root{--color:hsl(" + hue + ",80%,80%);}";
			}
		}
		loop();
	},
	notify: t => {
		let notice = document.createElement('div');
		const id = (new Date()).getTime().toString(36) + Math.random().toString(36).slice(2);
		notice.setAttribute('id', id);
		notice.innerHTML = t;
		if(document.body.querySelector('aside#notifications')){
			document.body.querySelector('aside#notifications').append(notice);
		}else{
			let aside = document.createElement('aside');
			aside.setAttribute('id', 'notifications');
			document.querySelector('main').append(aside);
			aside.append(notice);
		}
		setTimeout(()=>{
			const el = document.body.querySelector('aside#notifications div#'+id);
			if (el) el.remove();
		}, 8000)
	}
};

// Copy to Clipboard Functionality for tools
function copyToClipboard(text, feedbackMessage = 'Copied!') {
    navigator.clipboard.writeText(text).then(() => {
        if (ui && ui.notify) {
            ui.notify(`<i>📋</i> ${feedbackMessage}`);
        }
    }).catch(err => {
        console.error('Failed to copy:', err);
        fallbackCopyToClipboard(text);
    });
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        if (ui && ui.notify) {
            ui.notify('<i>📋</i> Copied!');
        }
    } catch (err) {
        console.error('Fallback copy failed:', err);
    }
    document.body.removeChild(textArea);
}

// Tool initialization functions
function initColorConverter() {
    const colorInput = document.getElementById('color-input');
    const hexInput = document.getElementById('hex-input');
    const rgbInput = document.getElementById('rgb-input');
    const hslInput = document.getElementById('hsl-input');
    const generatePaletteBtn = document.getElementById('generate-palette');
    const paletteContainer = document.getElementById('palette-container');

    if (!colorInput) return;

    colorInput.addEventListener('input', (e) => {
        const hex = e.target.value;
        updateColorInputs(hex);
    });

    if (hexInput) {
        hexInput.addEventListener('input', (e) => {
            let hex = e.target.value;
            if (!hex.startsWith('#')) hex = '#' + hex;
            if (/^#[0-9A-F]{6}$/i.test(hex)) {
                updateColorInputs(hex);
            }
        });
    }

    if (rgbInput) {
        rgbInput.addEventListener('input', (e) => {
            const rgb = e.target.value;
            const hex = rgbToHex(rgb);
            if (hex) {
                updateColorInputs(hex);
            }
        });
    }

    if (hslInput) {
        hslInput.addEventListener('input', (e) => {
            const hsl = e.target.value;
            const hex = hslToHex(hsl);
            if (hex) {
                updateColorInputs(hex);
            }
        });
    }

    if (generatePaletteBtn && paletteContainer) {
        generatePaletteBtn.addEventListener('click', () => {
            const baseColor = colorInput.value;
            generatePalette(baseColor, paletteContainer);
        });
    }
}

function updateColorInputs(hex) {
    const colorInput = document.getElementById('color-input');
    const hexInput = document.getElementById('hex-input');
    const rgbInput = document.getElementById('rgb-input');
    const hslInput = document.getElementById('hsl-input');

    if (colorInput) colorInput.value = hex;
    if (hexInput) hexInput.value = hex;
    if (rgbInput) rgbInput.value = hexToRgb(hex);
    if (hslInput) hslInput.value = hexToHsl(hex);
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
        const r = parseInt(result[1], 16);
        const g = parseInt(result[2], 16);
        const b = parseInt(result[3], 16);
        return `rgb(${r}, ${g}, ${b})`;
    }
    return '';
}

function rgbToHex(rgb) {
    const match = rgb.match(/(\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
        const r = parseInt(match[1]);
        const g = parseInt(match[2]);
        const b = parseInt(match[3]);
        return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    }
    return '';
}

function hexToHsl(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
        let r = parseInt(result[1], 16) / 255;
        let g = parseInt(result[2], 16) / 255;
        let b = parseInt(result[3], 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }

        return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
    }
    return '';
}

function hslToHex(hsl) {
    const match = hsl.match(/(\d+),\s*(\d+)%,\s*(\d+)%/);
    if (match) {
        let h = parseInt(match[1]) / 360;
        let s = parseInt(match[2]) / 100;
        let l = parseInt(match[3]) / 100;

        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return '#' + [r, g, b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
    }
    return '';
}

function generatePalette(baseColor, container) {
    const hex = baseColor.startsWith('#') ? baseColor : '#' + baseColor;
    const hsl = hexToHsl(hex);
    const hMatch = hsl.match(/(\d+)/);
    if (!hMatch) return;
    
    const baseHue = parseInt(hMatch[1]);
    const hueOffsets = [0, 30, 60, 120, 180, 210, 240, 300];
    
    container.innerHTML = '';
    
    hueOffsets.forEach((offset) => {
        const newHue = (baseHue + offset) % 360;
        const newHsl = `hsl(${newHue}, 70%, 50%)`;
        const newHex = hslToHex(newHsl);
        
        const colorBox = document.createElement('div');
        colorBox.className = 'color-box';
        colorBox.style.backgroundColor = newHex;
        colorBox.innerHTML = `<span>${newHex}</span>`;
        colorBox.addEventListener('click', () => {
            copyToClipboard(newHex, `${newHex} copied!`);
        });
        
        container.appendChild(colorBox);
    });
}

function initSymbolsEmojis() {
    const symbolsContainer = document.getElementById('symbols-container');
    if (!symbolsContainer) return;

    const symbols = [
        { symbol: '©', code: '&copy;', name: 'Copyright' },
        { symbol: '®', code: '&reg;', name: 'Registered' },
        { symbol: '™', code: '&trade;', name: 'Trademark' },
        { symbol: '§', code: '&sect;', name: 'Section' },
        { symbol: '¶', code: '&para;', name: 'Paragraph' },
        { symbol: '†', code: '&dagger;', name: 'Dagger' },
        { symbol: '‡', code: '&Dagger;', name: 'Double Dagger' },
        { symbol: '•', code: '&bull;', name: 'Bullet' },
        { symbol: '…', code: '&hellip;', name: 'Ellipsis' },
        { symbol: '—', code: '&mdash;', name: 'Em Dash' },
        { symbol: '–', code: '&ndash;', name: 'En Dash' },
        { symbol: '°', code: '&deg;', name: 'Degree' },
        { symbol: '±', code: '&plusmn;', name: 'Plus Minus' },
        { symbol: '×', code: '&times;', name: 'Multiply' },
        { symbol: '÷', code: '&divide;', name: 'Divide' },
        { symbol: '√', code: '&radic;', name: 'Square Root' },
        { symbol: '∞', code: '&infin;', name: 'Infinity' },
        { symbol: '≠', code: '&ne;', name: 'Not Equal' },
        { symbol: '≈', code: '&asymp;', name: 'Approximately' },
        { symbol: '≤', code: '&le;', name: 'Less or Equal' },
        { symbol: '≥', code: '&ge;', name: 'Greater or Equal' },
        { symbol: '←', code: '&larr;', name: 'Left Arrow' },
        { symbol: '→', code: '&rarr;', name: 'Right Arrow' },
        { symbol: '↑', code: '&uarr;', name: 'Up Arrow' },
        { symbol: '↓', code: '&darr;', name: 'Down Arrow' },
        { symbol: '⇒', code: '&rArr;', name: 'Double Right Arrow' },
        { symbol: '∀', code: '&forall;', name: 'For All' },
        { symbol: '∂', code: '&part;', name: 'Partial' },
        { symbol: '∃', code: '&exist;', name: 'Exists' },
        { symbol: '∅', code: '&empty;', name: 'Empty Set' },
        { symbol: '∈', code: '&isin;', name: 'Element of' },
        { symbol: '∉', code: '&notin;', name: 'Not Element of' },
        { symbol: '∑', code: '&sum;', name: 'Sum' },
        { symbol: '∏', code: '&prod;', name: 'Product' },
        { symbol: 'π', code: '&pi;', name: 'Pi' },
        { symbol: 'Ω', code: '&Omega;', name: 'Omega' },
        { symbol: 'Δ', code: '&Delta;', name: 'Delta' },
        { symbol: 'Σ', code: '&Sigma;', name: 'Sigma' },
        { symbol: 'µ', code: '&micro;', name: 'Micro' },
        { symbol: '$', code: '&#36;', name: 'Dollar' },
        { symbol: '€', code: '&euro;', name: 'Euro' },
        { symbol: '£', code: '&pound;', name: 'Pound' },
        { symbol: '¥', code: '&yen;', name: 'Yen' },
        { symbol: '¢', code: '&cent;', name: 'Cent' },
        { symbol: '₿', code: '&#8376;', name: 'Bitcoin' },
        { symbol: '😀', code: '&#128512;', name: 'Grinning Face' },
        { symbol: '😂', code: '&#128514;', name: 'Joy' },
        { symbol: '🥰', code: '&#129392;', name: 'Smiling Hearts' },
        { symbol: '😍', code: '&#128525;', name: 'Heart Eyes' },
        { symbol: '🤔', code: '&#129300;', name: 'Thinking' },
        { symbol: '👍', code: '&#128077;', name: 'Thumbs Up' },
        { symbol: '👎', code: '&#128078;', name: 'Thumbs Down' },
        { symbol: '❤️', code: '&#10084;', name: 'Heart' },
        { symbol: '🔥', code: '&#128293;', name: 'Fire' },
        { symbol: '✨', code: '&#10024;', name: 'Sparkles' },
        { symbol: '🎉', code: '&#127881;', name: 'Party' },
        { symbol: '✅', code: '&#9989;', name: 'Check Mark' },
        { symbol: '❌', code: '&#10060;', name: 'Cross Mark' },
        { symbol: '⭐', code: '&#11088;', name: 'Star' },
        { symbol: '🌟', code: '&#127775;', name: 'Glowing Star' },
        { symbol: '📌', code: '&#128204;', name: 'Pin' },
        { symbol: '💡', code: '&#128161;', name: 'Light Bulb' },
        { symbol: '📝', code: '&#128221;', name: 'Memo' },
        { symbol: '🔗', code: '&#128279;', name: 'Link' },
        { symbol: '⚠️', code: '&#9888;', name: 'Warning' },
        { symbol: '📱', code: '&#128241;', name: 'Phone' },
        { symbol: '💻', code: '&#128187;', name: 'Laptop' },
        { symbol: '🖥️', code: '&#128421;', name: 'Desktop' },
        { symbol: '⌨️', code: '&#9000;', name: 'Keyboard' },
        { symbol: '🖱️', code: '&#128431;', name: 'Mouse' },
    ];

    symbols.forEach(item => {
        const symbolEl = document.createElement('div');
        symbolEl.className = 'symbol-item';
        symbolEl.innerHTML = `
            <span class="symbol">${item.symbol}</span>
            <span class="code">${item.name}</span>
        `;
        symbolEl.addEventListener('click', () => {
            copyToClipboard(item.symbol, `${item.symbol} copied!`);
        });
        symbolsContainer.appendChild(symbolEl);
    });
}

function initHtmlEntities() {
    const entitiesContainer = document.getElementById('entities-container');
    if (!entitiesContainer) return;

    const entities = [
        { symbol: '<', code: '&lt;', name: 'Less Than' },
        { symbol: '>', code: '&gt;', name: 'Greater Than' },
        { symbol: '&', code: '&amp;', name: 'Ampersand' },
        { symbol: '"', code: '&quot;', name: 'Quotation Mark' },
        { symbol: '\'', code: '&apos;', name: 'Apostrophe' },
        { symbol: '©', code: '&copy;', name: 'Copyright' },
        { symbol: '®', code: '&reg;', name: 'Registered' },
        { symbol: '™', code: '&trade;', name: 'Trademark' },
        { symbol: '€', code: '&euro;', name: 'Euro' },
        { symbol: '£', code: '&pound;', name: 'Pound' },
        { symbol: '¥', code: '&yen;', name: 'Yen' },
        { symbol: '¢', code: '&cent;', name: 'Cent' },
        { symbol: '§', code: '&sect;', name: 'Section' },
        { symbol: '¶', code: '&para;', name: 'Paragraph' },
        { symbol: '†', code: '&dagger;', name: 'Dagger' },
        { symbol: '‡', code: '&Dagger;', name: 'Double Dagger' },
        { symbol: '•', code: '&bull;', name: 'Bullet' },
        { symbol: '…', code: '&hellip;', name: 'Ellipsis' },
        { symbol: '—', code: '&mdash;', name: 'Em Dash' },
        { symbol: '–', code: '&ndash;', name: 'En Dash' },
        { symbol: '°', code: '&deg;', name: 'Degree' },
        { symbol: '±', code: '&plusmn;', name: 'Plus Minus' },
        { symbol: '×', code: '&times;', name: 'Multiply' },
        { symbol: '÷', code: '&divide;', name: 'Divide' },
        { symbol: '√', code: '&radic;', name: 'Square Root' },
        { symbol: '∞', code: '&infin;', name: 'Infinity' },
        { symbol: 'π', code: '&pi;', name: 'Pi' },
        { symbol: 'Δ', code: '&Delta;', name: 'Delta' },
        { symbol: 'Ω', code: '&Omega;', name: 'Omega' },
        { symbol: 'µ', code: '&micro;', name: 'Micro' },
        { symbol: '←', code: '&larr;', name: 'Left Arrow' },
        { symbol: '→', code: '&rarr;', name: 'Right Arrow' },
        { symbol: '↑', code: '&uarr;', name: 'Up Arrow' },
        { symbol: '↓', code: '&darr;', name: 'Down Arrow' },
        { symbol: '♥', code: '&hearts;', name: 'Heart' },
        { symbol: '♦', code: '&diams;', name: 'Diamond' },
        { symbol: '♣', code: '&clubs;', name: 'Club' },
        { symbol: '♠', code: '&spades;', name: 'Spade' },
    ];

    entities.forEach(item => {
        const entityEl = document.createElement('div');
        entityEl.className = 'symbol-item';
        entityEl.innerHTML = `
            <span class="symbol">${item.symbol}</span>
            <span class="code">${item.code}</span>
        `;
        entityEl.addEventListener('click', () => {
            copyToClipboard(item.code, `${item.code} copied!`);
        });
        entitiesContainer.appendChild(entityEl);
    });
}

function initMimeTypes() {
    const mimeContainer = document.getElementById('mime-container');
    const mimeSearch = document.getElementById('mime-search');
    if (!mimeContainer) return;

    const mimeTypes = [
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
    ];

    function renderMimeTypes(filter = '') {
        mimeContainer.innerHTML = '';
        const filtered = mimeTypes.filter(item => 
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
            mimeContainer.appendChild(row);
        });

        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                copyToClipboard(btn.dataset.mime, `${btn.dataset.mime} copied!`);
            });
        });
    }

    renderMimeTypes();

    if (mimeSearch) {
        mimeSearch.addEventListener('input', (e) => {
            renderMimeTypes(e.target.value);
        });
    }
}

function initIsoLanguageCodes() {
    const langContainer = document.getElementById('lang-container');
    const langSearch = document.getElementById('lang-search');
    if (!langContainer) return;

    const languages = [
        { code: 'aa', name: 'Afar' },
        { code: 'ab', name: 'Abkhazian' },
        { code: 'af', name: 'Afrikaans' },
        { code: 'ak', name: 'Akan' },
        { code: 'sq', name: 'Albanian' },
        { code: 'am', name: 'Amharic' },
        { code: 'ar', name: 'Arabic' },
        { code: 'an', name: 'Aragonese' },
        { code: 'hy', name: 'Armenian' },
        { code: 'as', name: 'Assamese' },
        { code: 'av', name: 'Avaric' },
        { code: 'ae', name: 'Avestan' },
        { code: 'ay', name: 'Aymara' },
        { code: 'az', name: 'Azerbaijani' },
        { code: 'ba', name: 'Bashkir' },
        { code: 'bm', name: 'Bambara' },
        { code: 'eu', name: 'Basque' },
        { code: 'be', name: 'Belarusian' },
        { code: 'bn', name: 'Bengali' },
        { code: 'bh', name: 'Bihari' },
        { code: 'bi', name: 'Bislama' },
        { code: 'bs', name: 'Bosnian' },
        { code: 'br', name: 'Breton' },
        { code: 'bg', name: 'Bulgarian' },
        { code: 'my', name: 'Burmese' },
        { code: 'ca', name: 'Catalan' },
        { code: 'ch', name: 'Chamorro' },
        { code: 'ce', name: 'Chechen' },
        { code: 'zh', name: 'Chinese' },
        { code: 'cu', name: 'Church Slavic' },
        { code: 'cv', name: 'Chuvash' },
        { code: 'kw', name: 'Cornish' },
        { code: 'co', name: 'Corsican' },
        { code: 'cr', name: 'Cree' },
        { code: 'cs', name: 'Czech' },
        { code: 'da', name: 'Danish' },
        { code: 'dv', name: 'Divehi' },
        { code: 'nl', name: 'Dutch' },
        { code: 'dz', name: 'Dzongkha' },
        { code: 'en', name: 'English' },
        { code: 'eo', name: 'Esperanto' },
        { code: 'et', name: 'Estonian' },
        { code: 'ee', name: 'Ewe' },
        { code: 'fo', name: 'Faroese' },
        { code: 'fj', name: 'Fijian' },
        { code: 'fi', name: 'Finnish' },
        { code: 'fr', name: 'French' },
        { code: 'fy', name: 'Western Frisian' },
        { code: 'ff', name: 'Fulah' },
        { code: 'ka', name: 'Georgian' },
        { code: 'de', name: 'German' },
        { code: 'gd', name: 'Gaelic' },
        { code: 'ga', name: 'Irish' },
        { code: 'gl', name: 'Galician' },
        { code: 'gv', name: 'Manx' },
        { code: 'el', name: 'Greek' },
        { code: 'gn', name: 'Guarani' },
        { code: 'gu', name: 'Gujarati' },
        { code: 'ht', name: 'Haitian' },
        { code: 'ha', name: 'Hausa' },
        { code: 'he', name: 'Hebrew' },
        { code: 'hz', name: 'Herero' },
        { code: 'hi', name: 'Hindi' },
        { code: 'ho', name: 'Hiri Motu' },
        { code: 'hr', name: 'Croatian' },
        { code: 'hu', name: 'Hungarian' },
        { code: 'ig', name: 'Igbo' },
        { code: 'is', name: 'Icelandic' },
        { code: 'io', name: 'Ido' },
        { code: 'ii', name: 'Sichuan Yi' },
        { code: 'iu', name: 'Inuktitut' },
        { code: 'ie', name: 'Interlingue' },
        { code: 'ia', name: 'Interlingua' },
        { code: 'id', name: 'Indonesian' },
        { code: 'ik', name: 'Inupiaq' },
        { code: 'it', name: 'Italian' },
        { code: 'jv', name: 'Javanese' },
        { code: 'ja', name: 'Japanese' },
        { code: 'kl', name: 'Kalaallisut' },
        { code: 'kn', name: 'Kannada' },
        { code: 'ks', name: 'Kashmiri' },
        { code: 'kr', name: 'Kanuri' },
        { code: 'kk', name: 'Kazakh' },
        { code: 'km', name: 'Central Khmer' },
        { code: 'ki', name: 'Kikuyu' },
        { code: 'rw', name: 'Kinyarwanda' },
        { code: 'ky', name: 'Kirghiz' },
        { code: 'kv', name: 'Komi' },
        { code: 'kg', name: 'Kongo' },
        { code: 'ko', name: 'Korean' },
        { code: 'kj', name: 'Kuanyama' },
        { code: 'ku', name: 'Kurdish' },
        { code: 'lo', name: 'Lao' },
        { code: 'la', name: 'Latin' },
        { code: 'lv', name: 'Latvian' },
        { code: 'li', name: 'Limburgan' },
        { code: 'ln', name: 'Lingala' },
        { code: 'lt', name: 'Lithuanian' },
        { code: 'lb', name: 'Luxembourgish' },
        { code: 'lu', name: 'Luba-Katanga' },
        { code: 'lg', name: 'Ganda' },
        { code: 'mk', name: 'Macedonian' },
        { code: 'mh', name: 'Marshallese' },
        { code: 'ml', name: 'Malayalam' },
        { code: 'mi', name: 'Maori' },
        { code: 'mr', name: 'Marathi' },
        { code: 'ms', name: 'Malay' },
        { code: 'mg', name: 'Malagasy' },
        { code: 'mt', name: 'Maltese' },
        { code: 'mn', name: 'Mongolian' },
        { code: 'na', name: 'Nauru' },
        { code: 'nv', name: 'Navajo' },
        { code: 'nr', name: 'Ndebele, South' },
        { code: 'nd', name: 'Ndebele, North' },
        { code: 'ng', name: 'Ndonga' },
        { code: 'ne', name: 'Nepali' },
        { code: 'nn', name: 'Norwegian Nynorsk' },
        { code: 'nb', name: 'Norwegian Bokmål' },
        { code: 'no', name: 'Norwegian' },
        { code: 'ny', name: 'Chichewa' },
        { code: 'oc', name: 'Occitan' },
        { code: 'oj', name: 'Ojibwa' },
        { code: 'or', name: 'Oriya' },
        { code: 'om', name: 'Oromo' },
        { code: 'os', name: 'Ossetian' },
        { code: 'pa', name: 'Panjabi' },
        { code: 'fa', name: 'Persian' },
        { code: 'pi', name: 'Pali' },
        { code: 'pl', name: 'Polish' },
        { code: 'pt', name: 'Portuguese' },
        { code: 'ps', name: 'Pushto' },
        { code: 'qu', name: 'Quechua' },
        { code: 'rm', name: 'Romansh' },
        { code: 'ro', name: 'Romanian' },
        { code: 'rn', name: 'Rundi' },
        { code: 'ru', name: 'Russian' },
        { code: 'sg', name: 'Sango' },
        { code: 'sa', name: 'Sanskrit' },
        { code: 'si', name: 'Sinhala' },
        { code: 'sk', name: 'Slovak' },
        { code: 'sl', name: 'Slovenian' },
        { code: 'se', name: 'Northern Sami' },
        { code: 'sm', name: 'Samoan' },
        { code: 'sn', name: 'Shona' },
        { code: 'sd', name: 'Sindhi' },
        { code: 'so', name: 'Somali' },
        { code: 'st', name: 'Sotho, Southern' },
        { code: 'es', name: 'Spanish' },
        { code: 'sc', name: 'Sardinian' },
        { code: 'sr', name: 'Serbian' },
        { code: 'ss', name: 'Swati' },
        { code: 'su', name: 'Sundanese' },
        { code: 'sw', name: 'Swahili' },
        { code: 'sv', name: 'Swedish' },
        { code: 'ty', name: 'Tahitian' },
        { code: 'ta', name: 'Tamil' },
        { code: 'tt', name: 'Tatar' },
        { code: 'te', name: 'Telugu' },
        { code: 'tg', name: 'Tajik' },
        { code: 'tl', name: 'Tagalog' },
        { code: 'th', name: 'Thai' },
        { code: 'bo', name: 'Tibetan' },
        { code: 'ti', name: 'Tigrinya' },
        { code: 'to', name: 'Tonga' },
        { code: 'tn', name: 'Tswana' },
        { code: 'ts', name: 'Tsonga' },
        { code: 'tk', name: 'Turkmen' },
        { code: 'tr', name: 'Turkish' },
        { code: 'tw', name: 'Twi' },
        { code: 'ug', name: 'Uighur' },
        { code: 'uk', name: 'Ukrainian' },
        { code: 'ur', name: 'Urdu' },
        { code: 'uz', name: 'Uzbek' },
        { code: 've', name: 'Venda' },
        { code: 'vi', name: 'Vietnamese' },
        { code: 'vo', name: 'Volapük' },
        { code: 'cy', name: 'Welsh' },
        { code: 'wa', name: 'Walloon' },
        { code: 'wo', name: 'Wolof' },
        { code: 'xh', name: 'Xhosa' },
        { code: 'yi', name: 'Yiddish' },
        { code: 'yo', name: 'Yoruba' },
        { code: 'za', name: 'Zhuang' },
        { code: 'zu', name: 'Zulu' },
    ];

    function renderLanguages(filter = '') {
        langContainer.innerHTML = '';
        const filtered = languages.filter(item => 
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
            langContainer.appendChild(row);
        });

        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                copyToClipboard(btn.dataset.code, `${btn.dataset.code} copied!`);
            });
        });
    }

    renderLanguages();

    if (langSearch) {
        langSearch.addEventListener('input', (e) => {
            renderLanguages(e.target.value);
        });
    }
}

function initSpeechToText() {
    const startBtn = document.getElementById('start-speech');
    const stopBtn = document.getElementById('stop-speech');
    const outputArea = document.getElementById('speech-output');
    const statusEl = document.getElementById('speech-status');
    
    if (!startBtn || !outputArea) return;

    let recognition = null;

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            statusEl.textContent = 'Listening...';
            statusEl.classList.add('recording');
            startBtn.disabled = true;
            stopBtn.disabled = false;
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }

            if (finalTranscript) {
                outputArea.value += finalTranscript;
            }
        };

        recognition.onerror = (event) => {
            statusEl.textContent = 'Error: ' + event.error;
            statusEl.classList.remove('recording');
            startBtn.disabled = false;
            stopBtn.disabled = true;
        };

        recognition.onend = () => {
            statusEl.textContent = 'Ready';
            statusEl.classList.remove('recording');
            startBtn.disabled = false;
            stopBtn.disabled = true;
        };
    } else {
        statusEl.textContent = 'Speech recognition not supported';
        startBtn.disabled = true;
    }

    startBtn.addEventListener('click', () => {
        if (recognition) {
            recognition.start();
        }
    });

    stopBtn.addEventListener('click', () => {
        if (recognition) {
            recognition.stop();
        }
    });

    const clearBtn = document.getElementById('clear-speech');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            outputArea.value = '';
        });
    }

    const copyBtn = document.getElementById('copy-speech');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            copyToClipboard(outputArea.value, 'Text copied!');
        });
    }
}

function init8bitIcon() {
    const canvas = document.getElementById('pixel-canvas');
    const colorPicker = document.getElementById('pixel-color');
    const sizeSelect = document.getElementById('canvas-size');
    const clearBtn = document.getElementById('clear-canvas');
    const downloadBtn = document.getElementById('download-icon');
    const eraserBtn = document.getElementById('eraser-btn');
    
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let pixelSize = 20;
    let isDrawing = false;
    let isEraser = false;
    let currentColor = '#000000';

    function initCanvas() {
        const size = parseInt(sizeSelect.value) || 16;
        canvas.width = size * pixelSize;
        canvas.height = size * pixelSize;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawGrid(size);
    }

    function drawGrid(size) {
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= size; i++) {
            ctx.beginPath();
            ctx.moveTo(i * pixelSize, 0);
            ctx.lineTo(i * pixelSize, canvas.height);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(0, i * pixelSize);
            ctx.lineTo(canvas.width, i * pixelSize);
            ctx.stroke();
        }
    }

    function getMousePos(evt) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: Math.floor((evt.clientX - rect.left) / pixelSize) * pixelSize,
            y: Math.floor((evt.clientY - rect.top) / pixelSize) * pixelSize
        };
    }

    function drawPixel(x, y) {
        ctx.fillStyle = isEraser ? '#ffffff' : currentColor;
        ctx.fillRect(x, y, pixelSize, pixelSize);
    }

    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const pos = getMousePos(e);
        drawPixel(pos.x, pos.y);
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        const pos = getMousePos(e);
        drawPixel(pos.x, pos.y);
    });

    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
    });

    canvas.addEventListener('mouseleave', () => {
        isDrawing = false;
    });

    if (colorPicker) {
        colorPicker.addEventListener('input', (e) => {
            currentColor = e.target.value;
            isEraser = false;
        });
    }

    if (sizeSelect) {
        sizeSelect.addEventListener('change', initCanvas);
    }

    if (eraserBtn) {
        eraserBtn.addEventListener('click', () => {
            isEraser = !isEraser;
            eraserBtn.classList.toggle('active', isEraser);
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            const size = parseInt(sizeSelect.value) || 16;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            drawGrid(size);
        });
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const size = parseInt(sizeSelect.value) || 16;
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = size * pixelSize;
            tempCanvas.height = size * pixelSize;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.drawImage(canvas, 0, 0);
            
            const link = document.createElement('a');
            link.download = '8bit-icon.png';
            link.href = tempCanvas.toDataURL('image/png');
            link.click();
        });
    }

    initCanvas();
}

function initClientDataVisualizer() {
    const cookiesContainer = document.getElementById('cookies-container');
    const localStorageContainer = document.getElementById('localstorage-container');
    const sessionStorageContainer = document.getElementById('sessionstorage-container');
    const refreshBtn = document.getElementById('refresh-data');
    
    if (!cookiesContainer) return;

    function renderData(container, data, type) {
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

    function getCookies() {
        const cookies = {};
        document.cookie.split(';').forEach(cookie => {
            const [key, value] = cookie.trim().split('=');
            if (key) cookies[key] = value;
        });
        return cookies;
    }

    function getLocalStorage() {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            data[key] = localStorage.getItem(key);
        }
        return data;
    }

    function getSessionStorage() {
        const data = {};
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            data[key] = sessionStorage.getItem(key);
        }
        return data;
    }

    function refreshData() {
        renderData(cookiesContainer, getCookies(), 'cookies');
        renderData(localStorageContainer, getLocalStorage(), 'localStorage');
        renderData(sessionStorageContainer, getSessionStorage(), 'sessionStorage');
    }

    refreshData();

    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshData);
    }
}

// Initialize on load
window.addEventListener('load', ()=>{
	ui.files();
	ui.menu();
	ui.scroll();
	ui.color();
    initColorConverter();
    initSymbolsEmojis();
    initHtmlEntities();
    initMimeTypes();
    initIsoLanguageCodes();
    initSpeechToText();
    init8bitIcon();
    initClientDataVisualizer();
}, {passive: true});

window.addEventListener('resize', ()=>{
	ui.scroll();
}, {passive: true});

const observer = new MutationObserver(function (mutations) {
	let fireUI = false;
	mutations.forEach(function (mutation) {
		for (var i = 0; i < mutation.addedNodes.length; i++) {
			if (mutation.addedNodes[i].hasAttribute && mutation.addedNodes[i].hasAttribute('svg') || mutation.addedNodes[i].tagName == 'PRE') {
				fireUI = true;
			}
		}
	});
	if (fireUI) { ui.files(); }
});
observer.observe(document, { childList: true });
