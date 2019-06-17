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
xmlHttpRequest.open('GET', browser.extension.getURL('/_values/TargetKeys.json'), false);
xmlHttpRequest.send();
const targetKeys = JSON.parse(xmlHttpRequest.responseText);
xmlHttpRequest.open('GET', browser.extension.getURL('/_values/ProtocolKeys.json'), false);
xmlHttpRequest.send();
const protocolKeys = JSON.parse(xmlHttpRequest.responseText);

document.getElementsByTagName('html')[0].lang = browser.i18n.getUILanguage();
document.title = browser.i18n.getMessage('optionsHTMLTitle');
document.getElementById('protocolLegend').innerText = browser.i18n.getMessage('protocol');
document.getElementById('askProtocolLabel').innerText = browser.i18n.getMessage('ask');
document.getElementById('alwaysUsesHttpLabel').innerText = browser.i18n.getMessage('alwaysUsesHttp');
document.getElementById('alwaysUsesHttpsLabel').innerText = browser.i18n.getMessage('alwaysUsesHttps');
document.getElementById('targetLegend').innerText = browser.i18n.getMessage('target');
document.getElementById('askTargetLabel').innerText = browser.i18n.getMessage('ask');
document.getElementById('specifyTargetLabel').innerText = browser.i18n.getMessage('specify');
document.getElementById('openFromLinkLabel').innerText = browser.i18n.getMessage('openFromLink');
document.getElementById('openFromSelectionLabel').innerText = browser.i18n.getMessage('openFromSelection');
document.getElementById('viewSourceFromLinkLabel').innerText = browser.i18n.getMessage('viewSourceFromLink');
document.getElementById('viewSourceFromSelectionLabel').innerText = browser.i18n.getMessage('viewSourceFromSelection');
document.getElementById('initialLocationLegend').innerText = browser.i18n.getMessage('initialLocation');
document.getElementById('initialLocationLabel').innerText = browser.i18n.getMessage('initialLocationDescription');

var protocolAskRadio = document.getElementById('protocol-ask');
var protocolHttpRadio = document.getElementById('protocol-http');
var protocolHttpsRadio = document.getElementById('protocol-https');

document.options.protocol.forEach((element) => {
	element.addEventListener('click', protocolOnClick);
});

var checkboxes = document.getElementsByClassName('checkbox');

document.options.target.forEach((element) => {
	element.addEventListener('click', targetOnClick);
});

var targetAskRadio = document.getElementById('target-ask');
var targetSpecifyRadio = document.getElementById('target-specify');
var targetLinkCheckbox = document.getElementById('target-link');
var targetSelectionCheckbox = document.getElementById('target-selection');
var targetViewSourceLinkCheckbox = document.getElementById('target-view-source-link');
var targetViewSourceSelectionCheckbox = document.getElementById('target-view-source-selection');

for (let checkbox of checkboxes) {
	checkbox.addEventListener('click', checkboxesOnClick);
}

var initialLocation = document.getElementById('initial-location');
initialLocation.addEventListener('click', (event) => {
	initialLocation.style.backgroundColor = '';
});
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

checkProtocols();
checkTargets();
checkCheckboxes();
checkInitialLocation();

function protocolOnClick(event) {
	switch (event.target.id) {
		case 'protocol-ask':
			browser.storage.local.set({ [storageKeys.protocol]: protocolKeys.ask });
			break;
		case 'protocol-http':
			browser.storage.local.set({ [storageKeys.protocol]: protocolKeys.http });
			break;
		case 'protocol-https':
			browser.storage.local.set({ [storageKeys.protocol]: protocolKeys.https });
			break;
	}
}

function targetOnClick(event) {
	switch (event.target.id) {
		case 'target-ask':
			browser.storage.local.set({ [storageKeys.target]: targetKeys.ask });
			toggleCheckboxsDisabled(true);
			break;
		case 'target-specify':
			browser.storage.local.set({ [storageKeys.target]: targetKeys.specify });
			toggleCheckboxsDisabled(false);
			break;
	}
}

function checkboxesOnClick(event) {
	browser.storage.local.set({
		[storageKeys.link]: targetLinkCheckbox.checked,
		[storageKeys.selection]: targetSelectionCheckbox.checked,
		[storageKeys.viewSourceLink]: targetViewSourceLinkCheckbox.checked,
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
		targetLinkCheckbox.checked = item[storageKeys.link] === undefined ? true : item[storageKeys.selection];
		targetSelectionCheckbox.checked = item[storageKeys.selection] === undefined ? true : item[storageKeys.selection];
		targetViewSourceLinkCheckbox.checked = item[storageKeys.viewSourceLink] === undefined ? true : item[storageKeys.viewSourceLink];
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
