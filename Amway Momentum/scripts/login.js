(function (global) {
    var LoginViewModel,
        app = global.app = global.app || {};

    LoginViewModel = kendo.data.ObservableObject.extend({
        isLoggedIn: false,
        username: "",
		password: "",
		nickname: "",
        userShortId: "",
		
		// This is nothing to do with login - it handles post submssion to the wall!
		onNewPost: function () {
			
			var that = this,
				newpost = that.get('newpost').trim();
	
			if(typeof newpost === undefined) {
                navigator.notification.alert('Please enter a post!', function () { }, 'Post failed', 'OK');
                return;
            }
			
			// Get the imageId if one is set
			var imageId = window.localStorage.getItem("imageId");
			
			// We need the userId to attribute the post to
			var uid = window.localStorage.getItem("userShortId");
			
			$.ajax({
    			url: 'http://amway.650h.co.uk/index/default/newPost/' + uid + '/' + encodeURI(newpost) + '/' + imageId,
				error: function() {
					$("#resultBlock").html('<h2>Sorry, an error ocurred. Please try again.</h2>');	
                },
				cache: false}).done(function(data) {
					$('#postComment').val('');
					window.localStorage.setItem("imageId", 0);
					navigator.notification.alert('Your new post has been created and will immediately show on the wall.', function () { }, 'Sucessful Post', 'OK');
					
					// This 0.5 second delay prevents a click persistence resulting in us ending up on a random wall post...!
					//setTimeout(navigateToWall, 1000);
					navigateToWall();
			    }); 
		},
		
		// This is nothing to do with login - it handles comment submission from an existing comment!
		onPostComment: function () {
			
			var that = this,
				comment = that.get('comment').trim();
			
			if(comment === '') {
                navigator.notification.alert('Please enter a comment!', function () { }, 'Comment failed', 'OK');
                return;
            }
			
			// We need the original post and the ID of the user making the comment
			var pid = window.localStorage.getItem("pid");
			var uid = window.localStorage.getItem("userShortId");
			
			$.ajax({
    			url: 'http://amway.650h.co.uk/index/default/postComment/' + pid + '/' + uid + '/' + encodeURI(comment),
				error: function() {
					$("#resultBlock").html('<h2>Sorry, an error ocurred. Please try again.</h2>');	
                },
				cache: false}).done(function(data) {
					window.localStorage.setItem("justPosted", 1);
					navigateToPost();
			    });
		},
		
        onLogin: function () {
			var that = this,
				username = that.get('username').trim(),
				password = that.get('password').trim();

            if (username === '' || password === '') {
                navigator.notification.alert('Both fields are required!', function () { }, 'Missing credentials', 'OK');
                return;
            }

			$.ajax({
    			url: 'http://amway.650h.co.uk/index/default/login/' + username + '/' + password,
				error: function() {
					navigator.notification.alert('Sorry, we could not log you in due to a connection issue. Please try again.', function () { }, 'Network failure', 'OK');	
                },
				cache: false}).done(function(data) {
					
					if(data.result == 1) {
						that.set('isLoggedIn', true);
						that.set('nickname', data.nickname);
						that.set('userShortId', data.userShortId);
						window.localStorage.setItem("userShortId", data.userShortId);
						
						// Scroll to the top of the page
						$(".km-scroll-container").css("-webkit-transform", "");
						
						navigateToAgenda();

						//showNavigation();
						//loadAgenda();
					} else {
						navigator.notification.alert('Sorry, that appears to be the incorrect username and password. Please try again.', function () { }, 'Incorrect credentials', 'OK');
                    }
			    });           
        },

        onLogout: function () {
					
            var that = this;
			
            that.clearForm();
            that.set("isLoggedIn", false);
			that.set('nickname', '');
			
			navigateToHome();
        },

        clearForm: function () {
            var that = this;

            that.set("username", "");
            that.set("password", "");
        }

    });

    app.loginService = {
        viewModel: new LoginViewModel()
    };
	
	// Navigate to agenda after logging in.
	function navigateToAgenda() {
		app.application.navigate("#tabstrip-agenda");
		showNavigation();
	}
	
	// Navigate to home after logging out.
	function navigateToHome() {
		app.application.navigate("#tabstrip-home");
		var tabstrip = app.application.view().footer.find(".km-tabstrip").data("kendoMobileTabStrip");
		tabstrip.switchTo("#tabstrip-home");
		hideNavigation();
	}
	
	// Navigate to the wallpost after creation.
	function navigateToWall() {
		app.application.navigate("#tabstrip-wall");
	}
	
	// Navigate to a specific post.
	function navigateToPost() {
		app.application.navigate("#tabstrip-viewPost");
    }
	
})(window);