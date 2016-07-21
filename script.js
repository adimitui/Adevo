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
		templateUrl: "templates/redirect.html",
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

	$routeProvider.when("/browse", {
		controller: "BrowseRedirectCtrl",
		templateUrl: "templates/redirect.html",
		resolve: {
			"currentAuth": function($firebaseAuth) {
				return $firebaseAuth().$requireSignIn();
			}
		}
	})

	$routeProvider.when("/browse/advertisements", {
		controller: "BrowseAdvertisementsCtrl",
		templateUrl: "templates/browse-advertisements.html",
		resolve: {
			"currentAuth": function($firebaseAuth) {
				return $firebaseAuth().$requireSignIn();
			}
		}
	})

	$routeProvider.when("/proposals", {
		controller: "ProposalRedirectCtrl",
		templateUrl: "templates/redirect.html",
		resolve: {
			"currentAuth": function($firebaseAuth) {
				return $firebaseAuth().$requireSignIn();
			}
		}
	})

	$routeProvider.when("/proposals/developer/:developerUID", {
		controller: "ProposalDeveloperCtrl",
		templateUrl: "templates/proposal-developer.html",
		resolve: {
			"currentAuth": function($firebaseAuth) {
				return $firebaseAuth().$requireSignIn();
			}
		}
	})

	$routeProvider.when("/proposals/advertiser/:advertiserUID", {
		controller: "ProposalAdvertiserCtrl",
		templateUrl: "templates/proposal-advertiser.html",
		resolve: {
			"currentAuth": function($firebaseAuth) {
				return $firebaseAuth().$requireSignIn();
			}
		}
	})

	$routeProvider.otherwise("/");
})

app.controller("HeaderCtrl", function($scope, $window, $firebaseAuth, $firebaseObject) {
	$scope.goToProposals = function() {
		$window.location.href = "#/proposals";
	}

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
			var userRef = firebase.database().ref().child("users").child($scope.currentUser.uid);
			$scope.currentUserData = $firebaseObject(userRef);

			var advertisementRef = firebase.database().ref().child("advertisements").child($scope.currentUser.uid);
			$scope.advertisements = $firebaseArray(advertisementRef);
			$scope.advertisements.$add({
				advertiser_id: $scope.currentUser.uid,
				company_name: $scope.currentUserData.company_name,
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

app.controller("BrowseRedirectCtrl", function($scope, $firebaseAuth, $firebaseObject, $window) {
	$scope.authObj = $firebaseAuth();
	$scope.currentUser = $scope.authObj.$getAuth();
	var ref = firebase.database().ref().child("users").child($scope.currentUser.uid);
	$scope.currentUserData = $firebaseObject(ref);
	$scope.currentUserData.$loaded().then(function() {
		if ($scope.currentUserData.account_type === "Advertiser") {
			$scope.advertiserUID = $scope.currentUser.uid;
			$window.location.href = "#/browse/applications";
		} else if ($scope.currentUserData.account_type === "Developer") {
			$scope.developerUID = $scope.currentUser.uid;
			$window.location.href = "#/browse/advertisements";
		} else {
			$window.location.href = "#/signup";
		}
	})
});

app.controller("BrowseAdvertisementsCtrl", function($scope, $firebaseArray, $firebaseObject, $firebaseAuth, $window) {
	$scope.showProposalBox = false;

	var advertiserRef = firebase.database().ref().child("advertisements");
	$scope.advertisers = $firebaseArray(advertiserRef);
	$scope.advertisements = [];
	$scope.advertisers.$loaded().then(function() {
		angular.forEach($scope.advertisers, function(val, key) {
			angular.forEach(val, function(val2, key2) {
				if (key2 !== "$id" && key2 !== "$priority") {
					$scope.advertisements.push(val2);
				}
			})
		});
	});

	$scope.draftProposal = function(index) {
		console.log("Drafting proposal");
		$scope.showLightbox = true;
		console.log("Drafted proposal");
		$scope.proposalCampaign = $scope.advertisements[index];
	};

	$scope.createProposal = function() {
		console.log($scope.proposalCampaign);

		$scope.authObj = $firebaseAuth();
		$scope.currentUser = $scope.authObj.$getAuth();
		var file = document.getElementById("getFile").files[0];
		r = new FileReader();
		console.log(file);
		r.onloadend = function(event) {
			var data = event.target.result;
		}
		r.readAsBinaryString(file);
		var storageRef = firebase.storage().ref("proposals/" + $scope.currentUser.uid + "/" + file.name);
		var uploadTask = storageRef.put(file);
		uploadTask.on("state_changed", function(snapshot) {

		}, function(error) {

		}, function() {
			var userRef = firebase.database().ref().child("users").child($scope.currentUser.uid);
			$scope.currentUserData = $firebaseObject(userRef);

			var downloadURL = uploadTask.snapshot.downloadURL;

			var ref = firebase.database().ref().child("proposals").child($scope.proposalCampaign.advertiser_id);
			$scope.proposals = $firebaseArray(ref);
			$scope.proposals.$loaded().then(function() {
				$scope.proposals.$add({
					app_name: $scope.appName,
					developer_name: $scope.currentUserData.first_name + " " + $scope.currentUserData.last_name,
					developer_company: $scope.currentUserData.company_name,
					app_description: $scope.appDescription,
					creator_id: $scope.currentUser.uid,
					image: downloadURL,
					status: "pending"
				});
				$scope.proposals.$save();
			});

			ref = firebase.database().ref().child("proposalHistory").child($scope.currentUser.uid);
			$scope.proposalHistory = $firebaseArray(ref);
			$scope.proposalHistory.$loaded().then(function() {
				$scope.proposalHistory.$add({
					campaign_name: $scope.proposalCampaign.campaign_name,
					advertiser_company: $scope.proposalCampaign.company_name,
					app_description: $scope.appDescription,
					recipient_id: $scope.proposalCampaign.advertiser_id,
					image: downloadURL,
					status: "pending"
				});
				$scope.proposalHistory.$save();
			})

			console.log("Proposal request sent");
			$scope.showLightbox = false;
		});
	};
});

app.controller("ProposalRedirectCtrl", function($scope, $firebaseAuth, $firebaseObject, $window) {
	$scope.authObj = $firebaseAuth();
	$scope.currentUser = $scope.authObj.$getAuth();
	var ref = firebase.database().ref().child("users").child($scope.currentUser.uid);
	$scope.currentUserData = $firebaseObject(ref);
	$scope.currentUserData.$loaded().then(function() {
		console.log($scope.currentUserData.account_type);
		if ($scope.currentUserData.account_type === "Advertiser") {
			$scope.advertiserUID = $scope.currentUser.uid;
			$window.location.href = "#/proposals/advertiser/" + $scope.advertiserUID;
		} else if ($scope.currentUserData.account_type === "Developer") {
			$scope.developerUID = $scope.currentUser.uid;
			$window.location.href = "#/proposals/developer/" + $scope.developerUID;
		} else {
			$window.location.href = "#/signup";
		}
	})
});

app.controller("ProposalDeveloperCtrl", function($scope, $routeParams, $firebaseObject, $firebaseArray, $window) {
	var proposalRef = firebase.database().ref().child("proposalHistory").child($routeParams.developerUID);
	$scope.proposals = $firebaseArray(proposalRef);
	$scope.proposals.$loaded().then(function() {
		for (var i = 0; i < $scope.proposals.length; i++) {
			console.log($scope.proposals[i].status);
			if ($scope.proposals[i].status === "pending") {
				document.getElementById("in-progress").style.backgroundColor = "#429DE8";
				console.log($scope.getElementById("in-progress"));
				console.log("Styled");
			} else if ($scope.proposals[i].status === "approved") {
				document.getElementById("approved").style.backgroundColor = "#429DE8";
			} else if ($scope.proposals[i].status === "declined") {
				document.getElementById("declined").style.backgroundColor = "#429DE8";
			}
		}
	});
});

app.controller("ProposalAdvertiserCtrl", function($scope, $routeParams, $firebaseObject, $firebaseArray, $window) {
	var proposalRef = firebase.database().ref().child("proposals").child($routeParams.advertiserUID);
	$scope.proposals = $firebaseArray(proposalRef);
	$scope.proposals.$loaded().then(function() {
		console.log($scope.proposals[0]);
		console.log(document.getElementById("notification"));
		for (var i = 0; i < $scope.proposals.length; i++) {
			console.log($scope.proposals[i].status);
			if ($scope.proposals[i].status === "pending") {
				document.getElementById("in-progress").style.backgroundColor = "#429DE8";
				console.log($scope.getElementById("in-progress"));
				console.log("Styled");
			} else if ($scope.proposals[i].status === "approved") {
				document.getElementById("approved").style.backgroundColor = "#429DE8";
			} else if ($scope.proposals[i].status === "declined") {
				document.getElementById("declined").style.backgroundColor = "#429DE8";
			}
		}
	});

	$scope.approveProposal = function(index) {
		var ref = firebase.database().ref().child("proposals").child($routeParams.advertiserUID).child($scope.proposals[index].$id);
		ref.update({
			status: "approved"
		});
		var object = $firebaseObject(ref);
		object.$loaded().then(function() {
			console.log(object.creator_id);
			var tempRef = firebase.database().ref().child("proposalHistory").child(object.creator_id);
			$scope.tempArray = $firebaseArray(tempRef);
			$scope.tempArray.$loaded().then(function() {
				ref = firebase.database().ref().child("proposalHistory").child(object.creator_id).child($scope.tempArray[index].$id);
				ref.update({
					status: "approved"
				})
			});
		})
	};

	$scope.declineProposal = function(index) {
		var ref = firebase.database().ref().child("proposals").child($routeParams.advertiserUID).child($scope.proposals[index].$id);
		ref.update({
			status: "declined"
		});
		var object = $firebaseObject(ref);
		object.$loaded().then(function() {
			var tempRef = firebase.database().ref().child("proposalHistory").child(object.creator_id);
			$scope.tempArray = $firebaseArray(tempRef);
			$scope.tempArray.$loaded().then(function() {
				ref = firebase.database().ref().child("proposalHistory").child(object.creator_id).child($scope.tempArray[index].$id);
				ref.update({
					status: "declined"
				})
			});
		})	
	}
});