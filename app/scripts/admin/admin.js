define(['angular', '../../constant','./controllers/adminCtrl'],function(angular, constant, adminCtrl){


	var moduleName = constant.appId + '.admin';

	_log_.d('add component in module: ' + moduleName);

    return angular.module(moduleName)
    .controller(moduleName+'Ctrl', adminCtrl)
    .directive('fileModel', ['$parse', function ($parse) {
	    return {
	        restrict: 'A',
	        link: function(scope, element, attrs) {
	            
	            var model = $parse(attrs.fileModel);
	            var modelSetter = model.assign;
	            
	            element.bind('change', function(){
	            	_log_.d('file is changed');
	                scope.$apply(function(){
	                    modelSetter(scope, element[0].files[0]);
	                });
	            });
	        }
	    };
	}]);
});