'use strict';

// Declare app level module which depends on views, and components
var timeApp = angular.module('timeApp', [
  // 'ngRoute',
  'ui.router',
  'ngCookies',
  'toastr'
]);

timeApp.config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise("/main-grid");

	   $stateProvider
	   	.state('sign-in',{
	   		url: '/sign-in',
	   		templateUrl: 'views/sign-in.html',
	   		controller: 'SignInCtrl'
	   	})
	   	.state('sign-up',{
	   		url: '/sign-up',
	   		templateUrl: 'views/sign-up.html',
	   		controller: 'SignUpCtrl'
	   	})
	   	.state('main-grid',{
	   		url: '/main-grid',
	   		templateUrl: 'views/main-grid.html',
	   		controller: 'GridCtrl' 
	   	})
	   	.state('profile',{
	   		url: '/profile',
	   		templateUrl: 'views/profile.html',
	   		controller: 'ProfileCtrl'
	   	})
	   	.state('404', {
	   		url: '/404',
	   		templateUrl: 'views/404.html'
	   	})
}], ['toastrConfig', 
	function(toastrConfig) {
	  angular.extend(toastrConfig, {
	    autoDismiss: false,
	    containerId: 'toast-container',
	    maxOpened: 0,    
	    newestOnTop: true,
	    positionClass: 'toast-top-center',
	    preventDuplicates: false,
	    preventOpenDuplicates: false,
	    target: 'body'
	  });
	}]
);

// Start of Toastr config 

timeApp.config(function(toastrConfig) {
  angular.extend(toastrConfig, {
    autoDismiss: false,
    containerId: 'toast-container',
    maxOpened: 0,    
    newestOnTop: true,
    positionClass: 'toast-top-center',
    preventDuplicates: false,
    preventOpenDuplicates: false,
    target: 'body'
  });
});

timeApp.config(function(toastrConfig) {
  angular.extend(toastrConfig, {
    allowHtml: false,
    closeButton: false,
    closeHtml: '<button>&times;</button>',
    extendedTimeOut: 1000,
    iconClasses: {
      error: 'toast-error',
      info: 'toast-info',
      success: 'toast-success',
      warning: 'toast-warning'
    },  
    messageClass: 'toast-message',
    onHidden: null,
    onShown: null,
    onTap: null,
    progressBar: false,
    tapToDismiss: true,
    templates: {
      toast: 'directives/toast/toast.html',
      progressbar: 'directives/progressbar/progressbar.html'
    },
    timeOut: 5000,
    titleClass: 'toast-title',
    toastClass: 'toast'
  });
});

// End of Toaster config

timeApp.run(function($rootScope, $location, $cookies, loginService){
	var routePermission = ['/profile'];
	var pages = ['/profile', '/sign-in', '/sign-up', '/main-grid'];
	$rootScope.$on('$stateChangeStart', function(){
		if( routePermission.indexOf($location.path()) != -1 && !$cookies.get('token') )
		{
			$location.path('/sign-in');
		};

		loginService.checkStatus().then(function(msg)
		{    
			var uid = msg.data;
			if ( uid.status != "ok" )
			{
				angular.forEach(pages, function(page){
					if( page.indexOf($location.path()) != -1)
					{
						$location.path('/404');	
					}
				});
			}
			else{
				if($location.path() == '/404')
				{
					$location.path('/main-grid');
				};
			};
		}, 
		function(){
			angular.forEach(pages, function(page){
				if( page.indexOf($location.path()) != -1)
				{
					$location.path('/404');	
				}
			});
		}); 
	});
});
