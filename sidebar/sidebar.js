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

var xmlHttpRequest = new XMLHttpRequest();
xmlHttpRequest.open('GET', browser.extension.getURL('/_values/StorageKeys.json'), false);
xmlHttpRequest.send();
const storageKeys = JSON.parse(xmlHttpRequest.responseText);

document.getElementsByTagName('html')[0].lang = browser.i18n.getUILanguage();
document.title = browser.i18n.getMessage('sidebarHTMLTitle');

browser.sidebarAction.getPanel({}).then((sidebarUrl) => {
	if (sidebarUrl === browser.extension.getURL(`sidebar/sidebar.html`)) {
		browser.storage.local.get(storageKeys.initialLocation).then((item) => {
			window.location = browser.extension.getURL(item[storageKeys.initialLocation] || "index.html");
		}).catch(() => {
			window.location = browser.extension.getURL("index.html");
		});
	}
});
