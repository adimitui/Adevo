var app = angular.module("adevoApp", ["ngRoute", "firebase"]);

app.run(["$rootScope", "$location", function($rootScope, $location) {
	$rootScope.$on("$routeChangeError", function(event, next, previous, error) {
		if (error === "AUTH_REQUIRED") {
			$location.path("/signup");
		}
	});
}]);

app.config(function($routeProvider) {
	$routeProvider.when("/", {
		controller: "SegmentCtrl",
		templateUrl: "templates/segment.html"
	})

	$routeProvider.when("/signup", {
		controller: "SignupCtrl",
		templateUrl: "templates/signup.html"
	})

	$routeProvider.when("/upload/advertiser", {
		controller: "UploadAdvertiserCtrl",
		templateUrl: "templates/upload-advertiser.html",
		resolve: {
			"currentAuth": function($firebaseAuth) {
				return $firebaseAuth().$requireSignIn();
			}
		}
	})

	$routeProvider.when("/upload/developer", {
		controller: "UploadDeveloperCtrl",
		templateUrl: "templates/upload-developer.html",
		resolve: {
			"currentAuth": function($firebaseAuth) {
				return $firebaseAuth().$requireSignIn();
			}
		}
	})

	$routeProvider.when("/profile", {
		controller: "ProfileRedirectCtrl",
		templateUrl: "templates/profile-redirect.html",
		resolve: {
			"currentAuth": function($firebaseAuth) {
				return $firebaseAuth().$requireSignIn();
			}
		}
	})

	$routeProvider.when("/profile/advertiser/:advertiserUID", {
		controller: "ProfileAdvertiserCtrl",
		templateUrl: "templates/profile-advertiser.html",
		resolve: {
			"currentAuth": function($firebaseAuth) {
				return $firebaseAuth().$requireSignIn();
			}
		}
	})

	$routeProvider.when("/profile/developer/:developerUID", {
		controller: "ProfileDeveloperCtrl",
		templateUrl: "templates/profile-developer.html",
		resolve: {
			"currentAuth": function($firebaseAuth) {
				return $firebaseAuth().$requireSignIn();
			}
		}
	})

	$routeProvider.otherwise("/");
})

app.controller("HeaderCtrl", function($scope, $window, $firebaseAuth, $firebaseObject) {
	$scope.goToUpload = function() {
		$scope.authObj = $firebaseAuth();
		$scope.currentUser = $scope.authObj.$getAuth();
		if ($scope.currentUser) {
			var ref = firebase.database().ref().child("users").child($scope.currentUser.uid);
			$scope.currentUserData = $firebaseObject(ref);
			$scope.currentUserData.$loaded().then(function() {
				if ($scope.currentUserData.account_type === "Advertiser") {
					$window.location.href = "#/upload/advertiser";
					console.log("Redirecting to the advertiser's upload page");
				} else if ($scope.currentUserData.account_type === "Developer") {
					$window.location.href = "#/upload/developer";
					console.log("Redirecting to the developer's upload page");
				}
			})
		} else {
			$window.location.href = "#/signup";
		}
	};

	$scope.goToProfile = function() {
		console.log("Profile clicked");
		$scope.authObj = $firebaseAuth();
		$scope.currentUser = $scope.authObj.$getAuth();
		if ($scope.currentUser) {
			var ref = firebase.database().ref().child("users").child($scope.currentUser.uid);
			$scope.currentUserData = $firebaseObject(ref);
			$scope.currentUserData.$loaded().then(function() {
				if ($scope.currentUserData.account_type === "Advertiser") {
					$window.location.href = "#/profile/advertiser";
					console.log("Redirecting to the advertiser's profile page");
				} else if ($scope.currentUserData.account_type === "Developer") {
					$window.location.href = "#/profile/developer";
					console.log("Redirecting to the developer's profile page");
				}
			})
		}
	}

	$scope.showMenu = function() {
		$scope.authObj = $firebaseAuth();
		var userStatus = $scope.authObj.$getAuth();
		if (userStatus) {
			var dropdownContent = document.getElementById("hamburger-dropdown-content-signed-in");
			dropdownContent.classList.toggle("show-hamburger-dropdown");
			if (dropdownContent.classList.contains("show-hamburger-dropdown")) {
				document.getElementById("hamburger-button").style.backgroundColor = "#4D4D4D";
			} else {
				document.getElementById("hamburger-button").style.backgroundColor = "#D6D6D6";
			}
		} else {
			var dropdownContent = document.getElementById("hamburger-dropdown-content-signed-out");
			dropdownContent.classList.toggle("show-hamburger-dropdown");
			if (dropdownContent.classList.contains("show-hamburger-dropdown")) {
				document.getElementById("hamburger-button").style.backgroundColor = "#4D4D4D";
			} else {
				document.getElementById("hamburger-button").style.backgroundColor = "#D6D6D6";
			}
		}
		console.log("Showing hamburger menu");
	};

	$scope.hideDropdown = function() {
		var userStatus = $scope.authObj.$getAuth();
		if (userStatus) {
			var dropdownContent = document.getElementById("hamburger-dropdown-content-signed-in");
			dropdownContent.classList.remove("show-hamburger-dropdown");
			document.getElementById("hamburger-button").style.backgroundColor = "#D6D6D6";
		} else if (!userStatus) {
			var dropdownContent = document.getElementById("hamburger-dropdown-content-signed-out");
			dropdownContent.classList.remove("show-hamburger-dropdown");
			document.getElementById("hamburger-button").style.backgroundColor = "#D6D6D6";
		}
	}

	$scope.signOut = function() {
		$scope.authObj.$signOut();
		$scope.signedIn = false;
		console.log("User signed out");
		$window.location.href = "#/signup";
	};
});

app.controller("SegmentCtrl", function($scope) {

});

app.controller("SignupCtrl", function($scope, $firebaseAuth, $firebaseObject, $window) {
	$scope.authObj = $firebaseAuth();

	$scope.signUp = function() {
		var accountType = document.getElementById("account-type").value;

		$scope.authObj.$createUserWithEmailAndPassword($scope.newEmail, $scope.newPassword).then(function(firebaseUser) {
			var ref = firebase.database().ref().child("users").child(firebaseUser.uid);
			$scope.user = $firebaseObject(ref);
			$scope.user.username = $scope.newUsername;
			$scope.user.first_name = $scope.newFirstName;
			$scope.user.last_name = $scope.newLastName;
			$scope.user.company_name = $scope.newCompanyName;
			$scope.user.email = $scope.newEmail;
			$scope.user.password = $scope.newPassword;
			$scope.user.account_type = accountType;
			$scope.user.$save();
			console.log("User " + firebaseUser.uid + " successfully created!");

			$scope.newUsername = "";
			$scope.newFirstName = "";
			$scope.newLastName = "";
			$scope.newCompanyName = "";
			$scope.newEmail = "";
			$scope.newPassword = "";

			$window.location.href = "#/browse";
		}).catch(function(error) {
			console.log("Error: ", error);
		})
	};

	$scope.logIn = function() {
		$scope.authObj.$signInWithEmailAndPassword($scope.loginEmail, $scope.loginPassword).then(function(firebaseUser) {
			$scope.signedIn = true;
			console.log("Signed in as: " + firebaseUser.uid);
			$window.location.href = "#/browse";
		}).catch(function(error) {
			console.log("Authentication failed: ", error);
		})
	}
});

app.controller("UploadAdvertiserCtrl", function($scope, $firebaseAuth, $firebaseObject, $firebaseArray, $window) {
	$scope.createCampaign = function() {
		$scope.authObj = $firebaseAuth();
		$scope.currentUser = $scope.authObj.$getAuth();
		var file = document.getElementById("file-selector").files[0];
		r = new FileReader();
		console.log(file);
		r.onloadend = function(event) {
			var data = event.target.result;
		}
		r.readAsBinaryString(file);
		var storageRef = firebase.storage().ref("advertisements/" + $scope.currentUser.uid + "/" + file.name);
		var uploadTask = storageRef.put(file);
		uploadTask.on("state_changed", function(snapshot) {

		}, function(error) {

		}, function() {
			var downloadURL = uploadTask.snapshot.downloadURL;

			var advertisementRef = firebase.database().ref().child("advertisements").child($scope.currentUser.uid);
			$scope.advertisements = $firebaseArray(advertisementRef);
			$scope.advertisements.$add({
				campaign_name: $scope.newCampaignName,
				campaign_description: $scope.newCampaignDescription,
				campaign_image: downloadURL,
				target_demographic: $scope.newTargetDemographic
			});

			console.log("Campaign added");
			$window.location.href = "#/profile";
		});
	};

	$scope.uploadCoverPhoto = function() {
		$scope.authObj = $firebaseAuth();
		$scope.currentUser = $scope.authObj.$getAuth();
		var file = document.getElementById("file-selector").files[0];
		r = new FileReader();
		console.log(file);
		r.onloadend = function(event) {
			var data = event.target.result;
		}
		r.readAsBinaryString(file);
		var storageRef = firebase.storage().ref("covers/" + $scope.currentUser.uid + "/" + file.name);
		var uploadTask = storageRef.put(file);
		uploadTask.on("state_changed", function(snapshot) {

		}, function(error) {

		}, function() {
			var downloadURL = uploadTask.snapshot.downloadURL;

			var userRef = firebase.database().ref().child("users").child($scope.currentUser.uid);
			$scope.user = $firebaseObject(userRef);
			$scope.user.cover_photo = downloadURL;
			$scope.user.$save().then(function() {
				document.getElementById("cover-photo-div").style.backgroundImage = "url(downloadURL)";
				console.log("Cover photo uploaded");
				$window.location.href = "#/profile/" + $scope.currentUser.uid;
			});
		});
	}
});

app.controller("UploadDeveloperCtrl", function($scope, $firebaseAuth, $firebaseObject, $firebaseArray, $window) {
	$scope.authObj = $firebaseAuth();
	$scope.currentUser = $scope.authObj.$getAuth();
	$scope.createProfile = function() {
		var file = document.getElementById("file-selector").files[0];
		r = new FileReader();
		console.log(file);
		r.onloadend = function(event) {
			var data = event.target.result;
		}
		r.readAsBinaryString(file);
		var storageRef = firebase.storage().ref("applications/" + $scope.currentUser.uid + "/" + file.name);
		var uploadTask = storageRef.put(file);
		uploadTask.on("state_changed", function(snapshot) {

		}, function(error) {

		}, function() {
			var downloadURL = uploadTask.snapshot.downloadURL;

			var applicationRef = firebase.database().ref().child("applications").child($scope.currentUser.uid);
			$scope.advertisements = $firebaseArray(applicationRef);
			$scope.advertisements.$add({
				application_name: $scope.newAppName,
				application_description: $scope.newAppDescription,
				application_image: downloadURL
			});
		});

		console.log("App profile added.");
		$window.location.href = "#/profile";
	}
});

app.controller("ProfileRedirectCtrl", function($scope, $firebaseAuth, $firebaseObject, $window) {
	$scope.authObj = $firebaseAuth();
	$scope.currentUser = $scope.authObj.$getAuth();
	var ref = firebase.database().ref().child("users").child($scope.currentUser.uid);
	$scope.currentUserData = $firebaseObject(ref);
	$scope.currentUserData.$loaded().then(function() {
		if ($scope.currentUserData.account_type === "Advertiser") {
			$scope.advertiserUID = $scope.currentUser.uid;
			$window.location.href = "#/profile/advertiser/" + $scope.advertiserUID;
		} else if ($scope.currentUserData.account_type === "Developer") {
			$scope.developerUID = $scope.currentUser.uid;
			$window.location.href = "#/profile/developer/" + $scope.developerUID;
		} else {
			$window.location.href = "#/signup";
		}
	})
});

app.controller("ProfileAdvertiserCtrl", function($scope, $firebaseObject, $routeParams, $firebaseArray) {
	var userRef = firebase.database().ref().child("users").child($routeParams.advertiserUID);
	$scope.currentUserData = $firebaseObject(userRef);
	$scope.currentUserData.$loaded().then(function() {
		console.log($scope.currentUserData);
		$scope.companyName = $scope.currentUserData.company_name;
		$scope.fullName = $scope.currentUserData.first_name + " " + $scope.currentUserData.last_name;
	});

	var advertisementRef = firebase.database().ref().child("advertisements").child($routeParams.advertiserUID);
	$scope.advertisements = $firebaseArray(advertisementRef);
	$scope.advertisements.$loaded().then(function() {
		console.log($scope.advertisements[0]);
	});
});

app.controller("ProfileDeveloperCtrl", function($scope, $firebaseObject, $routeParams, $firebaseArray) {
	var userRef = firebase.database().ref().child("users").child($routeParams.developerUID);
	$scope.currentUserData = $firebaseObject(userRef);
	$scope.currentUserData.$loaded().then(function() {
		console.log($scope.currentUserData);
		$scope.companyName = $scope.currentUserData.company_name;
		$scope.fullName = $scope.currentUserData.first_name + " " + $scope.currentUserData.last_name;
		$scope.contactInformation = $scope.currentUserData.email;
	});

	var applicationRef = firebase.database().ref().child("applications").child($routeParams.developerUID);
	$scope.applications = $firebaseArray(applicationRef);
	$scope.applications.$loaded().then(function() {
		console.log($scope.applications[0]);
	});
});