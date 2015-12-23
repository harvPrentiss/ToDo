angular.module('toDoApp')

.controller('registrationController', registrationController);

registrationController.$inject = ['$scope', '$rootScope', 'AUTH_EVENTS', 'RegService', 'Flash'];

function registrationController($scope, $rootScope, AUTH_EVENTS, RegService, Flash)
{
	$scope.registrationData = {
		userEmail: '',
		userName: '',
		userPassword: '',
		action: 'createUser'
	};

	$scope.register= function(registrationData){
		RegService.register(registrationData).then(function (user){
			if(user != "NULL"){
				$rootScope.$broadcast(AUTH_EVENTS.registrationSuccess);
				$scope.setCurrentUser(user);
				$scope.setLoggedIn(user);
			}
		});
	}
}