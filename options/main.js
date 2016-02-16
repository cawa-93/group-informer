chrome.storage.local.get({groups:[]}, function (stg) {
	window.model = stg.groups;
	if (stg.groups) buildList(stg.groups);
});


function buildList(model) {
	const html = [];

		$.each(model, function(i, gr) {
			html.push('<tr id="id'+gr.id+'"> <th scope="row">'+gr.id+'</th> <td><img width="25" height="25" src="'+gr.photo_50+'"></td> <td>'+gr.name+'</td> <td><a href="https://vk.com/'+gr.screen_name+'">vk.com/'+gr.screen_name+'</a></td> <td><button type="button" class="btn btn-danger btn-xs btn-block" data-remID="'+gr.id+'">Удалить</button></td> </tr>')
		});

	$('.table > tbody').html(html);
	chrome.storage.local.get({groups:[]}, function (stg) {
		if (stg.groups) {
			$.each(model, function(i, gr) {
				for (var j = 0; j < stg.groups.length; j++) {
					if (stg.groups[j].id == model[i].id) {
						model[i].badge = stg.groups[j].badge;
						break;
					}
				}
			});
			chrome.storage.local.set({
				groups: model
			});
		}
	});


};

$('form').submit(function(event) {
	$form = $(this);

	const $id = $form.find('#inputID');
	const id = parseInt($id.val().trim());
	var hasErr = false;

	if (isNaN(id)) {
		$id.parent().addClass('has-error');
		hasErr = true;
	} else {
		$id.parent().removeClass('has-error');
		$('tr').removeClass('info');
		if (model.length)
			for (var i = model.length - 1; i >= 0; i--) {
				if (model[i].id === id) {
					$id.parent().addClass('has-error');
					$('tr#id'+id).addClass('info');
					hasErr = true;
					break;
				}
			}
	}

	const $key = $form.find('#inputKEY');
	const key = $key.val().trim();
	if (!key) {
		$key.parent().addClass('has-error');
		hasErr = true;
	} else {
		$key.parent().removeClass('has-error');
	}

	if (!hasErr) {
		new Vk().api('groups.getById', {
			group_ids: id
		}).done(function (groups) {
			$.each(groups, function(i, gr) {
				gr.key = key;
				gr.badge = 0;
				model.push(gr);
			});
			buildList(model);
		});
	}
	return false;
});

$('.table').on('click', '.btn-danger', function () {
	var id = $(this).attr('data-remID');
	var newModel = [];
	for (var i = 0; i < model.length; i++) {
		if (model[i].id != id) {
			newModel.push(model[i]);
		}
	}
	model = newModel;
	buildList(model);
});