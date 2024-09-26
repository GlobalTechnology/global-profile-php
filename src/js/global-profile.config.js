(function ( module ) {
	'use strict';

	module.config( function ( $locationProvider, $qProvider ) {
		$locationProvider.html5Mode( true );
		$qProvider.errorOnUnhandledRejections(false);
	} );

	// Initialize Application Settings
	module.config( function ( SettingsProvider ) {
		SettingsProvider.setConfig( window.globalProfile.config );
	} );

	// Configure Cas Authenticated API service
	module.config( function ( casAuthApiProvider, SettingsProvider ) {
		casAuthApiProvider.configure( {
			requireAccessToken: true,
			cacheAccessToken:   true,
			authenticationApiBaseUrl: SettingsProvider.casAuthApiBaseUrl(),
			ticketUrl: SettingsProvider.ticketUrl()
		} );
	} );

	module.config( function ( $logProvider, SettingsProvider ) {
		$logProvider.debugEnabled( SettingsProvider.isDevelopment() );
	} );

	// Configure Growl
	module.config( function ( growlProvider ) {
		growlProvider.globalPosition( 'top-right' );
		growlProvider.globalDisableCountDown( true );
		growlProvider.globalTimeToLive( {success: 10000, error: -1, warning: -1, info: 10000} );
	} );

	// Register managed API with casAuthApi
	module.run( function ( casAuthApi, Settings ) {
		casAuthApi.addManagedApi( Settings.api.globalProfile() );
	} );

})( angular.module( 'globalProfile' ) );
