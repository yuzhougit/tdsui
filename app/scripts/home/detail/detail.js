define(['angular', '../../../constant'], function(angular, constant) {

	var appId = constant.appId;
    return angular.module(appId + '.home.detail')
    .controller(appId + '.detailCtrl', ['$scope', '$stateParams', 'CommonUtil', appId + '.dataHelper', appId + '.gridHelper',function($scope, $stateParams, CommonUtil, dataHelper, gridHelper) {

    	//var $parentScope = $scope.$parent;

    	var projectId = $stateParams['project'];
        var buildId = $stateParams['build'];
        var baseId = $stateParams['base'];

        if(projectId && buildId) {

	        $scope.$emit('loading');
        	// make sure projects tree data has benn loaded
            dataHelper.getProjectTree().then(function(data){
                var project = dataHelper.getProject(projectId);

	            if(project) {
	            	//get build data
	            	dataHelper.getBuildTree(projectId).then(function(buildTreeData) {

                        var build = null;
	            		// find curren build 
	                    for(var i=0, len=buildTreeData.length; i<len; i++) {
	                        if(buildTreeData[i].build.id == buildId) {
	                            build = buildTreeData[i].build;
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
                        var base= null;
	                    for(var j=i+1; j<len; j++) {
	                    	var tempBase = buildTreeData[j].build;
	                        baseList.push(tempBase);
	                        if(baseId && (baseId == tempBase.id)) {
	                           base = tempBase;
	                        } 
	                    }

                        // get build detail data
                        var buildDetail = baseId? dataHelper.getBuildDiff(buildId, baseId) : dataHelper.getBuildDetail(buildId);

                        buildDetail.then(function(data){
                            $scope.$emit('loaded');
                            if(!data) return;

                            updateSelectedBuild(project, build, base, baseList, data.data);
                            updateColumns(data.langs);
                            gridHelper.filterGridData($scope.selectedBuild,$scope.gridOptions);
                        });
	                    
	                });
	            } else {
	            	$scope.$emit('loaded');
	            	_log_.e('Project ' + projectId + ' is not found');
	            }
            });
        }

        var updateSelectedBuild = function(project, build, base, baseList,data) {
            //reset info in selectedBuild
            $scope.selectedBuild = $scope.$parent.selectedBuild = angular.extend({}, $scope.selectedBuild, {
                project: project,
                build: build,
                buildLabel: dataHelper.getProjectLabel(project)+' ' + build['build'],
                base: base,
                baseList: baseList,
                originalData: data
            });
        }

        var updateColumns = function(langs) {
            var newColumns = [].concat([gridHelper.newIssueCol(), 
                gridHelper.newKeyCol()]);
            var checkedLangs = [];
            angular.forEach(langs, function(lang) {
                var col = gridHelper.newLangColumn(lang);
                newColumns.push(col);
                checkedLangs.push(col);
            });

            $scope.selectedBuild['colConfig'] = newColumns;
            $scope.selectedBuild['showLangs'] = checkedLangs;
            $scope.gridOptions.columns = newColumns;
        };

    }]);
});
