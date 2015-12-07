var app = angular.module('myApp', ['ngStorage']);

app.directive('editInPlace', function(){
	return{
		restrict: 'E',
		scope: {value:'='},
		template: '<span ng-click="edit()" ng-bind="value"></span><textarea class="editArea" ng-model="value"></textarea>',
		link: function($scope, element, attrs){
			var inputElement = angular.element(element.children()[1]);
			element.addClass('edit-in-place');
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

app.controller('mainController', function($scope, $localStorage, $sessionStorage){
	var itemID = 0;
	$scope.title = "TO DO";
	$scope.importance = 1;
	$scope.importanceColors = ["#89C1F1", "#FFFF64", "#DA5353"];
	$scope.$storage = $localStorage;
	if($localStorage.items === undefined){
		$localStorage.items = [];
	}
	else if($scope.$storage.items.length > 0){
		itemID = $scope.$storage.items[$scope.$storage.items.length - 1].id + 1;
	}

	$scope.addItem = function(itemText){
		$scope.$storage.items.push({id:itemID, text:itemText, importance:parseInt($scope.importance), date:Date.now()});
		console.log($scope.$storage.items);
		itemID++;
		$scope.newItemText = "";
	};

	$scope.deleteItem = function(itemID){
		var index = indexOfItem(itemID);
		if(index != -1){
  			$scope.$storage.items.splice(index, 1);
  		}
	};

	function indexOfItem(itemID){
		var index = -1;
		var length = $scope.$storage.items.length;
		for(var i = 0; i < length; i++) {
		    if ($scope.$storage.items[i].id == itemID) {
		        return i;
		    }
		}
	}
});