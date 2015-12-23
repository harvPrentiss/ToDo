angular.module('toDoApp')

.controller('mainController', mainController);

mainController.$inject = ['$scope', '$rootScope', '$localStorage', '$sessionStorage'];

function mainController($scope, $rootScope, $localStorage, $sessionStorage)
{
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
		tabId = $scope.$storage.items[$scope.$storage.items.length - 1].id + 1;
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
		var index = indexOfTab(tabId);
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

	function indexOfTab(tabId){
		var index = -1;
		var length = $scope.$storage.tabs.length;
		for(var i = 0; i < length; i++) {
		    if ($scope.$storage.tabs[i].id == tabId) {
		        return i;
		    }
		}
	}
}