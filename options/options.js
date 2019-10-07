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
var targetKeys;
var protocolKeys;

const checkboxes = document.getElementsByClassName('checkbox');
const protocolAskRadio = document.getElementById('protocol-ask');
const protocolHttpRadio = document.getElementById('protocol-http');
const protocolHttpsRadio = document.getElementById('protocol-https');

const targetAskRadio = document.getElementById('target-ask');
const targetSpecifyRadio = document.getElementById('target-specify');
const targetBookmarkCheckbox = document.getElementById('target-bookmark');
const targetLinkCheckbox = document.getElementById('target-link');
const targetPageCheckbox = document.getElementById('target-page');
const targetSelectionCheckbox = document.getElementById('target-selection');
const targetViewSourceBookmarkCheckbox = document.getElementById('target-view-source-bookmark');
const targetViewSourceLinkCheckbox = document.getElementById('target-view-source-link');
const targetViewSourcePageCheckbox = document.getElementById('target-view-source-page');
const targetViewSourceSelectionCheckbox = document.getElementById('target-view-source-selection');
const initialLocation = document.getElementById('initial-location');
const additionalPermissionsBookmarksCheckbox = document.getElementById('additional-permissions-bookmarks');

main();

function main() {
	readKeys();
	initDocuments();
	addEventListeners();
	checkProtocols();
	checkTargets();
	checkCheckboxes();
	checkInitialLocation();
	checkPermissions();
}

function addEventListeners() {
	for (let checkbox of checkboxes) {
		checkbox.addEventListener('click', checkboxesOnClick);
	}
	document.options.protocol.forEach((element) => element.addEventListener('click', protocolOnClick));
	document.options.target.forEach((element) => element.addEventListener('click', targetOnClick));
	initialLocation.addEventListener('click', (event) => initialLocation.style.backgroundColor = '');
	initialLocation.addEventListener('keydown', (event) => {
		if (event.key === 'Enter') {
			if (initialLocation.value === '') {
				browser.storage.local.remove(storageKeys.initialLocation);
			} else {
				browser.storage.local.get({ [storageKeys.initialLocation]: initialLocation.value });
			}
			event.preventDefault();
			initialLocation.blur();
			initialLocation.style.backgroundColor = 'LightGreen';
		}
	});
	additionalPermissionsBookmarksCheckbox.addEventListener('click', requestPermission);
}

function readKeys() {
	const xmlHttpRequest = new XMLHttpRequest();
	xmlHttpRequest.open('GET', browser.runtime.getURL('/_values/StorageKeys.json'), false);
	xmlHttpRequest.send();
	storageKeys = JSON.parse(xmlHttpRequest.responseText);
	xmlHttpRequest.open('GET', browser.runtime.getURL('/_values/TargetKeys.json'), false);
	xmlHttpRequest.send();
	targetKeys = JSON.parse(xmlHttpRequest.responseText);
	xmlHttpRequest.open('GET', browser.runtime.getURL('/_values/ProtocolKeys.json'), false);
	xmlHttpRequest.send();
	protocolKeys = JSON.parse(xmlHttpRequest.responseText);
}

function initDocuments() {
	document.getElementsByTagName('html')[0].lang = browser.i18n.getUILanguage();
	document.title = browser.i18n.getMessage('optionsHTMLTitle');
	document.getElementById('protocolLegend').innerText = browser.i18n.getMessage('protocol');
	document.getElementById('askProtocolLabel').innerText = browser.i18n.getMessage('ask');
	document.getElementById('alwaysUsesHttpLabel').innerText = browser.i18n.getMessage('alwaysUsesHttp');
	document.getElementById('alwaysUsesHttpsLabel').innerText = browser.i18n.getMessage('alwaysUsesHttps');
	document.getElementById('targetLegend').innerText = browser.i18n.getMessage('target');
	document.getElementById('askTargetLabel').innerText = browser.i18n.getMessage('ask');
	document.getElementById('specifyTargetLabel').innerText = browser.i18n.getMessage('specify');
	document.getElementById('openFromBookmarkLabel').innerText = browser.i18n.getMessage('openFromBookmark');
	document.getElementById('openFromLinkLabel').innerText = browser.i18n.getMessage('openFromLink');
	document.getElementById('openFromPageLabel').innerText = browser.i18n.getMessage('openFromPage');
	document.getElementById('openFromSelectionLabel').innerText = browser.i18n.getMessage('openFromSelection');
	document.getElementById('viewSourceFromBookmarkLabel').innerText = browser.i18n.getMessage('viewSourceFromBookmark');
	document.getElementById('viewSourceFromLinkLabel').innerText = browser.i18n.getMessage('viewSourceFromLink');
	document.getElementById('viewSourceFromPageLabel').innerText = browser.i18n.getMessage('viewSourceFromPage');
	document.getElementById('viewSourceFromSelectionLabel').innerText = browser.i18n.getMessage('viewSourceFromSelection');
	document.getElementById('initialLocationLegend').innerText = browser.i18n.getMessage('initialLocation');
	document.getElementById('initialLocationLabel').innerText = browser.i18n.getMessage('initialLocationDescription');
	document.getElementById('additionalPermissionsLegend').innerText = browser.i18n.getMessage('additionalPermissions');
	document.getElementById('bookmarksLabel').innerText = browser.i18n.getMessage('bookmarks');
}

function protocolOnClick(event) {
	switch (event.target.id) {
		case 'protocol-ask':
			saveConfig({ [storageKeys.protocol]: protocolKeys.ask });
			break;
		case 'protocol-http':
			saveConfig({ [storageKeys.protocol]: protocolKeys.http });
			break;
		case 'protocol-https':
			saveConfig({ [storageKeys.protocol]: protocolKeys.https });
			break;
	}
}

function targetOnClick(event) {
	switch (event.target.id) {
		case 'target-ask':
			saveConfig({ [storageKeys.target]: targetKeys.ask });
			toggleCheckboxsDisabled(true);
			break;
		case 'target-specify':
			saveConfig({ [storageKeys.target]: targetKeys.specify });
			toggleCheckboxsDisabled(false);
			break;
	}
}

function checkboxesOnClick(event) {
	saveConfig({
		[storageKeys.bookmark]: targetBookmarkCheckbox.checked,
		[storageKeys.link]: targetLinkCheckbox.checked,
		[storageKeys.page]: targetPageCheckbox.checked,
		[storageKeys.selection]: targetSelectionCheckbox.checked,
		[storageKeys.viewSourceBookmark]: targetViewSourceBookmarkCheckbox.checked,
		[storageKeys.viewSourceLink]: targetViewSourceLinkCheckbox.checked,
		[storageKeys.viewSourcePage]: targetViewSourcePageCheckbox.checked,
		[storageKeys.viewSourceSelection]: targetViewSourceSelectionCheckbox.checked
	});
}

function checkProtocols() {
	browser.storage.local.get([storageKeys.protocol]).then((item) => {
		switch (item[storageKeys.protocol]) {
			case protocolKeys.http:
				protocolHttpRadio.checked = true;
				break;
			case protocolKeys.https:
				protocolHttpsRadio.checked = true;
				break;
		}
	});
}

function checkTargets() {
	browser.storage.local.get(storageKeys.target).then((item) => {
		switch (item[storageKeys.target]) {
			case targetKeys.ask:
				targetAskRadio.checked = true;
				break;
			case targetKeys.specify:
				targetSpecifyRadio.checked = true;
				toggleCheckboxsDisabled(false);
				break;
		}
	});
}

function checkCheckboxes() {
	browser.storage.local.get([storageKeys.link, storageKeys.selection, storageKeys.viewSourceLink, storageKeys.viewSourceSelection]).then((item) => {
		targetBookmarkCheckbox.checked = item[storageKeys.bookmark] === undefined ? true : item[storageKeys.bookmark];
		targetLinkCheckbox.checked = item[storageKeys.link] === undefined ? true : item[storageKeys.selection];
		targetPageCheckbox.checked = item[storageKeys.page] === undefined ? true : item[storageKeys.page];
		targetSelectionCheckbox.checked = item[storageKeys.selection] === undefined ? true : item[storageKeys.selection];
		targetViewSourceBookmarkCheckbox.checked = item[storageKeys.viewSourceBookmark] === undefined ? true : item[storageKeys.viewSourceBookmark];
		targetViewSourceLinkCheckbox.checked = item[storageKeys.viewSourceLink] === undefined ? true : item[storageKeys.viewSourceLink];
		targetViewSourcePageCheckbox.checked = item[storageKeys.viewSourcePage] === undefined ? true : item[storageKeys.viewSourcePage];
		targetViewSourceSelectionCheckbox.checked = item[storageKeys.viewSourceSelection] === undefined ? true : item[storageKeys.viewSourceSelection];
	});
}

function toggleCheckboxsDisabled(disabled) {
	for (let i = 0; i < checkboxes.length; i++) {
		checkboxes[i].disabled = disabled;
	}
}

function checkInitialLocation() {
	browser.storage.local.get(storageKeys.initialLocation).then((item) => {
		initialLocation.value = item[storageKeys.initialLocation] || '';
	});
}

function checkPermissions() {
	browser.permissions.getAll().then(result => {
		additionalPermissionsBookmarksCheckbox.checked = result.permissions.includes('bookmarks');
	});
}

function saveConfig(keys) {
	browser.storage.local.set(keys).then(notifyRefleshing());
}

function notifyRefleshing() {
	browser.runtime.sendMessage({ action: 'reflesh' });
}

function requestPermission(event) {
	if (event.originalTarget.id === 'additional-permissions-bookmarks') {
		const bookmarkPermission = { permissions: ['bookmarks'] };
		if (additionalPermissionsBookmarksCheckbox.checked) {
			browser.permissions.request(bookmarkPermission).then((accepted) => {
				additionalPermissionsBookmarksCheckbox.checked = accepted;
				notifyRefleshing();
			});
		} else {
			browser.permissions.remove(bookmarkPermission);
			notifyRefleshing();
		}
	}
}
