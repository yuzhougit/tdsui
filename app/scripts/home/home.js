
// Create the controller to sub module

define(['angular', '../../constant','./controllers/homeCtrl'],function(angular, constant, homeCtrl){

	var moduleName = constant.appId + '.home';
	return angular.module(moduleName).controller(moduleName+'Ctrl', homeCtrl);
});