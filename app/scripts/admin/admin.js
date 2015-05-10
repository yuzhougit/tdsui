define(['angular', '../../constant','./controllers/adminCtrl'],function(angular, constant, adminCtrl){

    var moduleName = constant.appId + '.admin';
    return angular.module(moduleName)
    .controller(moduleName+'Ctrl', adminCtrl);
});