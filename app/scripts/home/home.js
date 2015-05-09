
// Create the controller to sub module

define(['angular', '../../constant','./controllers/homeCtrl'],function(angular, constant, homeCtrl){

	var moduleName = constant.appId + '.home';
	return angular.module(moduleName)
    .controller(moduleName+'Ctrl', homeCtrl)
    .directive('resizeable', ['$window', function($window){

        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                _log_.d('Window Size (W,H) is : (' + $window.innerWidth + ',' + $window.innerHeight + ')');

                var elOffSet = element.offset();
                _log_.d('Offset of element is : (' + elOffSet.top + ',' + elOffSet.left + ')');

                scope.gridHeight = $window.innerHeight - elOffSet.top - 30;

                angular.element($window).bind('resize', function(){

                    _log_.d('Window Size (W,H) Changed to : (' + $window.innerWidth + ',' + $window.innerHeight + ')');
                    scope.gridHeight = $window.innerHeight - elOffSet.top - 30;
                    scope.$apply();
                        
                });
            }
        }
    }]);
});