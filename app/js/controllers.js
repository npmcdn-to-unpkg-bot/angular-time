'use strict';

timeApp.controller('EditGridCtrl', ['$scope', '$cookies', 'loginService', 'toastr', '$location',
	function EditGridCtrl($scope, $cookies, loginService, toastr, $location) {
    $scope.errorHide = function(){
      if($location.path() == '/404')
      {
        return true;
      }
      else
      {
        return false;
      }
    }
  
		$scope.selects = ['Time', 'Interval'];
		$scope.selection = $scope.selects[0]; 
    $scope.user = {
      login: $cookies.get('userLogin')
    }

		$scope.cityList = [{
			name: 'Moscow',
			gmt: 3
		}, {
			name: 'London',
			gmt: 0
		}, {
			name: 'Paris',
			gmt: 1
		}];

    $scope.logout = function(){
      loginService.logout();
    };

		$scope.addCity = function(newCity) {
			if(newCity !== undefined && newCity !== ''){
				$scope.cityList.splice(0, 0, {name: $scope.newCity});
				$scope.newCity = '';
			}
		};

    $scope.checkAuthShow = function(){
      if($cookies.get('token') != undefined){
        return false;
      }
      else
        return true;
    };
	}]);

timeApp.controller('GridCtrl', ['$scope',
	function($scope){
		$scope.remove = function(item){
			var index = $scope.cityList.indexOf(item);
			$scope.cityList.splice(index, 1); 
		};
	}
	]);

timeApp.controller('SignInCtrl', ['$scope', 'loginService', 'toastr',
	function($scope, loginService, toastr){
		$scope.signIn = function(user){
			loginService.login(user);
		};

	}]);

timeApp.controller('SignUpCtrl', ['$scope', 'loginService', 'toastr',
	function($scope, loginService, toastr){
    $scope.signUp = function(user){
      if(user.password == $scope.confirmPassword){
        loginService.signup(user);  
        loginService.login(user);
      }
      else
        $scope.errorMessage = "Passwords doesn't match";
    };
	}]);

timeApp.controller('TimeCtrl', ['$scope', '$stateParams', '$filter', '$timeout',
	function($scope, $stateParams, $filter, $timeout) {
		$scope.clock = "loading clock...";
  	$scope.tickInterval = 1000;

    //hours per day
  	$scope.dayHours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];	

  	// var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  	var monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  	// var weekNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  	var weekNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    $scope.selectedHour;

  	var currentHour, currentMin, currentDay, currentMonth, currentWeekday;	

  	var tick = function () {
   		var d = new Date();
   		var utc = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(),  d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds());
			currentMin = utc.getMinutes();
			currentHour = utc.getHours();
			currentDay = utc.getDate();
			currentMonth = monthNamesShort[utc.getMonth()];
			currentWeekday = weekNamesShort[utc.getDay()];

			$scope.date = currentMonth + ", " + currentWeekday + " " + currentDay; 

    	$timeout(tick, $scope.tickInterval);
  	};

      $scope.selectedHour = currentHour;

    $scope.getHour = function(fHour, city){
      var t = fHour + city.gmt;
      if(fHour === currentHour){
        $scope.varNow = 'now';
      }
      else
        $scope.varNow = ''
      if(t > 23)
      {
        return t - 24;
      }
      else
        return t;
    };

    $scope.setNowArea = function(fHour){
      if(fHour === currentHour){
        $scope.varActive = 'active';
      }
      else
       $scope.varActive = '' ;
    }

    $scope.setSelectedHour = function(fHour){
      $scope.selectedHour = fHour;
    };

  	$scope.funcTime = function(city){
  		var h, m, time;
  		angular.forEach($scope.cityList, function(value, key){
 			if (value.name === city.name){
  				h = currentHour+value.gmt;
  				if(h > 24){
  					h = h - 24;
  				}
  				m = currentMin;		
  			}

  			if(m < 10){
  				m = "0" + currentMin;
  			}

  			if(h < 10){
  				h = "0" + currentHour;
  			}

  			time = h + ":" + m;
  		});
  		if(time.length === 5){
  			return time;
  		}
  		else{
  			return "loading clock...";
  		}
  		
  	};
  	$timeout(tick, [$scope.tickInterval]);
}]);

timeApp.controller('ProfileCtrl', ['$scope', '$stateParams', '$cookies', 'loginService', 'toastr',
  function($scope, $stateParams, $cookies, loginService, toastr){
    $scope.eventProfile = 'Edit';
    $scope.user = {
      id: $cookies.get('userId'),
      login: $cookies.get('userLogin'),
      email: $cookies.get('userEmail'),
      token: $cookies.get('token')
    }

    $scope.deleteAccountFunc = function(){
      console.log($cookies.get('userId'));
      loginService.deleteUser($cookies.get('userId'));
    }

    $scope.editFunc = function(){
      if($scope.eventProfile == 'Edit'){
        $scope.eventProfile = 'Save';
      }
      else
      {
        var promiseGet = loginService.getUser($cookies.get('userId'));
        promiseGet.then(function(msg){
          var serverUserData = msg.data;
          if( $scope.user.login != undefined && $scope.user.email != undefined && $scope.user.password != undefined )
          {
            if ( $scope.user.login != serverUserData.login || $scope.user.email != serverUserData.email || $scope.user.password != serverUserData.password )
            {
              var promisePut = loginService.editUser($scope.user);
              promisePut.success(function(){
                toastr.success('Your information saved.');
                $scope.eventProfile = 'Edit'; 
                $cookies.put('userLogin', $scope.user.login);
                $cookies.put('userEmail', $scope.user.email);
              }).error(function(){
                toastr.error("Сouldn't be saved to the server." );
              });
            }
            else
            {
              toastr.info("Your data isn't changed.");
              $scope.eventProfile = 'Edit'; 
            }
          }
          else
          {
            toastr.error('All parameters are required.');
          }
        });
      }
    };  
  }]);