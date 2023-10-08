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

main();

function main() {
	initDocuments();
	setLocation();
}

function initDocuments() {
	document.getElementsByTagName('html')[0].lang = browser.i18n.getUILanguage();
	document.title = browser.i18n.getMessage('sidebarHTMLTitle');
}

async function setLocation() {
	const storageKeys = await (await fetch('/_values/StorageKeys.json')).json();
	window.location = (await (await browser.storage.local.get(storageKeys.sync) ? browser.storage.sync : browser.storage.local).get(storageKeys.initialLocation))[storageKeys.initialLocation] ?? '/index.html';
}
