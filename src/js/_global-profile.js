(function ( angular ) {
	'use strict';
	angular.module( 'globalProfile', [
		'ui.router',
		'ui.bootstrap',
		'ngResource',
		'globalProfile.controllers',
		'globalProfile.services'
	] );
})( angular );