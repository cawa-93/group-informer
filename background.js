/* globals document, jQuery, chrome, navigator, Vk, App, console, getCase, Informer*/
/*jshint esnext: true */
/*jshint -W097*/

"use strict";
const vk = new Vk();
var MainBadge = 0;

chrome.storage.local.get({'groups':[]}, function (stg) {
	var model = stg.groups;


	if (model.length) {

		var ids = [];
		$.each(model, function(i, gr) {
			ids.push(gr.id);
		});
		vk.api('groups.getById', {
			group_ids: ids
		}).done(function (groups) {
			$.each(groups, function(i, gr) {
				gr.key = model[i].key;
				gr.badge = 0;
				model[i] = gr;
			});
		});

		chrome.storage.local.set({
			groups: model
		});
	}
});

scanGroup(-1);
function scanGroup(i) {
	chrome.storage.local.get({'groups':[]}, function (stg) {
		const model = stg.groups;

		if (!model.length) {
			setTimeout(function () {
				scanGroup(-1);
			}, 1000);
			return false;
		}


		if (model[i+1] !== undefined) i++;
		else i = 0;

		vk.access_token = model[i].key;
		vk.api('messages.getDialogs', {
			count: 200,
			preview_length: '1',
			unread: 1
		})
		.done(function (resp) {
			model[i].badge = resp.count;
			chrome.storage.local.set({
				groups: model
			});
		})
		.always(function () {
			setTimeout(function () {
				scanGroup(i);
			}, 1000);
		});
	});
}


chrome.storage.onChanged.addListener(function (changes) {
	if (changes.groups) {
		const groups = changes.groups;
		var Badge = 0;
		$.each(groups.newValue, function(i, gr) {
			Badge += gr.badge || 0;
			if (groups.oldValue && groups.oldValue[i] && groups.oldValue[i].id === gr.id && groups.oldValue[i].badge < gr.badge) {
				chrome.notifications.create(gr.id+'', {
					type: 'basic',
					iconUrl: 'img/icon128.png',
					title: gr.name,
					message: 'Новое сообщение в диалоге',
					isClickable: true
				});
			}
		});
		if (Badge > MainBadge) {
			$('#audio')[0].play();
		}
		MainBadge = Badge;
		chrome.browserAction.setBadgeText({ text: Badge > 0 ? Badge+'' : '' });
	}
});

chrome.notifications.onClicked.addListener(function (id) {
	window.open('https://vk.com/gim'+id);
});
