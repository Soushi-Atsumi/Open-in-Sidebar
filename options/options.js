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

let placements;
let protocols;
let storageKeys;
let targets;
let userAgents;

const bookmarksPermissions = { permissions: ['bookmarks'] };
const hostPermissions = { origins: ['*://*/*'] };

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
const additionalPermissionsHostCheckbox = document.getElementById('additional-permissions-host');
const userAgentDefaultRadio = document.getElementById('user-agent-default');
const userAgentFirefoxosRadio = document.getElementById('user-agent-firefoxos');
const userAgentAndroidRadio = document.getElementById('user-agent-android');
const userAgentIosRadio = document.getElementById('user-agent-ios');
const placementAllRadio = document.getElementById('placement-all');
const placementTabRadio = document.getElementById('placement-tab');
const placementWindowRadio = document.getElementById('placement-window');

main();

async function main() {
	await readValues();
	initDocuments();
	addEventListeners();
	checkProtocols();
	checkTargets();
	checkCheckboxes();
	checkInitialLocation();
	await checkPermissions();
	checkUserAgents();
	checkBehaviors();
}

function addEventListeners() {
	document.options.targetCheckbox.forEach(element => element.addEventListener('click', checkboxesOnClick));
	document.options.protocol.forEach(element => element.addEventListener('click', protocolOnClick));
	document.options.target.forEach(element => element.addEventListener('click', targetOnClick));
	initialLocation.addEventListener('click', () => initialLocation.style.backgroundColor = '');
	initialLocation.addEventListener('keydown', event => {
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
	document.options.additionalPermissions.forEach(element => element.addEventListener('click', requestPermission));
	browser.permissions.onAdded.addListener(checkPermissions);
	browser.permissions.onRemoved.addListener(checkPermissions);
	document.options.userAgent.forEach(element => element.addEventListener('click', userAgentOnClick));
	document.options.placement.forEach(element => element.addEventListener('click', placementOnClick));
}

function checkBehaviors() {
	browser.storage.local.get(storageKeys.placement).then(item => {
		switch (item[storageKeys.placement]) {
			case placements.all:
				placementAllRadio.checked = true;
				break;
			case placements.tab:
				placementTabRadio.checked = true;
				break;
			case placements.window:
				placementWindowRadio.checked = true;
				break;
		}
	});
}

function checkboxesOnClick() {
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
	browser.storage.local.get().then(item => {
		targetBookmarkCheckbox.checked = item[storageKeys.bookmark] === undefined ? true : item[storageKeys.bookmark];
		targetLinkCheckbox.checked = item[storageKeys.link] === undefined ? true : item[storageKeys.link];
		targetPageCheckbox.checked = item[storageKeys.page] === undefined ? true : item[storageKeys.page];
		targetSelectionCheckbox.checked = item[storageKeys.selection] === undefined ? true : item[storageKeys.selection];
		targetViewSourceFromBookmarkCheckbox.checked = item[storageKeys.viewSourceFromBookmark] === undefined ? true : item[storageKeys.viewSourceFromBookmark];
		targetViewSourceLinkCheckbox.checked = item[storageKeys.viewSourceLink] === undefined ? true : item[storageKeys.viewSourceLink];
		targetViewSourcePageCheckbox.checked = item[storageKeys.viewSourcePage] === undefined ? true : item[storageKeys.viewSourcePage];
		targetViewSourceSelectionCheckbox.checked = item[storageKeys.viewSourceSelection] === undefined ? true : item[storageKeys.viewSourceSelection];
	});
}

function checkInitialLocation() {
	browser.storage.local.get(storageKeys.initialLocation).then(item => {
		initialLocation.value = item[storageKeys.initialLocation] || '';
	});
}

async function checkPermissions() {
	additionalPermissionsBookmarksCheckbox.checked = await browser.permissions.contains(bookmarksPermissions);
	additionalPermissionsHostCheckbox.checked = await browser.permissions.contains(hostPermissions);
	toggleUserAgentRadioDisabled(!additionalPermissionsHostCheckbox.checked);
}

function checkProtocols() {
	browser.storage.local.get([storageKeys.protocol]).then(item => {
		switch (item[storageKeys.protocol]) {
			case protocols.http:
				protocolHttpRadio.checked = true;
				break;
			case protocols.https:
				protocolHttpsRadio.checked = true;
				break;
		}
	});
}

function checkTargets() {
	browser.storage.local.get(storageKeys.target).then(item => {
		switch (item[storageKeys.target]) {
			case targets.ask:
				targetAskRadio.checked = true;
				break;
			case targets.specify:
				targetSpecifyRadio.checked = true;
				toggleTargetCheckboxesDisabled(false);
				break;
		}
	});
}

function checkUserAgents() {
	browser.storage.local.get(storageKeys.userAgent).then(item => {
		switch (item[storageKeys.userAgent]) {
			case userAgents.android:
				userAgentAndroidRadio.checked = true;
				break;
			case userAgents.default:
				userAgentDefaultRadio.checked = true;
				break;
			case userAgents.firefoxOS:
				userAgentFirefoxosRadio.checked = true;
				break;
			case userAgents.iOS:
				userAgentIosRadio.checked = true;
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
	document.getElementById('hostLabel').innerText = browser.i18n.getMessage('host');
	document.getElementById('useragentLegend').innerText = browser.i18n.getMessage('useragent');
	document.getElementById('defaultLabel').innerText = browser.i18n.getMessage('default');
	document.getElementById('informationDivision').innerText = browser.i18n.getMessage('optionsUserAgentHTMLInformation');
	document.getElementById('cautionDivision').innerText = browser.i18n.getMessage('optionsUserAgentHTMLCaution');
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
		case placementAllRadio.id:
			saveConfig({ [storageKeys.placement]: placements.all });
			break;
		case placementTabRadio.id:
			saveConfig({ [storageKeys.placement]: placements.tab });
			break;
		case placementWindowRadio.id:
			saveConfig({ [storageKeys.placement]: placements.window });
			break;
	}
}

function protocolOnClick(event) {
	switch (event.target.id) {
		case protocolAskRadio.id:
			saveConfig({ [storageKeys.protocol]: protocols.ask });
			break;
		case protocolHttpRadio.id:
			saveConfig({ [storageKeys.protocol]: protocols.http });
			break;
		case protocolHttpsRadio.id:
			saveConfig({ [storageKeys.protocol]: protocols.https });
			break;
	}
}

async function readValues() {
	const keyFiles = ['Placements.json', 'Protocols.json', 'StorageKeys.json', 'Targets.json', 'UserAgents.json'].map(keyFile => `/_values/${keyFile}`);
	return Promise.all(keyFiles.map(keyFile => fetch(keyFile))).then(values => {
		return Promise.all(values.map(value => value.text()));
	}).then(values => {
		placements = JSON.parse(values[0]);
		protocols = JSON.parse(values[1]);
		storageKeys = JSON.parse(values[2]);
		targets = JSON.parse(values[3]);
		userAgents = JSON.parse(values[4]);
	});
}

function requestPermission(event) {
	switch (event.originalTarget.id) {
		case additionalPermissionsBookmarksCheckbox.id:
			if (additionalPermissionsBookmarksCheckbox.checked) {
				browser.permissions.request(bookmarksPermissions).then(accepted => {
					additionalPermissionsBookmarksCheckbox.checked = accepted;
				});
			} else {
				browser.permissions.remove(bookmarksPermissions);
			}
		case additionalPermissionsHostCheckbox.id:
			if (additionalPermissionsHostCheckbox.checked) {
				browser.permissions.request(hostPermissions).then(accepted => {
					additionalPermissionsHostCheckbox.checked = accepted;
					toggleUserAgentRadioDisabled(!accepted);
				});
			} else {
				browser.permissions.remove(hostPermissions);
				toggleUserAgentRadioDisabled(true);
			}
		default:
	}
}

function saveConfig(keys) {
	browser.storage.local.set(keys).then(notifyRefreshing());
}

function targetOnClick(event) {
	switch (event.target.id) {
		case targetAskRadio.id:
			saveConfig({ [storageKeys.target]: targets.ask });
			toggleTargetCheckboxesDisabled(true);
			break;
		case targetSpecifyRadio.id:
			saveConfig({ [storageKeys.target]: targets.specify });
			toggleTargetCheckboxesDisabled(false);
			break;
	}
}

function toggleTargetCheckboxesDisabled(disabled) {
	document.options.targetCheckbox.forEach(element => element.disabled = disabled);
}

function toggleUserAgentRadioDisabled(disabled) {
	document.options.userAgent.forEach(element => element.disabled = disabled);
}

function userAgentOnClick(event) {
	switch (event.target.id) {
		case userAgentAndroidRadio.id:
			saveConfig({ [storageKeys.userAgent]: userAgents.android });
			break;
		case userAgentDefaultRadio.id:
			saveConfig({ [storageKeys.userAgent]: userAgents.default });
			break;
		case userAgentFirefoxosRadio.id:
			saveConfig({ [storageKeys.userAgent]: userAgents.firefoxOS });
			break;
		case userAgentIosRadio.id:
			saveConfig({ [storageKeys.userAgent]: userAgents.iOS });
			break;
	}
}
