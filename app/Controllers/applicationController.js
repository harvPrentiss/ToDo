angular.module('toDoApp')

.controller('applicationController', applicationController);

applicationController.$inject = ['$scope', '$rootScope', '$cookies', 'USER_ROLES', 'AuthService', 'Session'];

function applicationController($scope, $rootScope, $cookies, USER_ROLES, AuthService, Session)
{
	$scope.currentUser = null;
	$scope.currentUserId = null;
	$scope.userRoles = USER_ROLES;
	$scope.isAuthorized = AuthService.isAuthorized;
	$scope.userStatus = "none";
	$scope.loggedIn = false;
	$scope.setCurrentUser = function(user){
		$scope.currentUser = user;		
	};
	$scope.setLogin = function(){
		$scope.userStatus = "login";
	};
	$scope.setRegister = function(){
		$scope.userStatus = "register";
	};
	$scope.setLoggedIn = function(){
		$scope.userStatus = "loggedIn";
		$scope.loggedIn = true;
	};
	$scope.setNone = function(){
		$scope.userStatus = "none";
	};
	$scope.logout = function(){
		$scope.userStatus = "none";
		$scope.loggedIn = false;		
		AuthService.logout();
	};


	if(AuthService.isLoggedIn){
		Session.create($cookies.get('userId'), $cookies.get('userName'),"User")
		$scope.userStatus = "loggedIn";
		$scope.loggedIn = true;
		$scope.currentUser = $cookies.get('userName');
		$scope.currentUserId = $cookies.get('userId');
	}
}