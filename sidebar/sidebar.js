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

var storageKeys;

main();

function main() {
	readKeys();
	initDocuments();
	addEventListeners();
}

function addEventListeners() {
	browser.sidebarAction.getPanel({}).then((sidebarUrl) => {
		if (sidebarUrl === browser.runtime.getURL(`sidebar/sidebar.html`)) {
			browser.storage.local.get(storageKeys.initialLocation).then((item) => {
				window.location = browser.runtime.getURL(item[storageKeys.initialLocation] || 'index.html');
			}).catch(() => {
				window.location = browser.runtime.getURL('index.html');
			});
		}
	});
}

function initDocuments() {
	document.getElementsByTagName('html')[0].lang = browser.i18n.getUILanguage();
	document.title = browser.i18n.getMessage('sidebarHTMLTitle');
}

function readKeys() {
	const xmlHttpRequest = new XMLHttpRequest();
	xmlHttpRequest.open('GET', browser.runtime.getURL('/_values/StorageKeys.json'), false);
	xmlHttpRequest.send();
	storageKeys = JSON.parse(xmlHttpRequest.responseText);
}
