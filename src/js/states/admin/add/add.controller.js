(function ( module ) {
	'use strict';

	module
		.controller( 'AddProfileController', function ( $log, $scope, $state, profile, ministry, Profile ) {
			$scope.$state = $state;
			$scope.requiredFields = [
				'cas_username',
				'last_name',
				'first_name',
				'gender',
				'birth_date',
				'marital_status',
				'language',
				'is_secure',
				'mcc',
				'staff_status',
				'funding_source',
				'employment_country',
				'ministry_location_country',
				'date_joined_staff',
				'role',
				'scope'
			];
			$scope.profile = angular.copy( profile );

			$scope.resetForm = function () {
				$scope.profile = angular.copy( profile );
			};

			$scope.saveProfile = function () {
				Profile.create( {ministry_id: ministry.ministry_id}, $scope.profile, function ( result ) {
					$state.go( 'admin.edit', {person_ID: result.person_id}, {reload: true} );
				}, function () {
					$log.error( 'Error Saving Profile' );
				} );
			};

			$scope.$on( '$stateChangeStart', function ( event, toState, toParams, fromState, fromParams ) {
				if ( $scope.profileForm.$dirty ) {
					event.preventDefault();
					$modal.open( {
						templateUrl: 'js/states/admin/unsaved.modal.html',
						controller:  function ( $scope, $modalInstance ) {
							$scope.save = function () {
								$modalInstance.close();
							};

							$scope.cancel = function () {
								$modalInstance.dismiss( 'discard' );
							};
						}
					} ).result.then( function () {
						}, function ( action ) {
							if ( action === 'discard' ) {
								$scope.profileForm.$setPristine();
								$state.transitionTo( toState, toParams );
							}
						} );
				}
			} );

		} );

})( angular.module( 'globalProfile.states.admin.add' ) );