define(['angular', '../../constant','./controllers/adminCtrl'],function(angular, constant, adminCtrl){


	var moduleName = constant.appId + '.admin';

	_log_.d('add component in module: ' + moduleName);

    return angular.module(moduleName)
    .controller(moduleName+'Ctrl', adminCtrl);
});