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
}

function initDocuments() {
	document.getElementsByTagName('html')[0].lang = browser.i18n.getUILanguage();
	document.title = browser.i18n.getMessage('indexHTMLTitle');
	document.getElementById('tutorialTitleLabel').innerText = browser.i18n.getMessage('tutorialTitle');
	document.getElementById('icon').alt = browser.i18n.getMessage('iconImageAlt');
	document.getElementById('heading1').innerText = browser.i18n.getMessage('indexHTMLHeading1');
	document.getElementById('heading2').innerText = browser.i18n.getMessage('indexHTMLHeading2');

	const tutorialVideoAnchor = document.getElementById('tutorialVideoAnchor');
	tutorialVideoAnchor.innerText = browser.i18n.getMessage('watchTheVideo');
	tutorialVideoAnchor.href = browser.i18n.getMessage('indexHTMLTutorialVideo');
	document.getElementById('othersDivision').innerText = browser.i18n.getMessage('indexHTMLOthers');
	document.getElementById('cautionDivision').innerText = browser.i18n.getMessage('indexHTMLCaution');
}
