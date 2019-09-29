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

const httpsAudioId = 'https-audio';
const httpsImageId = 'https-image';
const httpsLinkId = 'https-link';
const httpsSelectionId = 'https-selection';
const httpsVideoId = 'https-video';
const viewSourceHttpsLinkId = 'view-source-https-link';
const viewSourceHttpsSelectionId = 'view-source-https-selection';
const httpAudioId = 'http-audio';
const httpImageId = 'http-image';
const httpLinkId = 'http-link';
const httpSelectionId = 'http-selection';
const httpVideoId = 'http-video';
const viewSourceHttpLinkId = 'view-source-http-link';
const viewSourceHttpSelectionId = 'view-source-http-selection';
const openPageId = 'open-page';

browser.contextMenus.onClicked.addListener((info, tab) => {
	var url;
	try {
		switch (info.menuItemId) {
			case httpLinkId:
			case httpsLinkId:
			case viewSourceHttpLinkId:
			case viewSourceHttpsLinkId:
				url = new URL(info.linkUrl);
				break;
			case httpSelectionId:
			case httpsSelectionId:
			case viewSourceHttpSelectionId:
			case viewSourceHttpsSelectionId:
				url = new URL(info.selectionText);
				break;
			case httpAudioId:
			case httpImageId:
			case httpVideoId:
			case httpsAudioId:
			case httpsImageId:
			case httpsVideoId:
				url = new URL(info.srcUrl);
				break;
			case openPageId:
				url = new URL(tab.url);
		}

		switch (info.menuItemId) {
			case httpsLinkId:
			case httpsSelectionId:
			case httpsAudioId:
			case httpsImageId:
			case httpsVideoId:
				url.protocol = 'https';
				break;
			case viewSourceHttpsLinkId:
			case viewSourceHttpsSelectionId:
				url.protocol = 'https';
				url.href = `view-source:${url.href}`;
				break;
			case viewSourceHttpLinkId:
			case viewSourceHttpSelectionId:
				url.href = `view-source:${url.href}`;
				break;
		}

	} catch (e) {
		try {
			switch (info.menuItemId) {
				case httpSelectionId:
					url = new URL(`http://${info.selectionText}`);
					break;
				case httpsSelectionId:
					url = new URL(`https://${info.selectionText}`);
					break;
				case viewSourceHttpSelectionId:
					url = new URL(`view-source:http://${info.selectionText}`);
					break;
				case viewSourceHttpsSelectionId:
					url = new URL(`view-source:https://${info.selectionText}`);
					break;
			}
		} catch (e) {
			url = new URL(browser.extension.getURL("error/error.html"));
		}
	}

	browser.sidebarAction.setPanel({
		panel: url.href
	});

	browser.sidebarAction.open();
});

browser.contextMenus.onShown.addListener(function (info, tab) {
	browser.contextMenus.removeAll();
	browser.storage.local.get().then((item) => {
		createContextMenus(
			item[storageKeys.protocol] === undefined ? protocolKeys.ask : item[storageKeys.protocol],
			item[storageKeys.target] === undefined ? targetKeys.ask : item[storageKeys.target],
			item
		);
	});
});

browser.browserAction.onClicked.addListener((tab) => {
	browser.sidebarAction.close();
	browser.sidebarAction.open();
});

function createContextMenus(protocol, target, settings) {
	let linkIsEnabled = target === targetKeys.ask || settings[storageKeys.link] === undefined ? true : settings[storageKeys.link];
	let selectionIsEnabled = target === targetKeys.ask || settings[storageKeys.selection] === undefined ? true : settings[storageKeys.selection];
	let viewSourceLinkIsEnabled = target === targetKeys.ask || settings[storageKeys.viewSourceLink] === undefined ? true : settings[storageKeys.viewSourceLink];
	let viewSourceSelectionIsEnabled = target === targetKeys.ask || settings[storageKeys.viewSourceSelection] === undefined ? true : settings[storageKeys.viewSourceSelection];

	if (protocol !== protocolKeys.http) {
		browser.contextMenus.create({
			contexts: ['audio'],
			id: httpsAudioId,
			title: browser.i18n.getMessage("openingProtocolHttpsFromAudio")
		});

		browser.contextMenus.create({
			contexts: ['image'],
			id: httpsImageId,
			title: browser.i18n.getMessage("openingProtocolHttpsFromImage")
		});

		if (linkIsEnabled) {
			browser.contextMenus.create({
				contexts: ['link'],
				id: httpsLinkId,
				title: browser.i18n.getMessage("openingProtocolHttpsFromLink")
			});
		}

		if (selectionIsEnabled) {
			browser.contextMenus.create({
				contexts: ['selection'],
				id: httpsSelectionId,
				title: browser.i18n.getMessage("openingProtocolHttpsFromSelection")
			});
		}

		browser.contextMenus.create({
			contexts: ['video'],
			id: httpsVideoId,
			title: browser.i18n.getMessage("openingProtocolHttpsFromVideo")
		});

		if (viewSourceLinkIsEnabled) {
			browser.contextMenus.create({
				contexts: ['link'],
				id: viewSourceHttpsLinkId,
				title: browser.i18n.getMessage('openingProtocolViewSourceHttpsFromLink')
			});
		}

		if (viewSourceSelectionIsEnabled) {
			browser.contextMenus.create({
				contexts: ['selection'],
				id: viewSourceHttpsSelectionId,
				title: browser.i18n.getMessage('openingProtocolViewSourceHttpsFromSelection')
			});
		}
	}

	if (protocol !== protocolKeys.https) {
		browser.contextMenus.create({
			contexts: ['audio'],
			id: httpAudioId,
			title: browser.i18n.getMessage("openingProtocolHttpFromAudio")
		});

		browser.contextMenus.create({
			contexts: ['image'],
			id: httpImageId,
			title: browser.i18n.getMessage("openingProtocolHttpFromImage")
		});

		if (linkIsEnabled) {
			browser.contextMenus.create({
				contexts: ['link'],
				id: httpLinkId,
				title: browser.i18n.getMessage("openingProtocolHttpFromLink")
			});
		}

		if (selectionIsEnabled) {
			browser.contextMenus.create({
				contexts: ['selection'],
				id: httpSelectionId,
				title: browser.i18n.getMessage("openingProtocolHttpFromSelection")
			});
		}

		browser.contextMenus.create({
			contexts: ['video'],
			id: httpVideoId,
			title: browser.i18n.getMessage("openingProtocolHttpFromVideo")
		});

		if (viewSourceLinkIsEnabled) {
			browser.contextMenus.create({
				contexts: ['link'],
				id: viewSourceHttpLinkId,
				title: browser.i18n.getMessage('openingProtocolViewSourceHttpFromLink')
			});
		}

		if (viewSourceSelectionIsEnabled) {
			browser.contextMenus.create({
				contexts: ['selection'],
				id: viewSourceHttpSelectionId,
				title: browser.i18n.getMessage('openingProtocolViewSourceHttpFromSelection')
			});
		}
	}

	browser.contextMenus.create({
		contexts: ['page', 'tab'],
		id: openPageId,
		title: browser.i18n.getMessage('openingPageInTheSiderbar')
	});

	browser.contextMenus.refresh();
}
