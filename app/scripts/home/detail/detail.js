define(['angular', '../../../constant'], function(angular, constant) {

	var appId = constant.appId;
    return angular.module(appId + '.home.detail')
    .controller(appId + '.detailCtrl', ['$scope', '$stateParams', 'CommonUtil', appId + '.dataHelper', function($scope, $stateParams, CommonUtil, dataHelper) {

    	//var $parentScope = $scope.$parent;

    	var projectId = $stateParams['project'];
        var buildId = $stateParams['build'];
        var baseId = $stateParams['base'];

        if(projectId && buildId) {

        	//$scope.selectedBuild.buildLabel = "XXX";
        	$scope.selectedBuild.isLoading = true;
            $scope.$emit('loading');


            $scope.selectedBuild.isLoading = false;
            $scope.$emit('loaded');
        }


    }]);
});
