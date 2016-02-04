'use strict';

/* Services */

timeApp.factory('loginService', function($http, $location, $cookies, toastr) {
  return{
      checkStatus: function(){
        return $http.get('http://s.q-man.ru:3000/');
      },
  		login: function(user){
  			$http.post('http://s.q-man.ru:3000/user/login', user).then(function(msg)
        {
  				var uid = msg.data;
          if(uid){
            $cookies.put('token', uid.token);
            $cookies.put('userId', uid.user.id);
            $cookies.put('userLogin', uid.user.login);
            $cookies.put('userEmail', uid.user.email);
            $location.path('/main-grid');
            toastr.success('Hello '+ uid.user.login);
          }
          else{
            toastr.alert('Error of login');
          }
  			});
  		},
      signup: function(user){
        $http.post('http://s.q-man.ru:3000/user', user).then(function(msg)
        {
          var uid = msg.data; 
          if(uid){
            $http.post('http://s.q-man.ru:3000/user/login', user).then(function(msg){
              var data = msg.data;
              if(data){
                $cookies.put('token', data.token);
                $cookies.put('userId', data.user.id);
                $cookies.put('userLogin', data.user.login);
                $cookies.put('userEmail', data.user.email);
                $location.path('/main-grid');
                toastr.success('Thanks for your join. Welcome in Worldtime');
              }
            })
          }
          else{
            toastr.alert('Error of registration');
          }
        });
      },
      logout: function(){
        var cookies = $cookies.getAll();
        angular.forEach(cookies, function (v, k) {
            $cookies.remove(k);
        });
        $location.path('/main-grid');
        toastr.success('Logout complete!');
      },
      deleteUser: function(id){
        var $promise =  $http.delete('http://s.q-man.ru:3000/user/' + id);
        var cookies = $cookies.getAll();
        angular.forEach(cookies, function (v, k) {
            $cookies.remove(k);
        });
        $location.path('/main-grid');
        toastr.success('User was delete');
      },
      getUser: function(id){
        return $http.get('http://s.q-man.ru:3000/user/' + id);
      },
      editUser: function(user){
        return $http.put('http://s.q-man.ru:3000/user/' + user.id, {
          'login': user.login,
          'email': user.email,
          'password': user.password
        });
      }
  }
});
