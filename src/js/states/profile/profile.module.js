(function () {
	'use strict';

	angular
		.module( 'globalProfile.states.profile', [
			'ui.router',
			'globalProfile.states.app',
			'globalProfile.api.globalprofile',
            'globalProfile.components.adminNav'
		] )
		.config( function ( $stateProvider ) {
			$stateProvider
				.state( 'profile', {
					parent:   'app',
					abstract: true,
					url:      '{min_code}',
					resolve:  {
						'ministry': function ( $log, $q, $state, $stateParams, systems ) {
							var deferred = $q.defer();
							// Unknown min_code
							if ( angular.isUndefined( $stateParams.min_code ) || $stateParams.min_code === '' ) {
								$state.transitionTo( 'selectMinistry' );
								deferred.reject();
							}
							else {
								var ministry = _.find( systems, {min_code: $stateParams.min_code} );

								// Ministry is not a valid Global Profile system
								if ( angular.isUndefined( ministry ) ) {
									$state.transitionTo( 'selectMinistry' );
									deferred.reject();
								}
								else {
									deferred.resolve( ministry );
								}
							}
							return deferred.promise;
						},
                        'isLeader': function ( user, ministry ) {
                            return user.superadmin || _.includes( user.admin, ministry.ministry_id );
                        }
					},
					views: {
						'title@app': {
							controller: function ( $scope, ministry ) {
								$scope.ministry = ministry;
							},
							template:   '{{ministry.name}}'
						},
                        'navigation@app': {
                            template: '<admin-nav is-leader="$resolve.isLeader" is-super-admin="$resolve.isSuperAdmin"></admin-nav>'
                        }
					}
				} );
		} );

})();
