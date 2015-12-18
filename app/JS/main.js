var app = angular.module('myApp', ['ngStorage']);

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

app.controller('mainController', function($scope, $localStorage, $sessionStorage){
	var itemID = 1;
	var tabId = 1;
	$scope.title = "TO DO";
	$scope.importance = 1;
	$scope.importanceColors = ["#89C1F1", "#FFFF64", "#DA5353"];
	$scope.$storage = $localStorage;
	if($localStorage.tabs === undefined){
		$localStorage.tabs = [];
	}
	else if($scope.$storage.tabs.length > 0){
		tabId = $scope.$storage.tabs[$scope.$storage.tabs.length - 1].id + 1;
		$scope.currentTab = $scope.$storage.tabs[0].id;
	}
	if($localStorage.items === undefined){
		$localStorage.items = [];
	}
	else if($scope.$storage.items.length > 0){
		itemID = $scope.$storage.items[$scope.$storage.items.length - 1].id + 1;
	}

	if($scope.$storage.tabs[0]){
		$scope.currentTab = $scope.$storage.tabs[0].id;
	}

    $scope.onClickTab = function (tab) {
        $scope.currentTab = tab.id;
    }
    
    $scope.isActiveTab = function(tabId) {
        return tabId == $scope.currentTab;
    }

	$scope.addItem = function(itemText){
		$scope.$storage.items.push({id:itemID, tabId: $scope.currentTab, text:itemText, importance:parseInt($scope.importance), date:Date.now()});
		itemID++;
		$scope.newItemText = "";
	};

	$scope.addTab = function(){
		$scope.$storage.tabs.push({id:tabId, title:"New Tab " + tabId});
		tabId++;
	};

	$scope.deleteItem = function(itemID){
		var index = indexOfItem(itemID);
		if(index != -1){
  			$scope.$storage.items.splice(index, 1);
  		}
	};

	$scope.deleteTab = function(tabId){
		var index = indexOfItem(itemID);
		if(index != -1){
  			$scope.$storage.tabs.splice(index, 1);
  		}
	};

	$scope.loseFocus = function(event){
		if(event.which == 13){
			event.srcElement.blur();
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