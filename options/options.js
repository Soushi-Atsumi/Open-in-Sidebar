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
var placementKeys;

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
const targetViewSourceFromBookmarkCheckbox = document.getElementById('target-view-source-from-bookmark');
const targetViewSourceLinkCheckbox = document.getElementById('target-view-source-link');
const targetViewSourcePageCheckbox = document.getElementById('target-view-source-page');
const targetViewSourceSelectionCheckbox = document.getElementById('target-view-source-selection');
const initialLocation = document.getElementById('initial-location');
const additionalPermissionsBookmarksCheckbox = document.getElementById('additional-permissions-bookmarks');
const placementAllRadio = document.getElementById('placement-all');
const placementTabRadio = document.getElementById('placement-tab');
const placementWindowRadio = document.getElementById('placement-window');

main();

async function main() {
	await readKeys();
	initDocuments();
	addEventListeners();
	browser.permissions.onAdded.addListener(checkPermissions);
	browser.permissions.onRemoved.addListener(checkPermissions);
	checkProtocols();
	checkTargets();
	checkCheckboxes();
	checkInitialLocation();
	checkPermissions();
	checkBehaviors();
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
				browser.storage.local.set({ [storageKeys.initialLocation]: initialLocation.value });
			}
			event.preventDefault();
			initialLocation.blur();
			initialLocation.style.backgroundColor = 'LightGreen';
		}
	});
	additionalPermissionsBookmarksCheckbox.addEventListener('click', requestPermission);
	document.options.placement.forEach((element) => element.addEventListener('click', placementOnClick));
}

function checkBehaviors() {
	browser.storage.local.get(storageKeys.placement).then((item) => {
		switch (item[storageKeys.placement]) {
			case placementKeys.all:
				placementAllRadio.checked = true;
				break;
			case placementKeys.tab:
				placementTabRadio.checked = true;
				break;
			case placementKeys.window:
				placementWindowRadio.checked = true;
				break;
		}
	});
}

function checkboxesOnClick(event) {
	saveConfig({
		[storageKeys.bookmark]: targetBookmarkCheckbox.checked,
		[storageKeys.link]: targetLinkCheckbox.checked,
		[storageKeys.page]: targetPageCheckbox.checked,
		[storageKeys.selection]: targetSelectionCheckbox.checked,
		[storageKeys.viewSourceFromBookmark]: targetViewSourceFromBookmarkCheckbox.checked,
		[storageKeys.viewSourceLink]: targetViewSourceLinkCheckbox.checked,
		[storageKeys.viewSourcePage]: targetViewSourcePageCheckbox.checked,
		[storageKeys.viewSourceSelection]: targetViewSourceSelectionCheckbox.checked
	});
}

function checkCheckboxes() {
	browser.storage.local.get([storageKeys.link, storageKeys.selection, storageKeys.viewSourceLink, storageKeys.viewSourceSelection]).then((item) => {
		targetBookmarkCheckbox.checked = item[storageKeys.bookmark] === undefined ? true : item[storageKeys.bookmark];
		targetLinkCheckbox.checked = item[storageKeys.link] === undefined ? true : item[storageKeys.selection];
		targetPageCheckbox.checked = item[storageKeys.page] === undefined ? true : item[storageKeys.page];
		targetSelectionCheckbox.checked = item[storageKeys.selection] === undefined ? true : item[storageKeys.selection];
		targetViewSourceFromBookmarkCheckbox.checked = item[storageKeys.viewSourceFromBookmark] === undefined ? true : item[storageKeys.viewSourceFromBookmark];
		targetViewSourceLinkCheckbox.checked = item[storageKeys.viewSourceLink] === undefined ? true : item[storageKeys.viewSourceLink];
		targetViewSourcePageCheckbox.checked = item[storageKeys.viewSourcePage] === undefined ? true : item[storageKeys.viewSourcePage];
		targetViewSourceSelectionCheckbox.checked = item[storageKeys.viewSourceSelection] === undefined ? true : item[storageKeys.viewSourceSelection];
	});
}

function checkInitialLocation() {
	browser.storage.local.get(storageKeys.initialLocation).then((item) => {
		initialLocation.value = item[storageKeys.initialLocation] || '';
	});
}

function checkPermissions() {
	browser.permissions.getAll().then(permissions => additionalPermissionsBookmarksCheckbox.checked = permissions.permissions.includes('bookmarks'));
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
	document.getElementById('placementLegend').innerText = browser.i18n.getMessage('placement');
	document.getElementById('placementAllLabel').innerText = browser.i18n.getMessage('all');
	document.getElementById('placementAllCautionLabel').innerText = browser.i18n.getMessage('placementAllCaution');
	document.getElementById('placementAllDescriptionLabel').innerText = browser.i18n.getMessage('placementAllDescription');
	document.getElementById('placementTabLabel').innerText = browser.i18n.getMessage('tab');
	document.getElementById('placementTabCautionLabel').innerText = browser.i18n.getMessage('placementTabCaution');
	document.getElementById('placementTabDescriptionLabel').innerText = browser.i18n.getMessage('placementTabDescription');
	document.getElementById('placementWindowLabel').innerText = browser.i18n.getMessage('window');
	document.getElementById('placementWindowCautionLabel').innerText = browser.i18n.getMessage('placementWindowCaution');
	document.getElementById('placementWindowDescriptionLabel').innerText = browser.i18n.getMessage('placementWindowDescription');
}

function notifyRefreshing() {
	browser.runtime.sendMessage({ action: 'refresh' });
}

function placementOnClick(event) {
	switch (event.target.id) {
		case 'placement-all':
			saveConfig({ [storageKeys.placement]: placementKeys.all });
			break;
		case 'placement-tab':
			saveConfig({ [storageKeys.placement]: placementKeys.tab });
			break;
		case 'placement-window':
			saveConfig({ [storageKeys.placement]: placementKeys.window });
			break;
	}
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

async function readKeys() {
	const keyFiles = ['PlacementKeys.json', 'ProtocolKeys.json', 'StorageKeys.json', 'TargetKeys.json'].map(keyFile => `/_values/${keyFile}`);
	return Promise.all(keyFiles.map(keyFile => fetch((keyFile)))).then(values => {
		return Promise.all(values.map(value => value.text()));
	}).then(values => {
		placementKeys = JSON.parse(values[0]);
		protocolKeys = JSON.parse(values[1]);
		storageKeys = JSON.parse(values[2]);
		targetKeys = JSON.parse(values[3]);
	});
}

function requestPermission(event) {
	if (event.originalTarget.id === 'additional-permissions-bookmarks') {
		const bookmarkPermission = { permissions: ['bookmarks'] };
		if (additionalPermissionsBookmarksCheckbox.checked) {
			browser.permissions.request(bookmarkPermission).then((accepted) => {
				additionalPermissionsBookmarksCheckbox.checked = accepted;
			});
		} else {
			browser.permissions.remove(bookmarkPermission);
		}
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

function toggleCheckboxsDisabled(disabled) {
	for (let i = 0; i < checkboxes.length; i++) {
		checkboxes[i].disabled = disabled;
	}
}

function saveConfig(keys) {
	browser.storage.local.set(keys).then(notifyRefreshing());
}
