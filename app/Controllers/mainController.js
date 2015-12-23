angular.module('toDoApp')

.controller('mainController', mainController);

mainController.$inject = ['$scope', '$rootScope', '$location', '$http', 'Session', ''];

function mainController($scope, $rootScope, $location, $http)
{
	var itemID = 1;
	var tabId = 1;
	$scope.title = "TO DO";
	$scope.importance = 1;
	$scope.importanceColors = ["#89C1F1", "#FFFF64", "#DA5353"];
	$scope.tabs = [];
	$scope.items = [];
	$scope.currentTab = 0;

	$scope.onClickTab = function (tab) {
        $scope.currentTab = tab.id;
    }
    
    $scope.isActiveTab = function(tabId) {
        return tabId == $scope.currentTab;
    }

	$scope.addItem = function(itemText){
		var addItemData = {tabId: $scope.currentTab, text:itemText, importance:parseInt($scope.importance), date:Date.now(), action:'addItem'};
		$http({
			method: 'POST',
			url:'app/PHP/dataRetriever.php',
			data: addItemData
		})
		.then(function(res){
			if(res.data.message == "Success"){
				$scope.items.push({id:res.data.itemID, tabId: $scope.currentTab, text:itemText, importance:parseInt($scope.importance), date:Date.now()});
				itemID++;
				$scope.newItemText = "";
			}
			else{
				Flash.create('danger', 'Failed to create new tab', 'custom-class');
			}			
		});
	};

	$scope.addTab = function(){		
		var addTabData = {title:"New Tab", action:'addTab'};
		$http({
			method: 'POST',
			url:'app/PHP/dataRetriever.php',
			data: addTabData
		})
		.then(function(res){
			if(res.data.message == "Success"){
				$scope.tabs.push({id:res.data.tabId, title:"New Tab"});
				tabId++;
			}
			else{
				Flash.create('danger', 'Failed to create new tab', 'custom-class');
			}			
		});
	};

	$scope.deleteItem = function(itemID){
		var delItemData = {id:itemId, action:'delItem'};
		$http({
			method: 'POST',
			url:'app/PHP/dataRetriever.php',
			data: delItemData
		})
		.then(function(res){
			if(res.data.message == "Success"){
				var index = indexOfItem(itemID);
				if(index != -1){
		  			$scope.items.splice(index, 1);
		  		}
			}
			else{
				Flash.create('danger', 'Failed to delete item', 'custom-class');
			}			
		});
		
	};

	$scope.deleteTab = function(tabId){
		var delTabData = {id:tabId, action:'delTab'};
		$http({
			method: 'POST',
			url:'app/PHP/dataRetriever.php',
			data: delTabData
		})
		.then(function(res){
			if(res.data.message == "Success"){
				var index = indexOfTab(tabId);
				if(index != -1){
		  			$scope.tabs.splice(index, 1);
		  		}
			}
			else{
				Flash.create('danger', 'Failed to delete tab', 'custom-class');
			}			
		});
		
	};

	$scope.loseFocus = function(event, object){
		if(event.which == 13){	
			var changeData;
			if(object.itemId){
				changeData = {itemId:object.itemId, itemText:object.text, action:'editItem'};
				$http({
				method: 'POST',
				url:'app/PHP/dataRetriever.php',
				data: changeData
			})
			.then(function(res){
				if(res.data.message == "Success"){
					event.srcElement.blur();
				}
				else{
					Flash.create('danger', 'Failed to delete tab', 'custom-class');
				}			
			});	
			}
			else{
				changeData = {tabId:object.tabId, tabText:object.title, action:'editTab'};
				$http({
					method: 'POST',
					url:'app/PHP/dataRetriever.php',
					data: changeData
				})
				.then(function(res){
					if(res.data.message == "Success"){
						event.srcElement.blur();
					}
					else{
						Flash.create('danger', 'Failed to delete tab', 'custom-class');
					}			
				});	
			}
		}			
	};

	function indexOfItem(itemID){
		var index = -1;
		var length = $scope.items.length;
		for(var i = 0; i < length; i++) {
		    if ($scope.$storage.items[i].id == itemID) {
		        return i;
		    }
		}
	}

	function indexOfTab(tabId){
		var index = -1;
		var length = $scope.tabs.length;
		for(var i = 0; i < length; i++) {
		    if ($scope.tabs[i].id == tabId) {
		        return i;
		    }
		}
	}

	NotifyingService.subscribe($scope, function changed(){
		Session.
	});
}