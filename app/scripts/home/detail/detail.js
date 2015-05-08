define(['angular', '../../../constant'], function(angular, constant) {

	var appId = constant.appId;
    return angular.module(appId + '.home.detail')
    .controller(appId + '.detailCtrl', ['$scope', '$stateParams', 'CommonUtil', appId + '.dataHelper', function($scope, $stateParams, CommonUtil, dataHelper) {

    	//var $parentScope = $scope.$parent;

    	var projectId = $stateParams['project'];
        var buildId = $stateParams['build'];
        var baseId = $stateParams['base'];

        if(projectId && buildId) {

	        $scope.$emit('loading');
        	// make sure projects tree data has benn loaded
            dataHelper.getProjectTree().then(function(data){
                var project = dataHelper.getProject(projectId);
                $scope.selectedBuild['project'] = project;

	            if(project) {
	            	// get build data
	            	dataHelper.getBuildTree(projectId).then(function(buildTreeData) {

	            		// find curren build 
	                    for(var i=0, len=buildTreeData.length; i<len; i++) {
	                    	var build = buildTreeData[i].build;
	                        if(build.id == buildId) {
	                            $scope.selectedBuild['build'] = build;
	                            $scope.selectedBuild['buildLabel'] = dataHelper.getProjectLabel(project)+' ' + build['build'];
	                            break;
	                        }
	                    }

	                    // validate if the buildId in param is not found in backend
	                    if(i == len) {
	                        _log_.e('build ' + buildId + ' is not found');
	                        $scope.$emit('loaded');
	                        return;
	                    }

	                    var baseList = [];
	                    for(var j=i+1; j<len; j++) {
	                    	var base = buildTreeData[j].build;
	                        baseList.push(base);
	                        if(baseId && (baseId == base.id)) {
	                            $scope.selectedBuild['base'] = base;
	                        } 
	                    }
	                    $scope.selectedBuild["baseList"] = baseList;
	                    $scope.$emit('loaded');
	                });
	            } else {
	            	$scope.$emit('loaded');
	            	_log_.e('Project ' + projectId + ' is not found');
	            }
            });
        }


    }]);
});
