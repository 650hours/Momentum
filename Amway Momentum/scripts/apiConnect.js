/**
	Copyright notice.
	Developed by 650hours for Gower for Amway Momentum 2013.
	stew@650hours.com
*/

// Load the agenda
function loadAgenda() {
	
	// Show the loading screen
	app.application.showLoading();
	
	// Make sure the navigation is showing
	$('.km-header').show();
	$('.km-footer').show();
	
	// Scroll to the top of the page
	$(".km-scroll-container").css("-webkit-transform", "");
	
	// Have to do this here rather than on the page on init as if we do it there, the styling is messed up
	hideBackButton();

	$.ajax({
	url: 'http://amway.650h.co.uk/index/default/getAgenda',
	error: handleAjaxError, cache: true}).done(function(data) {
		
		// Put content in place on the page
		$("#agendaTitle").html(data.agendaTitle);
		$("#agendaWelcome").html(data.agendaText);
		$("#outlineAgendaTitle").html(data.outlineAgendaTitle);
		$("#outlineAgendaText").html(data.outlineAgendaText);
		$("#detailedAgendaTitle").html(data.detailedAgendaTitle);
		$("#detailedAgendaText").html(data.detailedAgendaText);
		$("#venueTitle").html(data.venueTitle);
		$("#venueText").html(data.venueText);
		$("#dressTitle").html(data.dressTitle);
		$("#dressText").html(data.dressText);
		$("#assistanceTitle").html(data.assistanceTitle);
		$("#assistanceText").html(data.assistanceText);
	})
	
	app.application.hideLoading();
}


// Load hospitality desk
function loadHospitality() {
	
	// Show the loading screen
	app.application.showLoading();
	
	$.ajax({
	url: 'http://amway.650h.co.uk/index/default/getHospitality',
	error: handleAjaxError, cache: true}).done(function(data) {

		// Put content in place on the page
		$("#introTitle").html(data.introTitle);
		$("#introText").html(data.introText);
		$("#visitTitle").html(data.visitTitle);
		$("#visitText").html(data.visitText);
		$("#tripadvisorTitle").html(data.tripadvisorTitle);
		$("#tripadvisorText").html(data.tripadvisorText);
	})
	
	app.application.hideLoading();
}


// Load workshop list
function loadWorkshopList() {
	
	// Show the loading screen
	app.application.showLoading();
	
	var userWorkshopList = '';
	var otherWorkshopList = '';
	
	var uid = window.localStorage.getItem("userShortId");

	$.ajax({
	url: 'http://amway.650h.co.uk/index/default/getWorkshopsList/' + uid,
	error: handleAjaxError, cache: true}).done(function(data) {
		
		// Build the lists of user attended workshops and other workshops
		$.each(data, function(i,item) {
			if(item.userIsAttending == 1) {
				userWorkshopList = userWorkshopList + '<a href="#tabstrip-workshop?wid='+item.workshopId+'"><li class="topcoat-list__item rightNavArrow">' + item.workshopTitle + '</li></a>';
			} else {
				otherWorkshopList = otherWorkshopList + '<a href="#tabstrip-workshop?wid='+item.workshopId+'"><li class="topcoat-list__item rightNavArrow">' + item.workshopTitle + '</li></a>';
            }
		}) 
		
		if(userWorkshopList === '') {
			userWorkshopList = userWorkshopList + '<a href="javascript: void(0); return false;"><li class="topcoat-list__item">You have no workshops</li></a>';
        }
		
		// Put content in place on the page
		$("#userWorkshopList").html(userWorkshopList);
		$("#otherWorkshopList").html(otherWorkshopList);
	});
	
	app.application.hideLoading();
}


// Load an individual workshop
function loadWorkshop(e) {
	
	// Show the loading screen
	app.application.showLoading();
	
	// Show the back button
	showBackButton();
	
	// Scroll to the top of the page
	$(".km-scroll-container").css("-webkit-transform", "");
	
	var tabstrip = app.application.view().footer.find(".km-tabstrip").data("kendoMobileTabStrip");
	tabstrip.switchTo("#tabstrip-workshops");
	
	var workshopId = e.view.params.wid;	
	var topicList = resourceList = '';

	$.ajax({
	url: 'http://amway.650h.co.uk/index/default/getWorkshop/' + workshopId,
	error: handleAjaxError, cache: true}).done(function(data) {
				
		// Topics for this workshop
		if(data.topics.length > 0) {
			$.each(data.topics, function(i,item) {
				topicList = topicList + '<a href="#tabstrip-topic?tid='+item.topicId+'"><li class="topcoat-list__item rightNavArrow">' + item.topicTitle + '</li></a>';
			})
		} else {
			topicList = '<li class="topcoat-list__item">There are no topics for this workshop</li>';
        }
		
		// Resources for this workshop
		if(data.resources.length > 0) {
			$.each(data.resources, function(i,item) {
				resourceList = resourceList + '<a onclick="window.open(\'' + item.resourcePath +'\',\'_system\');"><li class="topcoat-list__item rightNavArrow">' + item.resourceName + ' (' + item.resourceType + ')</li></a>';
			})
		} else {
			resourceList = '<li class="topcoat-list__item">There are no resources for this workshop</li>';
        }
		
		// Put content in place on the page
		$("#workshopTitle").html('About ' + data.workshopTitle);
		$("#workshopDescription").html(data.workshopDescription);
		$("#topicList").html(topicList);
		$("#resourceList").html(resourceList);
	});
	
	app.application.hideLoading();
}


// Load a topic
function loadTopic(e) {
	
	// Show the loading screen
	app.application.showLoading();

	// Show the back button
	showBackButton();
	
	// Scroll to the top of the page
	$(".km-scroll-container").css("-webkit-transform", "");
	
	var topicId = e.view.params.tid;
	
	$.ajax({
	url: 'http://amway.650h.co.uk/index/default/getTopic/' + topicId,
	error: handleAjaxError, cache: true}).done(function(data) {
		
		// Put content in place on the page
		$("#topicTitle").html(data.topicTitle);
		$("#topicDescription").html(data.topicDescription);
	});
	
	app.application.hideLoading();
}


// Load the wall - starts with 20 posts, but supports paging
function loadWall() {
	
	// Show the loading screen
	app.application.showLoading();
	
	// Make sure the navigation is showing
	$('.km-footer').show();
	
	// Show the add post button
	showAddPostButton();
	
	// Hide the back button
	hideBackButton();
	
	var uid = window.localStorage.getItem("userShortId");

	$.ajax({
	url: 'http://amway.650h.co.uk/index/default/getWallposts/0/30/'+uid,
	error: handleAjaxError, cache: false}).done(function(data) {
		
		var wallPosts = '';
		var data = eval(data);
		
		wallPosts = buildWallView(data.posts);
		
		$("#wallPosts").html(wallPosts);
	});
	
	app.application.hideLoading();
}


// Build a wall post view (for paging)
function buildWallView(posts) {
	
	var wallPosts = '';
	var uid = window.localStorage.getItem("userShortId");
	
	// Build the lists of wall posts
	$.each(posts, function(i,item) {
		
		var pid = item.wallpostId,
			ptx = nl2br(item.postText),
			nck = item.nickname;
		
		wallPosts = wallPosts +
			'<a href="#tabstrip-viewPost" onClick="window.localStorage.setItem(\'pid\', ' + pid + ');">' +
			'<div class="wallPost rightNavArrow" style="width: 100%; min-height: 30px;">';
		
		if(item.image != '') {
			wallPosts = wallPosts + 
			'<div style="float: left; width: 62px">' +
			'<img src="http://amway.650h.co.uk' + item.image + '" width="60px" height="60px" />' +
			'</div>' +
			'<div style="margin-left: 62px; padding-right: 1em;">' +
			'<p class="postText"><b>' + nck + ':</b> ' + ptx + '<br />' +
			'</p></div>';
		} else {
			wallPosts = wallPosts + 
			'<div style="padding-right: 1em; padding-bottom: 0.5em"><p class="postText">' +
			'<b>' + nck + ':</b> ' + ptx + '<br />' +
			'</p></div>';
		}
		
		wallPosts = wallPosts + '</div></a>' +
								'<div style="clear: both; margin: 0.5em 0 0 0">';
		
		if(item.image != '') {
			wallPosts = wallPosts + '<div style="float: left; width: 62px">&nbsp;</div>' +
									'<div style="margin-left: 62px;">';
		} else {
			wallPosts = wallPosts + '<div>';
		}
		
		wallPosts = wallPosts + '<div class="lastUpdated" style="float: left; padding-top: 4px"><nobr>' + item.lastUpdated + '</nobr></div>' +
								'<div style="text-align: right;">';
		
		// Like button
		if(item.likedByThisUser) {
			wallPosts = wallPosts + '<nobr><span class="likeButton buttonSelected" id="likeButton'+pid+'">' +
									'<a href="javascript: void(0);" onClick="postUnlike('+pid+','+uid+');">' +
									'<span id="currentLikes'+pid+'">'+item.numberLikes+'</span></a></span></nobr>';
        } else {
			wallPosts = wallPosts + '<nobr><span class="likeButton" id="likeButton'+pid+'">' +
									'<a href="javascript: void(0);" onClick="postLike('+pid+','+uid+');">' +
									'<span id="currentLikes'+pid+'">'+item.numberLikes+'</span></a></span></nobr>';
		}
		
		// Comment button selected?
		var buttonSelected = '';
		
		if(item.numberComments > 0) {
			buttonSelected = " buttonSelected";
		}
		
		wallPosts = wallPosts + '<nobr><span class="commentButton'+buttonSelected+'">' +
								'<a href="#tabstrip-viewPost" onClick="window.localStorage.setItem(\'pid\', ' + pid + ');">'+item.numberComments+'</a></span></nobr>';
		
		wallPosts = wallPosts + '</div></div><div style="clear: both" class="wallPostOnWall"></div>'
	});
	
	return wallPosts;
}


// View a specific wallpost, along with likes and comments
function viewPost() {
	
	// Show the loading screen
	app.application.showLoading();
	
	// Show the back button and ensure the destination is the wall if we've just made a comment
	var justPosted = window.localStorage.getItem("justPosted");
	
	if(justPosted == 1) {
		showBackButtonAndChangeDestinationToWall();
		window.localStorage.setItem("justPosted", 0);
	} else {
		showBackButton();
    }
	
	// Make sure the navigation is hidden
	$('.km-footer').hide();
	
	// Scroll to the top of the page
	$(".km-scroll-container").css("-webkit-transform", "");
	
	// We need the postId, of course!
	var pid = window.localStorage.getItem("pid");
	
	// And we need the user id to see if they made any posts
	var uid = window.localStorage.getItem("userShortId");
	
	// Clear out the commentMade box, otherwise comments look duplicated
	$('#commentMade').html('');
	$('#newComment').val('');

	$.ajax({
	url: 'http://amway.650h.co.uk/index/default/getPost/' + pid,
	error: handleAjaxError, cache: false}).done(function(data) {
		
		var post = data.post,
			comments = data.comments,
			likes = eval(data.likes),
			originalPost = '',
			likesList = '',
			commentList = '',
			nickname = ''
			fullImage = '';
		
		var nck = post[0].nickname,
			ptx = nl2br(post[0].postText),
			img = post[0].image;
		
		// Do we show the delete button (only if this user is the original poster)?
		if(post[0].userShortId === uid) {
			showDeletePostButton();
        }
			
		// Make likes list
		if(likes.length > 0) {
			$.each(likes, function(i,like) {			
				if(like.userShortId == uid) {
					nickname = 'You';
                } else {
					nickname = like.nickname;
                }
				likesList = likesList + nickname + ', ';
			});
			likesList = 'Liked by: ' + likesList.substring(0,likesList.length-2);
		} else {
			likesList = "No likes";
        }
		
		// Make original post
		if(img != '') {
			originalPost = originalPost + '<div class="wallPost"><table width="100%"><tr>' +
							'<td><a onClick="showFullImage()"><img src="http://amway.650h.co.uk' + img + '" width="100px" height="100px" /></a></td>' +
							'<td valign="top"><p><b>' + nck + ':</b> ' + ptx + '</p></td></tr></table><p>'+likesList+'</p></div>';
			fullImage = '<center><img src="http://amway.650h.co.uk' + img + '" />';
		} else {
			originalPost = originalPost + '<div class="wallPost"><p style="font-weight: bold">' + nck + ' said:</p>' +
							'<p>' + ptx + '</p><p style="font-size: 0.8em">'+likesList+'</p></div>';
		}
		
		$('#originalPost').html(originalPost);
		
		// Make comments area
		if(comments.length > 0) {
			$.each(comments, function(i,comment) {
				if(comment.userShortId == uid) {
					nickname = 'You';
                } else {
					nickname = comment.nickname;
                }
				commentList = commentList + '<div class="op_commentBox">' +
											'<p><span style="font-weight: bold">' + nickname + '</span> replied:</p>' +
											'<p> ' + nl2br(comment.commentText) + '</p></div>';
			});
		} else {
			commentsList = "No comments";
        }
		
		$('#commentList').html(commentList);
		$('#fullImage').html(fullImage);
	});
	
	app.application.hideLoading();
}

// Add a new comment (prepare)
function addComment() {
	
	// Show the back button
	showBackButton();
	
	// Make sure the navigation is hidden
	$('.km-footer').hide();
	
	// Clear the textarea
	$('.newComment').val('');
	$('.newComment').text('');
	

}


// Add a new post (prepare)
function addPost() {
	
	// Show the back button
	showBackButton();
	
	// Make sure the navigation is hidden
	$('.km-footer').hide();
	
	// Clear the textarea
	$('#newPost').val('');
	
	// Make sure that we have no imageId in cache (in case they bailed mid way through a post)
	window.localStorage.setItem("imageId", 0);
	
	// And ensure that the preview field is hidden and empty
	$('#postBox').show();
	$('#previewImage').hide();
	$('#previewImageRemove').hide();
	$("#previewImage").attr('src','');
}

// Add a new post (do)
function addPostDo () {
	
	var newpost = $("#newPost").val();
	newPost = newpost.trim();
	
	if(newpost === '') {
		navigator.notification.alert('Please enter some text into your post!', function () { }, 'Post failed', 'OK');
		return;
	}
			
	// Get the imageId if one is set
	var imageId = window.localStorage.getItem("imageId");
	
	// We need the userId to attribute the post to
	var uid = window.localStorage.getItem("userShortId");
	
	$.ajax({
		url: 'http://amway.650h.co.uk/index/default/newPost/' + uid + '/' + btoa(newpost) + '/' + imageId,
		error: function() {
			$("#resultBlock").html('<h2>Sorry, an error ocurred. Please try again.</h2>');	
        },
		cache: false}).done(function(data) {
			$('#postComment').val('');
			window.localStorage.setItem("imageId", 0);
			navigator.notification.alert('Your new post has been created and will immediately show on the wall.', function () { }, 'Sucessful Post', 'OK');

			navigateToWall();
	});
}


// Add a like to a post
function postLike(pid, uid) {
	
	// Show the loading screen
	app.application.showLoading();
	
	$.ajax({
	url: 'http://amway.650h.co.uk/index/default/postLike/' + pid + '/' + uid,
	error: handleAjaxError, cache: false}).done(function(data) {
		
		// Make sure we target the correct like data
		var replaceDiv = '#currentLikes' + pid;
		var likeButton = '#likeButton' + pid;
		
		// Add unlike html
		var likeText = '<a href="javascript: void(0);" onClick="postUnlike('+pid+','+uid+');">' +
					   '<span id="currentLikes'+pid+'">'+data.currentLikes+'</span></a>';

		// Do it!
		$(likeButton).html(likeText);
		$(likeButton).addClass("buttonSelected");
	});
	
	app.application.hideLoading();
}


// Remove a like from a post
function postUnlike(pid, uid) {
	
	// Show the loading screen
	app.application.showLoading();
	
	$.ajax({
	url: 'http://amway.650h.co.uk/index/default/postUnlike/' + pid + '/' + uid,
	error: handleAjaxError, cache: false}).done(function(data) {
		
		// Make sure we target the correct like data
		var replaceDiv = '#currentLikes' + pid;
		var likeButton = '#likeButton' + pid;
		
		// Post like html
		var likeText = '<a href="javascript: void(0);" onClick="postLike('+pid+','+uid+');">' +
					   '<span id="currentLikes'+pid+'">'+data.currentLikes+'</span></a>';
		
		// Do it!
		$(likeButton).html(likeText);
		$(likeButton).removeClass("buttonSelected");
	});
	
	app.application.hideLoading();
}


function deletePostConfirm() {
	// Make sure the navigation is hidden
	$('.km-footer').hide();
	
	// Show the back button
	showBackButton();
}


function deletePostDo() {
	
	// Show the loading screen
	app.application.showLoading();
	
	// Make sure the navigation is hidden
	$('.km-footer').hide();
	
	// Show the back button
	showBackButton();

	// We need the postId, of course!
	var pid = window.localStorage.getItem("pid");
	
	$.ajax({
	url: 'http://amway.650h.co.uk/index/default/deletePost/' + pid,
	error: handleAjaxError, cache: false}).done(function(data) {
		
		// Confirm deletion
		navigator.notification.alert('Your post, along with all comments and likes, has been deleted.', function () { }, 'Deletion sucessful', 'OK');
		
		app.application.hideLoading();
		
		// Navigate back to the wall
		app.application.navigate("#tabstrip-wall");
	});
	
	app.application.hideLoading();
	
}


// Camera handling
function getImageFromLibrary() {
    navigator.camera.getPicture(
        uploadPhoto,
        function(message) { },
        {
			quality         : 50,
			targetWidth	 : 300,
			targetHeight	: 300,
			destinationType : navigator.camera.DestinationType.FILE_URI,
			sourceType      : navigator.camera.PictureSourceType.PHOTOLIBRARY
        }
    );
}
function getImageFromCamera() {
    navigator.camera.getPicture(
        uploadPhoto,
        function(message) { },
        {
			quality         : 50,
			targetWidth	 : 300,
			targetHeight	: 300,
			saveToPhotoAlbum: true,
			destinationType : navigator.camera.DestinationType.FILE_URI,
			sourceType      : navigator.camera.PictureSourceType.CAMERA
        }
    );
}
function uploadPhoto(imageURI) {
	
	var options = new FileUploadOptions();
	options.fileKey="file";
	options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
	options.mimeType="image/jpeg";

	var params = {};
	params.value1 = "test";
	params.value2 = "param";

	options.params = params;
	options.chunkedMode = false;

	var ft = new FileTransfer();
	ft.upload(imageURI, encodeURI("http://amway.650h.co.uk/index/default/postImage"), photoUploadedSucessfully, handleAjaxError, options);
}
function photoUploadedSucessfully(r) {
	
	//var code = r.responseCode;
	//var ret = r.response;
	//var bytes = r.bytesSent;
	//alert(code+':'+ret+':'+bytes);
	
	// Parse the JSON text into a JSON object so we can use it
	jsonRet = $.parseJSON(r.response);
	
	// Show a preview of the image
	$('#previewImage').show();
	$('#previewImageRemove').show();
	jQuery("#previewImage").attr('src',jsonRet.imgSrc);
	
	// Hide the upload buttons
	$('#postBox').hide();
	
	// Set the hidden field of the imageId
	window.localStorage.setItem("imageId", jsonRet.imgId);
}
function removeImage() {
	$('#postBox').show();
	$('#previewImage').hide();
	$('#previewImageRemove').hide();
}



/** --------------------------------------------------------------------------------
	HELPER FUNCTIONS.
    -------------------------------------------------------------------------------- */

// Hide everything on the first screen or when logging out
function hideNavigation() {
	$('#header').hide();
	$('#footer').hide();
}

// Show navigation
function showNavigation() {
	$('#header').show();
	$('#footer').show();
}

// Hide the back button
function hideBackButton() {
	$(".backButton").hide();
}

// Show the back button
function showBackButton() {
	$(".backButton").show();
	$("a.backButton").attr('href','#:back');
}

// Ensure that the back button goes to the wall
function showBackButtonAndChangeDestinationToWall() {
	showBackButton();
	$("a.backButton").attr('href','#tabstrip-wall');
}

// Hide the add post button
function hideAddPostButton() {
	$(".addPostButton").hide();
}

// Show the add post button
function showAddPostButton() {
	$(".addPostButton").show();
}

// Hide the delete post button
function hideDeletePostButton() {
	$(".deletePostButton").hide();
}

// Show the delete post button
function showDeletePostButton() {
	$(".deletePostButton").show();
}

// Hide both the delete post and back buttons (used by delete post only)
function hideAndResetBackButtonAndDeletePostButton() {
	$("a.backButton").attr('href','#:back');
	hideBackButton();
	hideDeletePostButton();
	
	// Also clear out the post data
	$('#originalPost').html("&nbsp;");
	$('#commentList').html("&nbsp;");
}

// Show full image (and associated close button)
function showFullImage() {
	$('#postDetail').hide();
	$('#fullImage').show();
	$('#fullImageClose').show();
	hideBackButton();
}

// Hide full image (and associated close button)
function hideFullImage() {
	$('#fullImage').hide();
	$('#fullImageClose').hide();
	$('#postDetail').show();
	showBackButton();
}

// Navigate to the wallpost after creation.
function navigateToWall() {
	app.application.navigate("#tabstrip-wall");
}

// Navigate to a specific post.
function navigateToPost() {
	app.application.navigate("#tabstrip-viewPost");
}

// New line to break
function nl2br(str) {   
    var breakTag = '<br />';    
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
}

// Handle error in AJAX
function handleAjaxError() {
	app.application.hideLoading();
	navigator.notification.alert('Sorry, a connection problem occured resulting in your request failing, please try again.', function () { }, 'Network failure', 'OK');
}

