/* ============================================
   fernan.dev - Core JavaScript
   ============================================ */

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

// Initialize on load
window.addEventListener('load', ()=>{
	ui.files();
	ui.menu();
	ui.scroll();
	ui.color();
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
