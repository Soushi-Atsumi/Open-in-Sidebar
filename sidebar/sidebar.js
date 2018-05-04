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

browser.sidebarAction.getTitle({}).then((toggleTitle) => {
	browser.sidebarAction.getPanel({}).then((sidebarUrl) => {
		if (sidebarUrl === browser.extension.getURL(`sidebar/sidebar.html`)) {
			window.location = browser.i18n.getMessage("url_index.html")
		}
	})
});
