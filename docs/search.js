function ready() {
	function clear(cur) {
		while (cur.lastChild) cur.removeChild(cur.lastChild);
	}
	var idN = 0;

	function chkid(cur) {
		if (!cur.id) {
			cur.id = "r_" + (++idN).toString(36);
		}
		return cur.id;
	}

	function collect(map, par) {
		for (var x = par.firstChild, e;
			(e = x); x = x.nextSibling) {
			if (e.nodeType === 1) {
				switch (e.localName.toLowerCase()) {
					case "input":
						{
							switch (e.type) {
								case "text":
								case "search":
									{
										map.search_input = e;
										break;
									}
								case "submit":
									{
										map.submit_button = e;
										break;
									}
							}
							break;
						}
					case "button":
						{
							if ("submit" === e.type) {
								map.submit_button = e;
							}
							break;
						}
					case "img":
						{
							if (e.src || e.hasAttribute("class")) {
								map.image = e;
							}
							break;
						}
				}
				collect(map, e)
			}
		}
	}
	var F = document.forms;
	var n = F.length;
	while (n-- > 0) {
		var f = F[n];
		var a = f.action;
		console.log(a);
		var e = a.lastIndexOf('?')
		if (e > 0) {
			a = a.substr(0, e)
		}
		var m = {};
		collect(m, f);
		// console.log(m);
		if (!m.search_input) {
			continue;
		}
		if (!m.search_input.placeholder) m.search_input.placeholder = a;
		m.search_input.removeAttribute("size");
		if (m.submit_button.localName.toLowerCase() == "button") {
			clear(m.submit_button);
			m.submit_button.appendChild(document.createTextNode('⌕'));
		} else {
			m.submit_button.value = "⌕"
		}
		table = document.createElement("table");
		tr = table.appendChild(document.createElement("tr"));
		td = tr.appendChild(document.createElement("td"));
		l = td.appendChild(document.createElement("label"));
		if (m.image) {
			l.appendChild(m.image);
		} else {
			l.appendChild(document.createTextNode('???'));
		}
		l.addEventListener("click", function(event) {
			for (var p = this.parentNode; p; p = p.parentNode) {
				if (p.action) {
					var s = p.querySelector("input[type='text']");
					if (s) s.value = "";
					s = p.querySelector("input[type='search']");
					if (s) s.value = "";
					break;
				}
			}
		}, false);
		l.setAttribute("for", chkid(m.search_input));
		td = tr.appendChild(document.createElement("td"));
		td.appendChild(m.search_input);
		td = tr.appendChild(document.createElement("td"));
		td.appendChild(m.submit_button);
		// e.appendChild(document.createTextNode(a));
		f.insertBefore(table, f.firstChild)
	}

	function fbProxifyUrl(u) {
		var u, s, a, b;
		u = u.replace(/^(\w+):\/\//, "$1.")
		var s = u.indexOf("/")
		if (s < 0) {
			b = '';
			a = u;
		} else {
			a = u.substr(0, s);
			b = u.substr(s);
		}
		if (a.endsWith(".discoverapp.com")) {
			return url;
		}
		a = a.replace(/\-/g, "--")
		a = a.replace(/\./g, "-")
		return 'https://' + a + '.0.discoverapp.com' + b
	}
	window.fbProxifyUrl = fbProxifyUrl;
	document.getElementById("iorg").addEventListener("submit", function(event) {
		var input = this.querySelector("input[name='url']");
		if (input && input.value) {
			var u = fbProxifyUrl(input.value);
			// this.querySelector("input[name='url2']").value = u;
			var fbact = document.getElementById("fbact");
			fbact.action = u;
			fbact.submit();
		}
		event.preventDefault();
	}, false);
}
document.addEventListener("DOMContentLoaded", ready, false);
