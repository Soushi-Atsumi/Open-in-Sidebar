/*
 * Open in Sidebar - Very simple and useful extension. You can open a link in the sidebar.
 * Copyright (c) 2018 Soushi Atsumi. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * 
 * This Source Code Form is "Incompatible With Secondary Licenses", as
 * defined by the Mozilla Public License, v. 2.0.
 */
'use strict';

//http
browser.contextMenus.create({
	contexts: ['audio'],
	id: 'https-audio',
	title: browser.i18n.getMessage("openingProtocolHttpsFromAudio")
});

browser.contextMenus.create({
	contexts: ['image'],
	id: 'https-image',
	title: browser.i18n.getMessage("openingProtocolHttpsFromImage")
});

browser.contextMenus.create({
	contexts: ['link'],
	id: 'https-link',
	title: browser.i18n.getMessage("openingProtocolHttpsFromLink")
});

browser.contextMenus.create({
	contexts: ['selection'],
	id: 'https-selection',
	title: browser.i18n.getMessage("openingProtocolHttpsFromSelection")
});

browser.contextMenus.create({
	contexts: ['video'],
	id: 'https-video',
	title: browser.i18n.getMessage("openingProtocolHttpsFromVideo")
});

//https
browser.contextMenus.create({
	contexts: ['audio'],
	id: 'http-audio',
	title: browser.i18n.getMessage("openingProtocolHttpFromAudio")
});

browser.contextMenus.create({
	contexts: ['image'],
	id: 'http-image',
	title: browser.i18n.getMessage("openingProtocolHttpFromImage")
});

browser.contextMenus.create({
	contexts: ['link'],
	id: 'http-link',
	title: browser.i18n.getMessage("openingProtocolHttpFromLink")
});

browser.contextMenus.create({
	contexts: ['selection'],
	id: 'http-selection',
	title: browser.i18n.getMessage("openingProtocolHttpFromSelection")
});

browser.contextMenus.create({
	contexts: ['video'],
	id: 'http-video',
	title: browser.i18n.getMessage("openingProtocolHttpFromVideo")
});

browser.contextMenus.onClicked.addListener((info, tab) => {
	var url;
	try {
		switch (info.menuItemId) {
			case 'http-link':
				url = new URL(info.linkUrl);
				break;
			case 'https-link':
				url = new URL(info.linkUrl);
				url.protocol = 'https';
				break;
			case 'http-selection':
				url = new URL(info.selectionText);
				break;
			case 'https-selection':
				url = new URL(info.selectionText);
				url.protocol = 'https';
				break;
			case 'http-audio':
			case 'http-image':
			case 'http-video':
				url = new URL(info.srcUrl);
				break;
			case 'https-audio':
			case 'https-image':
			case 'https-video':
				url = new URL(info.srcUrl);
				url.protocol = 'https';
				break;
		}
	} catch (e) {
		try {
			switch (info.menuItemId) {
				case 'http-selection':
					url = new URL('http://' + info.selectionText);
					break;
				case 'https-selection':
					url = new URL('https://' + info.selectionText);
					break;
				default:
					url = new URL(browser.extension.getURL(browser.i18n.getMessage("url_error.html")));
					break;
			}
		} catch (e) {
			url = new URL(browser.extension.getURL(browser.i18n.getMessage("url_error.html")));
		}
	}

	browser.sidebarAction.setPanel({
		panel: url.href
	});

	browser.sidebarAction.open();
});
