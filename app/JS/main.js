var app = angular.module('toDoApp', ['ngStorage', 'ngCookies', 'flash'], function($httpProvider){
	// Use x-www-form-urlencoded Content-Type
	  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
	 
	  /**
	   * The workhorse; converts an object to x-www-form-urlencoded serialization.
	   * @param {Object} obj
	   * @return {String}
	   */ 
	  var param = function(obj) {
	    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
	      
	    for(name in obj) {
	      value = obj[name];
	        
	      if(value instanceof Array) {
	        for(i=0; i<value.length; ++i) {
	          subValue = value[i];
	          fullSubName = name + '[' + i + ']';
	          innerObj = {};
	          innerObj[fullSubName] = subValue;
	          query += param(innerObj) + '&';
	        }
	      }
	      else if(value instanceof Object) {
	        for(subName in value) {
	          subValue = value[subName];
	          fullSubName = name + '[' + subName + ']';
	          innerObj = {};
	          innerObj[fullSubName] = subValue;
	          query += param(innerObj) + '&';
	        }
	      }
	      else if(value !== undefined && value !== null)
	        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
	    }
	      
	    return query.length ? query.substr(0, query.length - 1) : query;
	  };
	 
	  // Override $http service's default transformRequest
	  $httpProvider.defaults.transformRequest = [function(data) {
	    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
	  }];
});

app.constant('AUTH_EVENTS', {
	loginSuccess: 'auth-login-success',
	loginFailed: 'auth-login-failed',
	sessionTimeout: 'auth-session-timeout',
	notAuthenticated: 'auth-not-authenticated',
	notAuthorized: 'auth-not-authorized',
	registrationSuccess: 'auth-registration-success',
	registrationFailed: 'auth-registration-failed'
});

app.constant('USER_ROLES', {
	all : '*',
	admin: 'admin',
	user: 'user',
	guest: 'guest'
});

app.directive('editInPlaceMulti', function(){
	return{
		restrict: 'E',
		scope: {value:'='},
		template: '<span ng-dblClick="edit()" ng-bind="value"></span><textarea class="editArea" ng-model="value"></textarea>',
		link: function($scope, element, attrs){
			var inputElement = angular.element(element.children()[1]);
			element.addClass('edit-in-place-multi');
			$scope.editing = false;
			$scope.edit = function(){
				$scope.editing = true;
				element.addClass('active');
				inputElement[0].focus();
			};

			inputElement.prop('onblur', function(){
				$scope.editing = false;
				element.removeClass('active');
			});
		}
	};
});

app.directive('editInPlaceSingle', function(){
	return{
		restrict: 'E',
		scope: {value:'='},
		template: '<span ng-dblClick="edit()" ng-bind="value"></span><input type="text" class="editArea" ng-model="value"></input>',
		link: function($scope, element, attrs){
			var inputElement = angular.element(element.children()[1]);
			element.addClass('edit-in-place-single');
			$scope.editing = false;
			$scope.edit = function(){
				$scope.editing = true;
				element.addClass('active');
				inputElement[0].focus();
			};

			inputElement.prop('onblur', function(){
				$scope.editing = false;
				element.removeClass('active');
			});
		}
	};
});

app.factory('AuthService', function($http, $cookies, Session, Flash){
	var authService = {};

	authService.login = function(credentials){
		return $http({
			method: 'POST',
			url:'app/PHP/dataRetriever.php',
			data: credentials
		})
		.then(function(res){
			if(res.data.message == "Success"){
				Session.create(res.data.id, res.data.userName, "User");
				$cookies.put('loggedIn', 'true');
				$cookies.put('userId', res.data.id);
				$cookies.put('userName', res.data.userName);
				return res.data.userName;
			}
			else{
				Flash.create('danger', res.data.message, 'custom-class');
				return "NULL";
			}
		});
	};

	authService.isAuthenticated = function(){
		return !!Session.userId;
	};

	authService.isLoggedIn = function(){
		if($cookies.get('userId')){
			return true;
		}
		else{
			return false;
		}
	}

	authService.logout = function(){
		$cookies.remove('userId');
		$cookies.remove('userName');
		$cookies.remove('loggedIn');
		Session.destroy();
	}

	authService.isAuthorized = function(authorizedRoles){
		if(!angular.isArray(authorizedRoles)){
			authorizedRoles = [authorizedRoles];
		}
		return (authService.isAuthenticated() && authorizedRoles.indexOf(Session.userRole) !== -1);
	};

	return authService;
});

app.factory('RegService', function($http, Session, $cookies){
	var regService = {};

	regService.register = function(userData){
		return $http({
			method: 'POST',
			url:'app/PHP/dataRetriever.php',
			data: userData
		})
		.then(function(res){
			if(res.data.message == "Success"){
				Session.create(res.data.id, res.data.userName, "User");
				$cookies.put('loggedIn', 'true');
				$cookies.put('userId', res.data.id);
				$cookies.put('userName', res.data.userName);
				return res.data.userName;
			}
			else{
				Flash.create('danger', res.data.message, 'custom-class');
				return 'NULL';
			}
		});
	};

	return regService;
});

app.factory('NotifyingService', function($rootScope){
	return {
        subscribe: function(scope, callback) {
            var handler = $rootScope.$on('notifying-service-event', callback);
            scope.$on('$destroy', handler);
        },

        notify: function() {
            $rootScope.$emit('notifying-service-event');
        }
    };
});

app.service('Session', function(){
	this.create = function(userId, userName, userRole){
		this.id = userId + userName;
		this.userId = userId;
		this.userName = userName;
		this.userRole = userRole;
	};
	this.destroy = function(){
		this.id = null;
		this.userId = null;
		this.userId = null;
		this.userRole = null;
	};
	this.get = function(){
		return this;
	}
});

app.run(function($rootScope, $cookies, AuthService, NotifyingService){
	if($cookies.get('userId')){
		$rootScope.loggedIn = true;
	}
	$rootScope.$on('$routeChangeStart', function(){
		if(AuthService.isLoggedIn){
			NotifyingService.notify();
		}
	});
});
