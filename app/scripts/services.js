define(['angular','./util', './dataHelper', './gridHelper', '../constant'], function(angular, util, dataHelper, gridHelper, constant) {

	var appId = constant.appId;

	return angular.module(appId + '.services', [])
	.factory(appId + '.dataHelper', dataHelper)
	.factory(appId + '.gridHelper', gridHelper);
});