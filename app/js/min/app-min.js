"use strict";var timeApp=angular.module("timeApp",["ui.router","ngCookies","toastr"]);timeApp.config(["$stateProvider","$urlRouterProvider",function(t,e){e.otherwise("/main-grid"),t.state("sign-in",{url:"/sign-in",templateUrl:"views/sign-in.html",controller:"SignInCtrl"}).state("sign-up",{url:"/sign-up",templateUrl:"views/sign-up.html",controller:"SignUpCtrl"}).state("main-grid",{url:"/main-grid",templateUrl:"views/main-grid.html",controller:"GridCtrl"}).state("profile",{url:"/profile",templateUrl:"views/profile.html",controller:"ProfileCtrl"}).state("404",{url:"/404",templateUrl:"views/404.html"})}],["toastrConfig",function(t){angular.extend(t,{autoDismiss:!1,containerId:"toast-container",maxOpened:0,newestOnTop:!0,positionClass:"toast-top-center",preventDuplicates:!1,preventOpenDuplicates:!1,target:"body"})}]),timeApp.config(function(t){angular.extend(t,{autoDismiss:!1,containerId:"toast-container",maxOpened:0,newestOnTop:!0,positionClass:"toast-top-center",preventDuplicates:!1,preventOpenDuplicates:!1,target:"body"})}),timeApp.config(function(t){angular.extend(t,{allowHtml:!1,closeButton:!1,closeHtml:"<button>&times;</button>",extendedTimeOut:1e3,iconClasses:{error:"toast-error",info:"toast-info",success:"toast-success",warning:"toast-warning"},messageClass:"toast-message",onHidden:null,onShown:null,onTap:null,progressBar:!1,tapToDismiss:!0,templates:{toast:"directives/toast/toast.html",progressbar:"directives/progressbar/progressbar.html"},timeOut:5e3,titleClass:"toast-title",toastClass:"toast"})}),timeApp.run(function(t,e,n,i){var s=["/profile"],a=["/profile","/sign-in","/sign-up","/main-grid"];t.$on("$stateChangeStart",function(){-1==s.indexOf(e.path())||n.get("token")||e.path("/sign-in"),i.checkStatus().then(function(t){var n=t.data;"ok"!=n.status?angular.forEach(a,function(t){-1!=t.indexOf(e.path())&&e.path("/404")}):"/404"==e.path()&&e.path("/main-grid")},function(){angular.forEach(a,function(t){-1!=t.indexOf(e.path())&&e.path("/404")})})})});