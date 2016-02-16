"use strict";
chrome.storage.local.get({'groups':[]}, function (stg) {
	var model = stg.groups;
	var vk = new Vk();

	const buildList = (function () {
		const html = [];
		console.log(model);
		if (model.length)
			$.each(model, function(i, gr) {
				html.push($('<a/>', {
					'class':	'list-group-item',
					'href':		'https://vk.com/gim'+gr.id,
					'target':	'_blank',
					'html':		[
						'<span class="badge">' + (model[i].badge > 0 ? model[i].badge : '') + '</span>',
						'<img src="'+gr.photo_50+'" width="25" height="25">',
						'<span class="name">'+gr.name+'</span>',
					]
				}));
			});
		else {
			html.push($('<a/>', {
					'class':	'list-group-item',
					'href':		'chrome-extension://' + chrome.app.getDetails().id+'/options/index.html',
					'target':	'_blank',
					'html':		'Зайдите в настройки чтобы добавить сообщество'
				}));
		}

		// html.push($('<a/>', {
		// 	'class':	'list-group-item add-new',
		// 	'href':		'#',
		// 	'text':		'Добавить сообщество'
		// }));
		// html.push('<div class="input-group hidden"><span><input type="text" class="form-control gr-id" placeholder="ID сообщества"></span><span><input type="text" class="form-control gr-key" placeholder="Ключ доступа"></span><span class="input-group-btn">        <button class="btn btn-default add-btn" type="button">+</button>     </span></div>')
		$('.list-group').html(html);
	})();

	// $('.list-group').on('click', '.add-new', function () {
	// 	$(this).add('.input-group').toggleClass('hidden');
	// });

	// $('.input-group').on('click', '.add-btn', function () {
	// 	const $group = $('.input-group');
	// 	var hasErr = false;

	// 	const $id = $group.find('.gr-id');
	// 	const id = parseInt($id.val().trim());
	// 	if (isNaN(id)) {
	// 		$id.parent().addClass('has-error');
	// 		hasErr = true;
	// 	} else {
	// 		$id.parent().removeClass('has-error');

	// 		for (var i = model.length - 1; i >= 0; i--) {
	// 			if (model[i].id === id) {
	// 				$id.parent().addClass('has-error');
	// 				hasErr = true;
	// 				break;
	// 			} else if (model[i].id*(-1) === id) {
	// 				delete model[i];
	// 				hasErr = true;
	// 				chrome.storage.local.set({
	// 					groups: model
	// 				});
	// 				break;
	// 			}
	// 		}
	// 	}

	// 	const $key = $group.find('.gr-key');
	// 	const key = $key.val().trim();
	// 	if (!key) {
	// 		$key.parent().addClass('has-error');
	// 		hasErr = true;
	// 	} else {
	// 		$key.parent().removeClass('has-error');
	// 	}

	// 	if (!hasErr) {
	// 		vk.api('groups.getById', {
	// 			group_id: id
	// 		}).done(function (groups) {

	// 			$.each(groups, function(i, gr) {
	// 				if (gr.is_closed === 2) gr.name = 'vk.com/'+gr.screen_name;
	// 				gr.key = model[i].key;
	// 				gr.badge = 0;
	// 				model.push(gr);
	// 				chrome.storage.local.set({
	// 					groups: model
	// 				});
	// 			});
	// 		});
	// 	}
	// });
});
