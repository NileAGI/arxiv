/* CUinfo Dynamic Components
   --------------------------------------------------------------------- */  

jQuery(document).ready(function($) {
  	// ***** cookie favorites
	  function getCookie(name) {
		var re = new RegExp(name + "=([^;]+)");
		var value = re.exec(document.cookie);
		return (value != null) ? unescape(value[1]) : null;
	  }
  
	  function updateFavDOM() {
		  cuinfoFavorites = JSON.parse(localStorage.getItem('cuinfoFavorites'));
		  $('.favorites-customize').html('<span class="fa fa-gear ignoreGA"></span>Edit');
		  $('#favorites ul').html("")
		  //add favorites to dom 
		  if (cuinfoFavorites.length > 0) {
			  var usedLinks = [];
			  $('.favorites-empty').hide();
			  for (var i = 0; i < cuinfoFavorites.length; i++) {
				  if (usedLinks.indexOf(cuinfoFavorites[i]) == -1) {
					  var thisLink = "a[data-link-id='" + cuinfoFavorites[i] + "']"; 
					  $(thisLink).parent('li').addClass('enabled');
					  $(thisLink + ':first').parent('li').clone().appendTo('#favorites ul'); 
					  usedLinks.push(cuinfoFavorites[i]);
				  }
			  } 
			  $('#favorites-welcome').hide();
			  $('#favorites, #section-home').show();
		  } 
		  else {
			  $('#favorites-welcome, #section-home').show(); 
		  }
	  }
	
	  //check cookie for userID
	  var userID = getCookie("CUINFO_FAV_USERID")
	
	//if we have localstorage 
	if (localStorage.getItem("cuinfoFavorites") && localStorage.getItem("cuinfoFavorites") != "[]") {
		if (userID) {
			$.ajax({
				type: 'get',
				cache: false,
				url: "/assets/getFavs.cfm"
			}).done(function(data) {
				localStorage.setItem('cuinfoFavorites',data);
				updateFavDOM()
			});
		} 
		else {
			$.ajax({
				type: 'get',
				url: "/assets/setFavs.cfm",
				data: {
					favorites: localStorage.getItem('cuinfoFavorites')
				}
			})
		}
	}
	else {
		if (userID) {
		   $.ajax({
			type: 'get',
			cache: false,
			url: "/assets/getFavs.cfm"
			}).done(function(data) {
			 	localStorage.setItem('cuinfoFavorites',data);
			  	updateFavDOM()
			});
		}
	}

	// for equal height columns
	var columns = [$("#sidebar_main"),$(".grid_nav")];

	function getQueryVariable(variable) {
		var query = window.location.search.substring(1);
		var vars = query.split("&");
		for (var i=0;i<vars.length;i++) {
			var pair = vars[i].split("=");
			if(pair[0] == variable){
				return pair[1];
			}
		}
		return(false);
	}
	
	// Windows class
	if (navigator.appVersion.indexOf('Win')!=-1) {
		$('body').addClass('win');
		if (navigator.appName.indexOf('Internet Explorer') || !!navigator.userAgent.match(/Trident\/7\./) ) {
			$('body').addClass('ie'); // includes ie11+
		}
	}
	// Android class
	if (navigator.userAgent.toLowerCase().indexOf("android") > -1) {
		$('body').addClass('android');
	}
	
	//FROM SO: jQuery code snippet to get the dynamic variables stored in the url as parameters and store them as JavaScript variables ready for use with your scripts:
	//using for url based routing
	//USAGE $.urlParam('param1'); // name
	$.urlParam = function(name){
	    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	    if (results==null){
	       return null;
	    }
	    else{
	       return results[1] || 0;
	    }
	}

	//manage alerts viewed array
	var newAlerts = 0;

	if (localStorage && localStorage.getItem('cuinfoAlertsViewed')) {
		var cuinfoAlertsViewed = JSON.parse(localStorage.getItem('cuinfoAlertsViewed'));
	}
	else {
		cuinfoAlertsViewed = [];
	} 

	// loop over alerts, push new ones to array
	$( ".alert-url").each(function( index ) {
		if ($.inArray($(this).attr('href'),cuinfoAlertsViewed) == -1) {
			newAlerts++; 
		}
	});
 
	//check for new operating status alerts
	$( ".alert-operating-status").each(function( index ) {
		if ($.inArray($(this).data('recordid'),cuinfoAlertsViewed) == -1) {
	  		newAlerts++; 
	  	}
	}); 
	
	//show alerts badge
	if (newAlerts > 0) { 
		$('.campus-alerts .badge-alert, .num-alerts').html(newAlerts).show(); 
		$('#alerts-text-notify').removeClass('alerts-text-notify-hidden');   
	}

	//bind weather click events
	$('.cuinfo-weather').data('click-category','weather').data('click-action','click').data('click-label','current conditions');	 

	/* shorten long alerts and add "read more link" */
	$(".alert-details").shorten({
    	moreText: 'read more',
    	lessText: '<<',
    	showChars: 300
	});

	//add GA tracking for the "read more" links
	$(".morelink").data('click-category','alerts')
		.data('click-action',$(this).parents().children('h4').html())
		.data('click-label',$(this).parents().children('.news-headline').html()); 

	/* init alert filters */
	$('#toggle-opstatus').click(function(){ $('.alert-opstatus').toggle(); })
	$('#toggle-special').click(function(){ $('.alert-special').toggle(); })
	$('#toggle-crime').click(function(){ $('.alert-crime').toggle(); })
	$('#toggle-IT').click(function(){ $('.alert-IT').toggle(); }) 



	/* Favorites ******************************************************** */
	//init favorites array 
	
	var cuinfoFavorites = [];
	//Load existing favorites from localStorage
	if (localStorage && localStorage.getItem('cuinfoFavorites')) {
		cuinfoFavorites = JSON.parse(localStorage.getItem('cuinfoFavorites'));
		$('#favorites-customize').html('<span class="fa fa-gear ignoreGA"></span>Edit');
  		
	} else {
		if(localStorage){
      		localStorage.setItem('cuinfoFavorites',JSON.stringify(cuinfoFavorites));
    	}
	} 
	
	//add favorites to dom 
	if (cuinfoFavorites.length > 0) {
		var usedLinks = [];
		$('.favorites-empty').hide();
		for (var i = 0; i < cuinfoFavorites.length; i++) {
			if (usedLinks.indexOf(cuinfoFavorites[i]) == -1) {
				var thisLink = "a[data-click-action='link-click | Favorites' data-click-category='links' data-link-id='" + cuinfoFavorites[i] + "']";
				$(thisLink).parent('li').addClass('enabled');
				$(thisLink + ':first').parent('li').clone().appendTo('#favorites ul'); 
				usedLinks.push(cuinfoFavorites[i]);
			}
		} 
		$('#favorites-welcome').hide();
		$('#favorites, #section-home').show();
	} 
	else {
		$('#favorites-welcome, #section-home').show(); 
	}

	// new fav links in sidebar
	if ($('.sidebar_favorites').length > 0) { 
		var ajaxFavURL = $('.sidebar_favorites').attr('data-ajax-href');
		var pathToResources = $('.sidebar_favorites').attr('data-path-to-resources');
		
		$.ajax({
			type: 'get',
			url: ajaxFavURL,
			data: {
				linkIDs: cuinfoFavorites.join(","),
				pathToResources: pathToResources
			}
		}).done(function( data ) {
			$('.sidebar_favorites').html(data);
			// Generates equal height columns AFTER the favorites are set
			equalHeightColumns(columns);
			$(window).resize(function(){
				equalHeightColumns(columns);
			})
		});
	}

	// Welcome Prompt
	$('#favorites-welcome a.accept').click(function(e) {
		e.preventDefault();
		checkFavoritesEmpty();
		$('#favorites-welcome').fadeOut(100,function() {
			toggleEditMode(false);
			$('#favorites').fadeIn(300);
		});
	});

	$('#favorites-welcome a.decline').click(function(e) {
		e.preventDefault();
		checkFavoritesEmpty();
		$('#favorites-welcome').fadeOut(100,function() {
			$('#favorites').addClass('empty').fadeIn(300);
		});
		//save preference
		if(localStorage){
      		localStorage.setItem('cuinfoHideFavoritesMsg',true);
    	}
	});

	//if user has previously declined, hide favorites prompt
	if (localStorage) {
		if (localStorage.getItem('cuinfoHideFavoritesMsg')) {
			$('#favorites-welcome').hide(function() {
				$('#favorites').addClass('empty').fadeIn(300);
			});
		}
	} 
		
	// "Done" Button
	$('#favorites').append('<a id="favorites-done" class="cuinfo-button done ignoreGA" href="#">Done</a>');

	$('#favorites-done').click(function(e) {
		e.preventDefault();
		toggleEditMode(false); 
		_gaq.push(['_trackEvent', 'favorites', 'customize-finish', 'done' ]);
	}); 
	
	// "Customize" Toggle
	var link_clicked = 0;
	$('#favorites-customize').click(function(e) {
		e.preventDefault();
		toggleEditMode();
	}); 

	// start page in edit mode
	if(getQueryVariable("editFav") == 'on'){
		toggleEditMode();
		$('#favorites-welcome').hide();
		$('#favorites').show();
	}

	function toggleEditMode(pushEvent){
		$('#favorites').toggleClass('enabled');

		if (typeof pushEvent === 'undefined') {
    		pushEvent = true;
		} 

		if ( $('#favorites').hasClass('enabled') ) { // activate edit mode -->
			$('.cu-info-link-set').addClass('favorites-edit');
			
			// Bind Star Toggles for favorites add/remove
			$('.cu-info-link-set li a').click(function(e){
				e.preventDefault();
				toggleFavorite($(this));
			});

			if (pushEvent === true) {
				//push GA event for activating edit mode
				_gaq.push(['_trackEvent', 'favorites', 'customize-start', 'Edit' ]);
			} 
		}
		else { // exit edit mode -->
			
			$('.cu-info-link-set').removeClass('favorites-edit');
			$('.cu-info-link-set li a').unbind('click'); // restore default link behavior
			$('#favorites li').each(function(i) { // clean up unstarred favorites
				if ( !$(this).hasClass('enabled') ) {
					$(this).remove();
				}
			});

			if (pushEvent === true) {
				//push GA event for activating edit mode
				_gaq.push(['_trackEvent', 'favorites', 'customize-finish', 'Edit' ]);
			} 
		} 

		//toggle class to links to override and ignore default link click push for GA
		$('ul.cuinfo-links a').not('#favorites-customize').toggleClass('ignoreGA');  
 
		checkFavoritesEmpty();
	}
	
	
	/* Utility Functions ************************************************ */
	
	// Update Favorites "empty" Class
	function checkFavoritesEmpty() {
		if ( $('#favorites li').length == 0 ) {
			$('#favorites').addClass('empty');
		}
		else {
			$('#favorites').removeClass('empty');
		}
	}
	
	// Reset Link Events (Star Toggles) in the Favorites Panel for Edit Mode
	// -- overrides general .cu-info-link-set link events
	function resetFavoritesEditMode() {
		$('#favorites li a').unbind('click');
		$('#favorites li a').click(function(e) {
			e.preventDefault();
			$('.cu-info-link-set li a[data-link-id="' + $(this).attr('data-link-id') + '"]').parent('li').toggleClass('enabled');
		});
	}

	function toggleFavorite(target) {
		//get uuid of link
		link_clicked = target.attr('data-link-id');
				
		//toggle enabled class of parent link(s)
		target.parent('li').toggleClass('enabled');
				
		if ( target.parent('li').hasClass('enabled') ) {
			//if parent now has enabled class, link is being added
			//check if link is in favorites div already	
			if ( $('#favorites a[data-link-id="'+link_clicked+'"]').length == 0 ) {
				//link is not already in favorites div, add it
				target.parent('li').clone().addClass('enabled').appendTo('#favorites ul').hide().fadeIn(300);
				
				// Bind Star Toggles for favorites add/remove for new link
				$('#favorites a[data-link-id="'+link_clicked+'"]').click(function(e){
					e.preventDefault();
					toggleFavorite($(this));
				});

				//check the localStorage array var, if the link is not already there, push it 
				if ($.inArray(link_clicked,cuinfoFavorites) == -1 ) {
					cuinfoFavorites.push(link_clicked);
				}

				//update local storage
				localStorage.setItem('cuinfoFavorites',JSON.stringify(cuinfoFavorites));
			}
			else { 
				//link is already in favorites div, so toggle it's star
				$('.favorites-edit a[data-link-id="'+link_clicked+'"]').parent('li').addClass('enabled');	
				
				//check the localStorage array var, if the link is not already there, push it 
				if ($.inArray(link_clicked,cuinfoFavorites) == -1 ) {
					cuinfoFavorites.push(link_clicked);
				} 

				//update local storage
				localStorage.setItem('cuinfoFavorites',JSON.stringify(cuinfoFavorites));
			}
			//push add event to GA
			_gaq.push(['_trackEvent', 'favorites', 'add', target.html() ]);
		}
		else {
			//parent doesn't have enabled class, link is being removed
			//remove enabled class from parent(s) of links
			$('.favorites-edit a[data-link-id="'+link_clicked+'"]').parent('li').removeClass('enabled');

			//remove item from localStorage array var
			if ($.inArray(link_clicked,cuinfoFavorites) != -1 ) { 
				cuinfoFavorites.splice($.inArray(link_clicked,cuinfoFavorites),1);
			}

			//push remove event to GA 
			_gaq.push(['_trackEvent', 'favorites', 'remove', target.html() ]);
			
			//update local storage
			localStorage.setItem('cuinfoFavorites',JSON.stringify(cuinfoFavorites));
		}  

		//resetFavoritesEditMode();
		checkFavoritesEmpty(); 

		// Generates equal height columns AFTER the favorites are set
		equalHeightColumns(columns);
		$(window).resize(function(){
			//console.log('resize, in general');
			equalHeightColumns(columns);
		})

		   // update the DB
		$.ajax({
			type: 'get',
			url: "/assets/setFavs.cfm",
			data: {
				favorites: localStorage.getItem('cuinfoFavorites')
				}
		})
	}
	
	/* Mobile Menu ****************************************************** */

	// If the mobile menu is open, ESC must close it (see Issue #89).
	$(document).on("keyup", function(e) {
		if (e.keyCode == 27) {
			if ($("#mobile-toggle").hasClass("open")) {
				$("#mobile-toggle").trigger("click");
			}
		}
	});

	// Must not be able to back-tab out of the mobile menu: must press ESC to exit it (see Issue #86 for comments).
	$("#aria-main-nav a").first().on("keydown", function(e) {
		if (e.shiftKey) {
			if (e.keyCode == 9) {
				$("#lastNavOption").focus();
				return false;
			}
		}
	});

	// Must not be able to tab out of the mobile menu: must press ESC to exit it (see Issue #86 for comments).
	$("#aria-main-nav a").last().on("keydown", function(e) {
		if (e.shiftKey) {
			if (e.keyCode == 9) {
				$("#prelastNavOption").focus();
				return false;
			}
		}
		if (e.keyCode == 9) {
			$("#firstNavOption").focus();
			return false;
		}
	});

	// mobile toggle
	$('#mobile-toggle').click(function(e) {
		if ($(this).attr("aria-expanded") == "true") {
			$(this).attr("aria-expanded", "false");
			$("#aria-main-nav").find("a").each(function() {
				$(this).attr("tabindex", -1);
			});
		}
		else {
			$(this).attr("aria-expanded", "true");
			$("#aria-main-nav").find("a").each(function() {
				$(this).attr("tabindex", 0);
			});
		}
		e.preventDefault();
		$('#navigation, #popup-background').toggleClass('open');
		$(this).toggleClass('open');
	});
	
	// click anywhere to close
	$('#mobile-toggle').before('<div id="popup-background"></div>');
	$('#popup-background').click(function(e) {
		e.stopPropagation();
		$('#mobile-toggle').trigger('click');
	});
	
	// floating placement
	var nav_offset_mobile = 52;
	function scrollUpdate() {
		if ( $(window).scrollTop() >= nav_offset_mobile ) {
			$('#mobile-toggle, #navigation').addClass('fixed')
		}
		else {
			$('#mobile-toggle, #navigation').removeClass('fixed');
		}
	}
	$(window).scroll(scrollUpdate);

	// If on desktop window widths, disable the mobile nav button so that it cannot receive focus. See Issue #87.
	if (window.innerWidth >= 1024) {
		$("#mobile-toggle").attr("tabindex", -1);
	}

	// If on non-desktop window widths prevent focus on hidden elements. See Issue #88.
	if (window.innerWidth < 1024) {
		$("#search-query").attr("tabindex", -1);
		$("#icon-search-button").attr("tabindex", -1);
		$("#cu-brand").attr("tabindex", -1);
	}
	// Check whether mobile nav panel is open / handle it toggling so its links are focusable.
	if ($("#mobile-toggle").attr("aria-expanded") == "false") {
		$("#aria-main-nav").find("a").each(function() {
			$(this).attr("tabindex", -1);
		});
	}

	// Use code below to activate focus feedback on all elements to show their visibility and DOM IDs when determining which elements need to be appear or not.
	var debugFocus = false;
	if (debugFocus) {
		$(document).on("focus", "*", function(e) {
			var activeElement = document.activeElement;
			console.log(activeElement);
			console.log("visible / id: ", $(activeElement).is(":visible"), $(activeElement).attr("id"));
		});
	}

	// close mobile search box when exited via tab press
	$(document).on("keydown", "#search-query", function(e) {
		if (e.keyCode == 9) {
			$("#search-trigger").trigger("click");
			$("#mobile-toggle").focus();
		}
	});

	// close mobile search box when exited via ESC key
	$(document).on("keyup", "#search-query", function(e) {
		if (e.keyCode == 27) {
			$("#search-trigger").trigger("click");
			$("#mobile-toggle").focus();
		}
	});


	
	/* Image Preloads *************************************************** */
	$(new Image()).attr('src','assets/images/star_on.svg');

	/* Suggest a link form */
	$('#cuinfo-suggest-submit').click(function(e){ 
		e.preventDefault();
		if (validateFeedbackForm()) {
			$.post("../ajax/suggestLink.cfm",$('#cuinfo-suggest').serialize(),function(data){
				$('#section-suggest .cu-info-block').fadeOut(function(){
					$('cuinfo_suggest_url, cuinfo_suggest_comments').val('');
					$('#section-suggest').prepend(data); 
					$('.submit-another-link').click(function(){ 
						$('.cuinfo-suggest-thankyou').fadeOut(function(){
							$('#section-suggest .cu-info-block').fadeIn(); 
							$('#cuinfo_suggest_url, #cuinfo_suggest_comments').val(''); 
							$('#cuinfo_suggest_url').focus(); 
						}); 
					});
				});
			});
		} 
	});

	/*Add caption <p> to Instagram on Cornell Today page */
	$('.social-instagram').append('<div class="copy-block"><p>' + $('.instagram-link').attr('alt')  + '</p></div>');
	/*add GA data to Insagram link*/
	$('.instagram-link').data('click-action','instagram click');
	$('.instagram-link').data('click-category','photo');
	$('.instagram-link').data('click-label',$('.instagram-link').attr('alt'));

	/*push GA events on search*/
	$('[id^="cu-people-search"]').submit(function(e){
		_gaq.push(['_trackEvent', 'search', 'cuinfo-people-search', $(this).find('[name="q"]').val() ]);
	}); 

	removeCornellTodayDupes();
	removeChronicleSidebarDupes();   
	checkEmptyTopNews();
	inMemory();
	campusUpdatesHeaders();
	removeExtraHR();
	$('p').linkify();  
	
}); //end onready


//update alerts viewed timestamp
function setAlertTimestamp() { 
	if (localStorage) { 
		if (!Date.now) {
			Date.now = function() { return new Date().getTime(); }
		}
		var cuinfoAlertTimestamp = Math.floor(Date.now() / 1000);
		localStorage.setItem('cuinfoAlertTimestamp', cuinfoAlertTimestamp);
	}
}

function removeCornellTodayDupes() {
	$('#sidebar-main .chronicle-entry a').each(function(index) {
		var $chronLink = $(this); 
		$('.top-news a').each(function(index) {
			if ( $(this).attr('href') == $chronLink.attr('href') || $(this).children('h4').html().trim() == $chronLink.html().trim() ) {   
				console.log('dupe found');
				$chronLink.parent().remove();
				$('#sidebar-main .chronicle-entry.hideme').eq(0).removeClass('hideme'); 
			}
		});
	});
	$('.cu-info-block.news').show();
} 

function removeChronicleSidebarDupes() {
	$('#sidebar-main .chronicle-updater-entry a').each(function(index) {
		var $chronLink = $(this); 
		$('#sidebar-main .chronicle-entry:not(.chronicle-updater-entry) a').each(function(index) { 
			if ( $(this).attr('href').replace("www.","").trim() == $chronLink.attr('href').replace("www.","").trim() || $(this).html().trim() == $chronLink.html().trim() ) {    
				$(this).parent().remove(); 
				$('#sidebar-main .chronicle-entry.hideme').eq(0).removeClass('hideme'); 
			}
		});
	});
	$('.cu-info-block.news').show();
} 

function checkEmptyTopNews() {
	if ($('.top-news').html() == '') {
		$('.top-news').hide();
	}
}

//update local storage 
function updateAlertsViewed() {
	if (localStorage && localStorage.getItem('cuinfoAlertsViewed')) {
		var cuinfoAlertsViewed = JSON.parse(localStorage.getItem('cuinfoAlertsViewed'));
	}
	else {
		cuinfoAlertsViewed = [];
	} 

	$( ".alert-url").each(function( index ) {
		cuinfoAlertsViewed.push($(this).attr('href'));
	});

	$( ".alert-operating-status").each(function( index ) {
		cuinfoAlertsViewed.push($(this).data('recordid'));
	}); 
	
	localStorage.setItem('cuinfoAlertsViewed', JSON.stringify(cuinfoAlertsViewed));
} 

function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

function validateFeedbackForm() {
	var valid = true;
	var msg = "";
	if ($('#cuinfo_suggest_name').val().trim() == '') {
		var msg = "Please enter your name. \n"; 
		var valid = false;
	} 
	if ($('#cuinfo_suggest_email').val().trim() == '') {
		var msg = msg + "Please enter your email. \n"; 
		var valid = false;
	} 
	if (!validateEmail($('#cuinfo_suggest_email').val())) {
		var msg = msg + "Please enter a valid email address. \n"; 
		var valid = false;
	}

	if ($('#cuinfo_suggest_comments').val().trim() == '') {
		var msg = msg + "Please enter your comments. \n";  
		var valid = false;
	} 
	if (valid) {
		return true
	}
	else {
		alert(msg);
		return false
	}
}

function inMemory() {
	if ( $( ".in-memoriam" ).length ) {
    	$( ".in-memory" ).show(); 
	}
}

function campusUpdatesHeaders() {
	$("h3.campus-updates:not(:eq(0))").hide();
}

function removeExtraHR() {
	if($("div.cu-info-block.top-news").html()) {
		if ($("div.cu-info-block.top-news").html().trim() == '') {
			$("div.cu-info-block.top-news").hide();
		}
	}
}

function equalHeightColumns(columnArray) {
	var tallest = 0;

	if (window.innerWidth > 1050) {
		$(columnArray).each(function(el) {
			if($(this).outerHeight() > tallest) {
				tallest = $(this).outerHeight();
			}
		});

		$(columnArray).each(function(el) {
			$(this).css('min-height',tallest);
		});
	}
	else {
		$(columnArray).each(function(el) {
			$(this).css('min-height',0);
		});
	}
}
 

