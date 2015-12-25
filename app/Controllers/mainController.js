angular.module('toDoApp')

.controller('mainController', mainController);

mainController.$inject = ['$scope', '$rootScope', '$location', '$http', 'Session', 'AuthService', 'Flash'];

function mainController($scope, $rootScope, $location, $http, Session, AuthService, Flash)
{
	$scope.title = "TO DO";
	$scope.importance = 1;
	$scope.importanceColors = ["#89C1F1", "#FFFF64", "#DA5353"];
	$scope.tabs = [];
	$scope.notes = [];
	$scope.currentTab = 0;

	$scope.onClickTab = function (tab) {
        $scope.currentTab = tab.id;
    }
    
    $scope.isActiveTab = function(tabId) {
        return tabId == $scope.currentTab;
    }

	$scope.addItem = function(itemText){
		var addItemData = {userId:Session.userId, tabId: $scope.currentTab, noteText:itemText, importance:parseInt($scope.importance), date:Date.now(), action:'addNote'};
		$http({
			method: 'POST',
			url:'app/PHP/dataRetriever.php',
			data: addItemData
		})
		.then(function(res){
			if(res.data.message == "Success"){
				$scope.notes.push({id:res.data.noteId, tabId: $scope.currentTab, noteText:itemText, importanceLevel:parseInt(res.data.importanceLevel), date:Date.now()});
				$scope.newItemText = "";
			}
			else{
				Flash.create('danger', 'Failed to create new item', 'custom-class');
			}			
		});
	};

	$scope.addTab = function(){		
		var addTabData = {userId:Session.userId, tabName:"New Tab", action:'addTab'};
		$http({
			method: 'POST',
			url:'app/PHP/dataRetriever.php',
			data: addTabData
		})
		.then(function(res){
			if(res.data.message == "Success"){
				$scope.tabs.push({id:res.data.tabId, tabName:"New Tab"});
			}
			else{
				Flash.create('danger', 'Failed to create new tab', 'custom-class');
			}			
		});
	};

	$scope.deleteItem = function(noteId){
		var delNoteData = {noteId:noteId, action:'delNote'};
		$http({
			method: 'POST',
			url:'app/PHP/dataRetriever.php',
			data: delNoteData
		})
		.then(function(res){
			if(res.data.message == "Success"){
				var index = indexOfNote(noteId);
				if(index != -1){
		  			$scope.notes.splice(index, 1);
		  		}
			}
			else{
				Flash.create('danger', 'Failed to delete item', 'custom-class');
			}			
		});
		
	};

	$scope.deleteTab = function(tabId){
		var delTabData = {tabId:tabId, action:'delTab'};
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
			if(object.tabId){
				changeData = {noteId:object.id, noteText:object.noteText, action:'editNote'};
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
					Flash.create('danger', 'Failed to edit tab', 'custom-class');

				}			
			});	
			}
			else{
				changeData = {tabId:object.id, tabName:object.tabName, action:'editTab'};
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
						Flash.create('danger', 'Failed to edit tab', 'custom-class');
					}			
				});	
			}
		}			
	};

	$scope.getTabs = function(){
		var getTabData = {userId:Session.userId, action:'getTabs'};
		$http({
			method: 'POST',
			url:'app/PHP/dataRetriever.php',
			data: getTabData
		})
		.then(function(res){
			if(res.data.message == "Success"){
				// Load tabs here
				$scope.tabs = res.data.tabs;
			}			
		});
	};

	$scope.getNotes = function(tabId){
		var getNoteData = {userId:Session.userId, action:'getNotes'};
		$http({
			method: 'POST',
			url:'app/PHP/dataRetriever.php',
			data: getNoteData
		})
		.then(function(res){
			if(res.data.message == "Success"){
				// Load notes here
				$scope.notes = res.data.notes;
			}
			else{
				//Flash.create('danger', res.data.message, 'custom-class');
			}			
		});
	};

	function indexOfNote(noteID){
		var index = -1;
		var length = $scope.notes.length;
		for(var i = 0; i < length; i++) {
		    if ($scope.notes[i].id == noteID) {
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

	if(AuthService.isLoggedIn){
		$scope.getTabs();
		$scope.getNotes();
	}
}