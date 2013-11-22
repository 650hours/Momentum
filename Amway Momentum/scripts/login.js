(function (global) {
    var LoginViewModel,
        app = global.app = global.app || {};

    LoginViewModel = kendo.data.ObservableObject.extend({
        isLoggedIn: false,
        username: "",
		password: "",
		nickname: "",
        userShortId: "",
		
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
		
})(window);