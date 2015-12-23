<?php
	
	/* Functions for the database */
	include_once 'databaseConnector.php';
	//require_once("../config.php");
	$dbConnection;	
	// Checks for a command action being passed to this file
	if(isset($_POST['action']) && !empty($_POST['action'])) {	
	    $action = $_POST['action'];
	    commandRouter($action);
	}
	else{
		echo json_encode("Action Failed");
	}

	// passes control and any needed data to the desired function
	function commandRouter($action){
		switch($action) {
			case 'login' : loginUser(); break;
			case 'createUser': createUser(); break;
			case 'getUser': getUser(); break;			
			case 'deleteUser': deleteUser(); break;
			case 'updateUser': updateUser(); break;
			case 'addTab' : addTab(); break;
			case 'delTab' : delTab(); break;
			case 'editTab' : editTab(); break;
			case 'getTabs' : getTabs(); break;
			case 'addNote' : addNote(); break;
			case 'delNote' : delNote(); break;
			case 'editNote' : editNote(); break;
			case 'getNotes' : getNotes(); break;
			default: break;
		}
	}

	// Creates a DatabaseConnection object
	function getConnection(){
		global $dbConnection;
		$dbConnector = new DatabaseConnector();
		$dbConnection = $dbConnector->connect();
		if($dbConnection == "Failed to connect"){
			return json_encode("Connection to the database has failed");
		}
		else{
			return json_encode("Connection successful");
		}
	}
	// Determines if the dbConnection variable has been set yet 
	function connectionExists(){
		global $dbConnection;
		if($dbConnection == null){
			return false;
		}
		else{
			return true;
		}
	}

	function loginUser(){
		global $dbConnection;
		if(!connectionExists()){
			getConnection();
		}
		$errorObject = array();
		$userEmail = $_POST['userEmail'];
		$stmt = $dbConnection->prepare("SELECT * FROM users WHERE email = '$userEmail'");
		$stmt->execute();
		if($stmt->rowCount() > 0){
			$result = $stmt->fetch(PDO::FETCH_ASSOC);
			if(verifyPassword($_POST['userPassword'], $result['passwordHash'])){
				$userData = array();
				$userData['message'] = "Success";
				$userData['id'] = $result['id'];
				$userData['userName'] = $result['userName'];
				$userData['userEmail'] = $result['email'];
				$userData['dateJoined'] = $result['dateJoined'];
				echo json_encode($userData);
			}
			else{
				$errorObject['message'] = 'Incorrect password';
				echo json_encode($errorObject);
			}
		}
		else{
			$errorObject['message'] = 'Email does not exist';
			echo json_encode($errorObject);
		}
	}


	function createUser(){
		global $dbConnection;
		if(!connectionExists()){
			getConnection();
		}
		$passwordHash = getSecurePassword($_POST['userPassword']);
		$date = date('Y-m-d H:i:s');
		$userEmail = $_POST['userEmail'];
		$userName = $_POST['userName'];
		$stmt = $dbConnection->prepare("INSERT INTO users (email, userName, passwordHash, dateJoined) VALUES ('$userEmail', '$userName', '$passwordHash', '$date')");
		$stmt->execute();
		$userData = array();
		if($stmt == TRUE){		
			$userData['message'] = "Success";	
			$userData['userName'] = $_POST['userName'];
			$userData['id'] = $dbConnection->lastInsertId();			
		}
		else{
			$userData['message'] = 'Unable to create user';
			$userData['userName'] = 'Failure';
			$userData['id'] = -1;
		}
		echo json_encode($userData);
	}

	// Internal functions

	function getSecurePassword($password){
		return password_hash($password, PASSWORD_DEFAULT);
	}

	function verifyPassword($password, $hash){
		return password_verify($password, $hash);
	}

	function addTab(){
		global $dbConnection;
		if(!connectionExists()){
			getConnection();
		}
		$tabTitle = $_POST['tabTitle'];
		$stmt = $dbConnection->prepare("INSERT INTO tabs (tabName) VALUES ('$tabTitle')");
		$stmt->execute();
		$tabData = array();
		if($stmt == TRUE){
			$tabData['tabId'] = $dbConnection->lastInsertId();
			$tabData['message'] = 'Success';
		}
		else{
			$tabData['message'] = 'Failed to create the tab';
		}	
		echo json_encode($tabData);
	}

	function delTab(){
		global $dbConnection;
		if(!connectionExists()){
			getConnection();
		}
		$tabId = $_POST['tabId'];
		$stmt = $dbConnection->prepare("DELETE FROM tabs WHERE tabId='$tabId'");
		$stmt->execute();
		$tabData = array();
		if($stmt == TRUE){
			$tabData['message'] = 'Success';
		}
		else{
			$tabData['message'] = 'Failed to delete the tab';
		}	
		echo json_encode($tabData);		
	}

	function editTab(){
		global $dbConnection;
		if(!connectionExists()){
			getConnection();
		}
		$tabId = $_POST['tabId'];
		$tabTitle = $_POST['tabTitle'];
		$stmt = $dbConnection->prepare("UPDATE tabs (tabTitle) VALUES ('$tabTitle') WHERE tabId='$tabId'");
		$stmt->execute();
		$tabData = array();
		if($stmt == TRUE){
			$tabData['message'] = 'Success';
		}
		else{
			$tabData['message'] = 'Failed to edit the tab';
		}	
		echo json_encode($tabData);
	}

	function getTabs(){
		global $dbConnection;
		if(!connectionExists()){
			getConnection();
		}
		$userId = $_POST['userId'];
		$stmt = $dbConnection->prepare("SELECT * FROM tabs WHERE userId='$userId'");
		$stmt->execute();
		$tabData = array();
		if($stmt->rowCount() > 0){
			$tabData['tabs'] = $stmt->fetchAll();
			$tabData['message'] = 'Success';
		}	
		else{
			$tabData['message'] = 'Failed to get tabs';
		}
		echo json_encode($tabData);
	}

	function addNote(){
		global $dbConnection;
		if(!connectionExists()){
			getConnection();
		}
		$noteTitle = $_POST['noteTitle'];
		$tabId = $_POST['tabId'];
		$importance = $_POST['importance'];
		$stmt = $dbConnection->prepare("INSERT INTO notes (noteText, importanceLevel, tabId) VALUES ('$noteTitle', '$importance' '$tabId')");
		$stmt->execute();
		$noteData = array();
		if($stmt == TRUE){
			$noteData['noteId'] = $dbConnection->lastInsertId();
			$noteData['message'] = 'Success';
		}
		else{
			$noteData['message'] = 'Failed to create the note';
		}	
		echo json_encode($noteData);
	}

	function delNote(){
		global $dbConnection;
		if(!connectionExists()){
			getConnection();
		}	
		$noteId = $_POST['noteId'];
		$stmt = $dbConnection->prepare("DELETE FROM notes WHERE noteId='$noteId'");
		$stmt->execute();
		$noteData = array();
		if($stmt == TRUE){
			$noteData['message'] = 'Success';
		}
		else{
			$noteData['message'] = 'Failed to delete the note';
		}	
		echo json_encode($noteData);	
	}

	function editNote(){
		global $dbConnection;
		if(!connectionExists()){
			getConnection();
		}
		$noteId = $_POST['noteId'];
		$noteTitle = $_POST['noteTitle'];
		$stmt = $dbConnection->prepare("UPDATE notes (noteTitle) VALUES ('$noteTitle') WHERE noteId='$noteId'");
		$stmt->execute();
		$noteData = array();
		if($stmt == TRUE){
			$noteData['message'] = 'Success';
		}
		else{
			$noteData['message'] = 'Failed to edit the note';
		}	
		echo json_encode($noteData);	
	}

	function getNotes(){
		global $dbConnection;
		if(!connectionExists()){
			getConnection();
		}
		$tabId = $_POST['tabId'];
		$stmt = $dbConnection->prepare("SELECT * FROM notes WHERE tabId='$tabId'");
		$stmt->execute();
		$noteData = array();
		if($stmt->rowCount() > 0){
			$noteData['notes'] = $stmt->fetchAll();
			$noteData['message'] = 'Success';
		}	
		else{
			$noteData['message'] = 'Failed to get notes';
		}
		echo json_encode($noteData);
	}
	

?>