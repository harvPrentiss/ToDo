angular.module('toDoApp')

.controller('loginController', loginController);

loginController.$inject = ['$scope', '$rootScope', 'AUTH_EVENTS', 'AuthService', 'NotifyingService'];

function loginController($scope, $rootScope, AUTH_EVENTS, AuthService, NotifyingService)
{
	$scope.credentials = {
		userEmail: '',
		userPassword: '',
		action: 'login'
	};

	$scope.login = function(credentials){
		AuthService.login(credentials).then(function (user){
			if(user != "NULL"){
				$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
				$scope.setCurrentUser(user);
				$scope.setLoggedIn();
				NotifyingService.notify();
			}
		});
	}

}