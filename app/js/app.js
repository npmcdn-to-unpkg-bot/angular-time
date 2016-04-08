'use strict';

// Declare app level module which depends on views, and components
var timeApp = angular.module('timeApp', [
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
			target: 'body',
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
	}]
);

timeApp.run(function($rootScope, $location, $cookies, loginService, $state){
	var routePermission = ['/profile'];
	$rootScope.$on('$stateChangeStart', function(){
		if( routePermission.indexOf($location.path()) != -1 && !$cookies.get('token') )
		{
			$location.path('/sign-in');
		};

		loginService.checkStatus().then(function(msg){
			var uid = msg.data;
			if ( uid.status != "ok" )
			{
  				$state.go('404');
			}
	  	}, function(){
			$state.go('404');
	  	});
	});
});
