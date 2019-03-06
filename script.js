document.addEventListener('DOMContentLoaded', function(){
	
	$('[data-modal-trigger]').on('click', function(e) {
		e.preventDefault();
		e.stopPropagation();
		var modalId = $(this).data('modal-trigger'),
			modalTabId = $(this).data('modal-tab'),
			paddingWidth = getScrollbarWidth();

		if(modalTabId) {
			$('[href="'+modalTabId+'"]').trigger('click');
		}
		$('body').addClass('modal-open').css('padding-right', paddingWidth);
		$(modalId).css('display','block').animate({'top':'50%'},500, function(){
			$(modalId).addClass('shown');
		});
	})
	$('.modal').on('click', function(e) {
		e.stopPropagation();
	})
	$('body').on('click', function(e) {
		closeModal();
	})
	$(document).on('keydown', function(e) {
		if(e.key == 'Escape') {
			closeModal();
		}
	})

	$('[data-tabs]').each(function() {
		var tabsBlock = $(this),
			tabsBlockId = '#'+$(tabsBlock).attr('id'),
			tabsControls = $('[data-tab-control="'+tabsBlockId+'"]'),
			tabsItems = $('[data-tab="'+tabsBlockId+'"]');

		$(tabsControls).on('click', function(e) {
			e.preventDefault();
			if(!$(this).hasClass('active')) {
				$(tabsControls).removeClass('active');
				$(tabsItems).removeClass('active');
				$($(this).attr('href')).addClass('active');
				$(this).addClass('active');
			}
		});
	});

	$('.field__btn').on('click', function() {
		var input = $(this).siblings('input');
		if($(this).hasClass('shown')) {
			$(input).attr('type', 'password');
			$(this).removeClass('shown').text('Show');
		} else {
			$(input).attr('type', 'text');
			$(this).addClass('shown').text('Hide');
		}
	})

	$('form').each(function() {
		validate($(this));
	});
	$('[data-same-field]').each(function() {
		var sameField = $($(this).data('same-field'));
		$(this).on('change', function() {
			if($(sameField).hasClass('hidden')) {
				$(sameField).slideDown('400', function() {
					$(this).removeClass('hidden')
				});
			}
		})
	})
})

function validate (form) {
	var fields = $(form).find('[required]'),
		submitBtn = $(form).find('[data-submit]'),
		validateStart = 0;

	var params = {
		email: {
			ex: /^([A-Za-z0-9]{1})+([A-Za-z0-9-_.]{1,})+([A-Za-z0-9]{1})+@([A-Za-z0-9]{1})+([A-Za-z0-9-_])?([A-Za-z0-9]{1})+[.]+([a-z]{2,})+(.[a-z]{2,})?$/,
			mess: {ex: 'Please check your email'}
		},
		username: {
			ex: /^([A-Za-z]{1})+([A-Za-z0-9]{2,})$/,
			mess: {ex: 'Username shoud start from a letter and contain 3 or more alphanumeric characters'}
		},
		password: {
			ex: /^(?=.*\d)(?=.*[a-zA-Z]).{3,}$/,
			mess: {ex: 'Passoword should be at least 3 characters long and contain at least 1 letter and 1 number'}
		},
		repeat_password: {
			ex: /^(?=.*\d)(?=.*[a-zA-Z]).{3,}$/,
			sameto: 'password',
			mess: {
				ex: 'Passoword should be at least 3 characters long and contain at least 1 letter and 1 number',
				sameto: 'Passwords do not match'
			}
		},
		terms_agree: {
			checked: true,
			mess: {checked: 'Please agree with the terms to create an account'}
		}
	};

	$(submitBtn).on('click', function(e) {
		e.preventDefault();
		$(fields).each(function() {
			checkField($(this));
		});
		validateStart = 1;
		if($(form).find('.error').length == 0) {
			$(form).find('[name*="password"]').attr('type', 'password');
			$(form).submit();
		}
	})

	$(fields).on('keydown', function(e) {
		var fieldType = $(this).attr('type');
		if(fieldType != "checkbox"){
			$(this).val(function(i, cv){
				var nv = cv.trim().substring(0,99);
				return nv;
			})
		}
	})
	$(fields).on('change keyup blur', function(e) {
		if(validateStart == 1) {
			checkField($(this));
			if($(this).data('same-field')) {
				checkField($($(this).data('same-field')+' input'));
			}
		}
	})

	function checkField(field) {
		var fieldName = $(field).attr('name');

		if(params[fieldName]['ex']) {
			if(params[fieldName]['ex'].test($(field).val())){
				removeError('ex');
			} else {
				placeError('ex');
			}
		}
		if(params[fieldName]['sameto']) {
			if($(field).val() == $(form).find('[name="'+params[fieldName]['sameto']+'"]').val()) {
				removeError('sameto');
			} else {
				placeError('sameto');
			}
		}
		if(params[fieldName]['checked']) {
			if(field[0].checked){
				removeError('checked');
			} else {
				placeError('checked');
			}
		}

		function placeError(errName) {
			$(field).addClass('error');

			if(params[fieldName]['errors']) {
				if(params[fieldName]['errors'].indexOf(errName) == -1) {
					params[fieldName]['errors'].push(errName);
				}
			} else {
				params[fieldName]['errors'] = [errName];
			}

			if(!$(form).find('.errorBlock').length) {
				$(submitBtn).before('<div class="errorBlock"></div>');
			}
			if($(form).find('.error_'+errName+'_'+fieldName).length == 0) {
				$(form).find('.errorBlock').append('<p class="error_'+errName+'_'+fieldName+'">'+params[fieldName]['mess'][errName]+'</p>');
			}
			if($(field).parents('.hidden').length) {
				$(field).parents('.hidden').slideDown('400', function() {
					$(this).removeClass('hidden')
				});
			}
		}
		function removeError(errName) {
			$(form).find('.error_'+errName+'_'+fieldName).remove();
			if(params[fieldName]['errors'] && params[fieldName]['errors'].indexOf(errName) != -1){
				params[fieldName]['errors'].splice(params[fieldName]['errors'].indexOf(errName),1);
			}

			if(!params[fieldName]['errors'] || params[fieldName]['errors'].length == 0) {
				$(field).removeClass('error');
			}

			if($(form).find('.error').length == 0) {
				$(form).find('.errorBlock').remove();
			}
		}
	}
}

function closeModal () {
	$('.modal.shown').animate({'top':'-50%'},500,function(){
		$('body').removeClass('modal-open').css('padding-right', 0);
		$('.modal').css('display','none').removeClass('shown');
		$('.modal').find('[data-tab-initial]').trigger('click');
	})
}
function getScrollbarWidth () {
	var scrollDiv = document.createElement('div');
	scrollDiv.className = 'modal-scrollbar-measure';
	document.body.appendChild(scrollDiv);
	var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
	document.body.removeChild(scrollDiv);
	return scrollbarWidth;
}