function hideNavigation() {
	$('#footerNavigation').hide();
}

// Load the agenda
function loadAgenda() {

	$.ajax({
	url: 'http://amway.650h.co.uk/index/default/getAgenda',
	error: function() {
		$("#resultBlock").html('Sorry, a connection problem occured, please try again.');	
    },
	cache: false}).done(function(data) {
		
		// Put content in place on the page
		$("#agendaTitle").html(data.agendaTitle);
		$("#agendaWelcome").html(data.agendaText);
	})
}


// Load hospitality desk
function loadHospitality() {
	
	$.ajax({
	url: 'http://amway.650h.co.uk/index/default/getHospitality',
	error: function() {
		$("#resultBlock").html('Sorry, a connection problem occured, please try again.');	
    },
	cache: false}).done(function(data) {
		
		// Build visit text
		var visitText = data.visitText + '<p><center><a href="javascript:window.open(encodeURI(\'https://en.wikipedia.org/wiki/Taj_mahal\'), \'_blank\', \'location=yes\');"><button class="topcoat-button--large" style="background-color: lime">Wikipedia page</button></a></center></p>';
		
		// Build trip advisor text
		var tripadvisorText = data.tripadvisorText + '<p><center><a href="javascript:window.open(encodeURI(\'http://cityguides.tripadvisor.com/\'), \'_blank\', \'location=yes\');"><button class="topcoat-button--large" style="background-color: lime">TripAdvisor New Delhi</button></a></center></p>';
		
		// Put content in place on the page
		$("#introTitle").html(data.introTitle);
		$("#introText").html(data.introText);
		$("#visitTitle").html(data.visitTitle);
		$("#visitText").html(visitText);
		$("#tripadvisorTitle").html(data.tripadvisorTitle);
		$("#tripadvisorText").html(tripadvisorText);
	})
}


// Load workshop list
function loadWorkshopList() {
	
	var userWorkshopList = '';
	var otherWorkshopList = '<ul class="topcoat-list__container">';

	$.ajax({
	url: 'http://amway.650h.co.uk/index/default/getWorkshopsList',
	error: function() {
		$("#resultBlock").html('Sorry, a connection problem occured, please try again.');	
    },
	cache: false}).done(function(data) {
		
		// Build the lists of user attended workshops and other workshops
		$.each(data, function(i,item) {
			if(item.userIsAttending == 1) {
				userWorkshopList = userWorkshopList + '<a href="#tabstrip-workshop?wid='+item.workshopId+'"><li class="topcoat-list__item">' + item.workshopTitle + '</li></a>';
			} else {
				otherWorkshopList = otherWorkshopList + '<a href="#tabstrip-workshop?wid='+item.workshopId+'"><li class="topcoat-list__item">' + item.workshopTitle + '</li></a>';
            }
		})
		
		otherWorkshopList = otherWorkshopList + '</ul>';
		
		// Put content in place on the page
		$("#userWorkshopList").html(userWorkshopList);
		$("#otherWorkshopList").html(otherWorkshopList);
	});
}


// Load an individual workshop
function loadWorkshop(e) {
	
	var workshopId = e.view.params.wid;	
	var topicList = resourceList = '';

	$.ajax({
	url: 'http://amway.650h.co.uk/index/default/getWorkshop/' + workshopId,
	error: function() {
		$("#resultBlock").html('Sorry, a connection problem occured, please try again.');	
    },
	cache: false}).done(function(data) {
		
		jQuery('#header').hide();
				
		// Topics for this workshop
		if(data.topics.length > 0) {
			$.each(data.topics, function(i,item) {
				topicList = topicList + '<a href="#tabstrip-topic?tid='+item.topicId+'"><li class="topcoat-list__item">' + item.topicTitle + '</li></a>';
			})
		} else {
			topicList = '<li class="topcoat-list__item">There are no topics for this workshop</li>';
        }
		
		// Resources for this workshop
		if(data.resources.length > 0) {
			$.each(data.resources, function(i,item) {
				resourceList = resourceList + '<a href="javascript:window.open(encodeURI(\'' + item.resourcePath +'\'), \'_blank\', \'location=yes\');"><li class="topcoat-list__item">' + item.resourceName + ' (' + item.resourceType + ')</li></a>';
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
}

// Load the wall - starts with 10 posts, but supports paging
function loadWall() {

	var wallPosts = '';
	var uid = window.localStorage.getItem("userShortId");
	
	$.ajax({
	url: 'http://amway.650h.co.uk/index/default/getWallposts/' + uid + '/0/10',
	error: function() {
		$("#resultBlock").html('Sorry, a connection problem occured, please try again.');	
    },
	cache: false}).done(function(data) {
		
		// Build the lists of wall posts
		$.each(data, function(i,item) {
			
			var pid = item.wallpostId;
			var ptx = item.postText;
			var nck = item.nickname;
			
			wallPosts = wallPosts + '<div class="wallPost">';
			
			if(item.image != '') {
				wallPosts = wallPosts + '<table><tr>' +
							'<td><img src="http://amway.650h.co.uk/' + item.image + '" width="100px" /></td>' +
							'<td><p><b>' + nck + ':</b> ' + ptx + '</p></td></tr>';
			} else {
				wallPosts = wallPosts + '<table><tr>' +
							'<td colspan="2"><p><strong>' + nck + ':</strong> ' + ptx + '</p></td></tr>';
			}
			
			wallPosts = wallPosts + '<tr><td colspan="2">';
			
			// Like button
			if(item.likedByThisUser) {
				wallPosts = wallPosts + '<span class="likeButton buttonSelected" id="likeButton' + pid + '"><a href="javascript: void(0);">Like</a></span>';
            } else {
				wallPosts = wallPosts + '<span class="likeButton" id="likeButton' + pid + '"><a href="javascript: void(0);" onClick="postLike(' + pid + ',' + uid + ');">Like</a></span>';
			}
			
			// Comment button
			
			wallPosts = wallPosts + '<span class="commentButton"><a href="#tabstrip-comment?pid=' + pid +'">Comment</a></span>' +
							'<span id="currentLikes' + pid + '">' + item.numberLikes + '</span> Likes ' +
							item.numberComments + ' Comments</td></tr></table></div>';
		});
		
		$("#wallPosts").html(wallPosts);
	});
}

function postLike(pid, uid) {
	
	$.ajax({
	url: 'http://amway.650h.co.uk/index/default/postLike/' + pid + '/' + uid,
	error: function() {
		$("#resultBlock").html('Sorry, a connection problem occured, please try again.');	
    },
	cache: false}).done(function(data) {
		
		// Make sure we target the correct like data
		var replaceDiv = '#currentLikes' + pid;
		var likeButton = '#likeButton' + pid;
		
		// Do it!
		$(replaceDiv).html(data.currentLikes);
		$(likeButton).addClass("buttonSelected");
	});
}

// Load a topic
function loadTopic(e) {
	
	var topicId = e.view.params.tid;
	
	$.ajax({
	url: 'http://amway.650h.co.uk/index/default/getTopic/' + topicId,
	error: function() {
		$("#resultBlock").html('Sorry, a connection problem occured, please try again.');	
    },
	cache: false}).done(function(data) {
		
		// Put content in place on the page
		$("#topicTitle").html(data.topicTitle);
		$("#topicDescription").html(data.topicDescription);
	})
}




