﻿/*
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

const tutorialId = 'tutorial';
const httpsAudioId = 'https-audio';
const httpsBookmarkId = 'https-Bookmark';
const httpsImageId = 'https-image';
const httpsLinkId = 'https-link';
const httpsPageId = 'https-page';
const httpsSelectionId = 'https-selection';
const httpsVideoId = 'https-video';
const viewSourceHttpsBookmarkId = 'view-source-https-Bookmark';
const viewSourceHttpsLinkId = 'view-source-https-link';
const viewSourceHttpsPageId = 'view-source-https-page';
const viewSourceHttpsSelectionId = 'view-source-https-selection';
const httpAudioId = 'http-audio';
const httpBookmarkId = 'http-Bookmark';
const httpImageId = 'http-image';
const httpLinkId = 'http-link';
const httpPageId = 'http-page';
const httpSelectionId = 'http-selection';
const httpVideoId = 'http-video';
const viewSourceHttpBookmarkId = 'view-source-http-Bookmark';
const viewSourceHttpLinkId = 'view-source-http-link';
const viewSourceHttpPageId = 'view-source-http-page';
const viewSourceHttpSelectionId = 'view-source-http-selection';

main();

function main() {
	readKeys();
	browser.browserAction.onClicked.addListener((tab) => {
		browser.sidebarAction.close();
		browser.sidebarAction.open();
	});
	browser.contextMenus.onClicked.addListener(openInTheSidebar);
	browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
		if (message.action === 'reflesh') {
			browser.storage.local.get().then((item) => updateContextMenus(item));
		}
	});
	browser.storage.local.get().then((item) => createContextMenus(item));
}

async function createContextMenus(settings) {
	const contextMenusObject = await createContextMenusObject(settings);

	browser.contextMenus.create({
		contexts: ['browser_action'],
		icons: {
			"48": "icons/icon-48.png",
			"96": "icons/icon-96.png",
			"192": "icons/icon-192.png",
			"384": "icons/icon-384.png",
			"768": "icons/icon-768.png",
			"1536": "icons/icon-1536.png"
		},
		id: tutorialId,
		title: browser.i18n.getMessage('tutorial')
	});

	for (let i in contextMenusObject) {
		for (let j in contextMenusObject[i]) {
			browser.contextMenus.create(contextMenusObject[i][j]);
		}
	}
}

async function createContextMenusObject(settings) {
	const protocol = settings[storageKeys.protocol] === undefined ? protocolKeys.ask : settings[storageKeys.protocol];
	const target = settings[storageKeys.target] === undefined ? targetKeys.ask : settings[storageKeys.target];

	let hasBookmarkPermission = false;
	await browser.permissions.getAll().then(result => {
		if (result.permissions.includes('bookmarks')) {
			hasBookmarkPermission = true;
		}
	});

	const bookmarkIsEnabled = hasBookmarkPermission && (target === targetKeys.ask || settings[storageKeys.bookmark] === undefined ? true : settings[storageKeys.bookmark]);
	const linkIsEnabled = target === targetKeys.ask || settings[storageKeys.link] === undefined ? true : settings[storageKeys.link];
	const pageIsEnabled = target === targetKeys.ask || settings[storageKeys.page] === undefined ? true : settings[storageKeys.page];
	const selectionIsEnabled = target === targetKeys.ask || settings[storageKeys.selection] === undefined ? true : settings[storageKeys.selection];
	const viewSourceBookmarkIsEnabled = hasBookmarkPermission && (target === targetKeys.ask || settings[storageKeys.viewSourceBookmark] === undefined ? true : settings[storageKeys.viewSourceBookmark]);
	const viewSourceLinkIsEnabled = target === targetKeys.ask || settings[storageKeys.viewSourceLink] === undefined ? true : settings[storageKeys.viewSourceLink];
	const viewSourcePageIsEnabled = target === targetKeys.ask || settings[storageKeys.viewSourcePage] === undefined ? true : settings[storageKeys.viewSourcePage];
	const viewSourceSelectionIsEnabled = target === targetKeys.ask || settings[storageKeys.viewSourceSelection] === undefined ? true : settings[storageKeys.viewSourceSelection];

	const contextMenusObject = {
		http: {},
		https: {}
	};

	const useHttpMessage = browser.i18n.getMessage('useHttp');
	const useHttpsMessage = browser.i18n.getMessage('useHttps');
	const viewSourceMessage = browser.i18n.getMessage('viewSource');
	const viewSourceHttpMessage = `(${viewSourceMessage})(${useHttpMessage})`;
	const viewSourceHttpsMessage = `(${viewSourceMessage})(${useHttpsMessage})`;

	// http
	contextMenusObject.http.audio = {
		contexts: ['audio'],
		id: httpAudioId,
		title: `${browser.i18n.getMessage('openThisAudio')}(${useHttpMessage})`,
		visible: protocol !== protocolKeys.https
	};

	contextMenusObject.http.bookmark = {
		contexts: ['bookmark'],
		id: httpBookmarkId,
		title: `${browser.i18n.getMessage('openThisBookmark')}(${useHttpMessage})`,
		visible: protocol !== protocolKeys.https && bookmarkIsEnabled
	};

	contextMenusObject.http.image = {
		contexts: ['image'],
		id: httpImageId,
		title: `${browser.i18n.getMessage('openThisImage')}(${useHttpMessage})`,
		visible: protocol !== protocolKeys.https
	};

	contextMenusObject.http.link = {
		contexts: ['link'],
		id: httpLinkId,
		title: `${browser.i18n.getMessage('openThisLink')}(${useHttpMessage})`,
		visible: protocol !== protocolKeys.https && linkIsEnabled
	};

	contextMenusObject.http.page = {
		contexts: ['page', 'tab'],
		id: httpPageId,
		title: `${browser.i18n.getMessage('openThisPage')}(${useHttpMessage})`,
		visible: protocol !== protocolKeys.https && pageIsEnabled
	};

	contextMenusObject.http.selection = {
		contexts: ['selection'],
		id: httpSelectionId,
		title: `${browser.i18n.getMessage('openThisSelection')}(${useHttpMessage})`,
		visible: protocol !== protocolKeys.https && selectionIsEnabled
	};

	contextMenusObject.http.video = {
		contexts: ['video'],
		id: httpVideoId,
		title: `${browser.i18n.getMessage('openThisVideo')}(${useHttpMessage})`,
		visible: protocol !== protocolKeys.https
	};

	contextMenusObject.http.viewSourceBookmark = {
		contexts: ['bookmark'],
		id: viewSourceHttpBookmarkId,
		title: `${browser.i18n.getMessage('openThisBookmark')}${viewSourceHttpMessage}`,
		visible: protocol !== protocolKeys.https && viewSourceBookmarkIsEnabled
	};

	contextMenusObject.http.viewSourceLink = {
		contexts: ['link'],
		id: viewSourceHttpLinkId,
		title: `${browser.i18n.getMessage('openThisLink')}${viewSourceHttpMessage}`,
		visible: protocol !== protocolKeys.https && viewSourceLinkIsEnabled
	};

	contextMenusObject.http.viewSourcePage = {
		contexts: ['page', 'tab'],
		id: viewSourceHttpPageId,
		title: `${browser.i18n.getMessage('openThisPage')}${viewSourceHttpMessage}`,
		visible: protocol !== protocolKeys.https && viewSourcePageIsEnabled
	};

	contextMenusObject.http.viewSourceSelection = {
		contexts: ['selection'],
		id: viewSourceHttpSelectionId,
		title: `${browser.i18n.getMessage('openThisSelection')}${viewSourceHttpMessage}`,
		visible: protocol !== protocolKeys.https && viewSourceSelectionIsEnabled
	};

	// https
	contextMenusObject.https.audio = {
		contexts: ['audio'],
		id: httpsAudioId,
		title: `${browser.i18n.getMessage('openThisAudio')}(${useHttpsMessage})`,
		visible: protocol !== protocolKeys.http
	};

	contextMenusObject.https.bookmark = {
		contexts: ['bookmark'],
		id: httpsBookmarkId,
		title: `${browser.i18n.getMessage('openThisBookmark')}(${useHttpsMessage})`,
		visible: protocol !== protocolKeys.http && bookmarkIsEnabled
	};

	contextMenusObject.https.image = {
		contexts: ['image'],
		id: httpsImageId,
		title: `${browser.i18n.getMessage('openThisImage')}(${useHttpsMessage})`,
		visible: protocol !== protocolKeys.http
	};

	contextMenusObject.https.link = {
		contexts: ['link'],
		id: httpsLinkId,
		title: `${browser.i18n.getMessage('openThisLink')}(${useHttpsMessage})`,
		visible: protocol !== protocolKeys.http && linkIsEnabled
	};

	contextMenusObject.https.page = {
		contexts: ['page', 'tab'],
		id: httpsPageId,
		title: `${browser.i18n.getMessage('openThisPage')}(${useHttpsMessage})`,
		visible: protocol !== protocolKeys.http && pageIsEnabled
	};

	contextMenusObject.https.selection = {
		contexts: ['selection'],
		id: httpsSelectionId,
		title: `${browser.i18n.getMessage('openThisSelection')}(${useHttpsMessage})`,
		visible: protocol !== protocolKeys.http && selectionIsEnabled
	};

	contextMenusObject.https.video = {
		contexts: ['video'],
		id: httpsVideoId,
		title: `${browser.i18n.getMessage('openThisVideo')}(${useHttpsMessage})`,
		visible: protocol !== protocolKeys.http
	};

	contextMenusObject.https.viewSourceBookmark = {
		contexts: ['bookmark'],
		id: viewSourceHttpsBookmarkId,
		title: `${browser.i18n.getMessage('openThisBookmark')}${viewSourceHttpsMessage}`,
		visible: protocol !== protocolKeys.http && viewSourceBookmarkIsEnabled
	};

	contextMenusObject.https.viewSourceLink = {
		contexts: ['link'],
		id: viewSourceHttpsLinkId,
		title: `${browser.i18n.getMessage('openThisLink')}${viewSourceHttpsMessage}`,
		visible: protocol !== protocolKeys.http && viewSourceLinkIsEnabled
	};

	contextMenusObject.https.viewSourcePage = {
		contexts: ['page', 'tab'],
		id: viewSourceHttpsPageId,
		title: `${browser.i18n.getMessage('openThisPage')}${viewSourceHttpsMessage}`,
		visible: protocol !== protocolKeys.http && viewSourcePageIsEnabled
	};

	contextMenusObject.https.viewSourceSelection = {
		contexts: ['selection'],
		id: viewSourceHttpsSelectionId,
		title: `${browser.i18n.getMessage('openThisSelection')}${viewSourceHttpsMessage}`,
		visible: protocol !== protocolKeys.http && viewSourceSelectionIsEnabled
	};

	return contextMenusObject;
}

async function openInTheSidebar(info, tab) {
	let url;
	try {
		browser.sidebarAction.open();

		switch (info.menuItemId) {
			case tutorialId:
				url = new URL(browser.runtime.getURL('/index.html'));
				break;
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
			case httpPageId:
			case httpsPageId:
			case viewSourceHttpPageId:
			case viewSourceHttpsPageId:
				url = new URL(tab.url);
				break;
			case httpBookmarkId:
			case httpsBookmarkId:
			case viewSourceHttpBookmarkId:
			case viewSourceHttpsBookmarkId:
				await browser.bookmarks.get(info.bookmarkId).then(bookmarks => {
					if (bookmarks[0].type === browser.bookmarks.BookmarkTreeNodeType.BOOKMARK) {
						url = new URL(bookmarks[0].url);
					} else {
						url = new URL(browser.runtime.getURL('error/error.html'));
					}
				});
				break;
		}

		switch (info.menuItemId) {
			case httpsAudioId:
			case httpsBookmarkId:
			case httpsImageId:
			case httpsLinkId:
			case httpsPageId:
			case httpsSelectionId:
			case httpsVideoId:
				url.protocol = 'https';
				break;
			case viewSourceHttpsBookmarkId:
			case viewSourceHttpsLinkId:
			case viewSourceHttpsPageId:
			case viewSourceHttpsSelectionId:
				url.protocol = 'https';
				if (!url.href.startsWith('view-source:')) {
					url.href = `view-source:${url.href}`;
				}
				break;
			case viewSourceHttpBookmarkId:
			case viewSourceHttpLinkId:
			case viewSourceHttpPageId:
			case viewSourceHttpSelectionId:
				if (!url.href.startsWith('view-source:')) {
					url.href = `view-source:${url.href}`;
				}
				break;
		}
	} catch (e) {
		console.error(e);
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
				default:
					url = new URL(browser.runtime.getURL('error/error.html'));
					break;
			}
		} catch (e) {
			console.error(e);
			url = new URL(browser.runtime.getURL('error/error.html'));
		}
	}

	browser.sidebarAction.setPanel({
		panel: url === undefined ? new URL(browser.runtime.getURL('error/error.html')) : url.href
	});
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

async function updateContextMenus(settings) {
	const contextMenusObject = await createContextMenusObject(settings);

	for (let i in contextMenusObject) {
		for (let j in contextMenusObject[i]) {
			browser.contextMenus.update(contextMenusObject[i][j].id, { visible: contextMenusObject[i][j].visible });
		}
	}
}
