/*
*/
define(['angular'], function(angular) {
    return angular.module('marvweb.project.detail')
    .controller('marvweb.detailCtrl',[
        '$scope',
        '$state',
        '$stateParams',
        'Restangular',
        '$timeout',
        'marvweb.utility',
        'marvweb.gridhelper',
        '$modal',
        function($scope,
            $state,
            $stateParams,
            Restangular,
            $timeout,
            marvwebUtil,
            gridHelper,
            $modal
        ) {

        _log_.d("Enter the detail controller");

        _log_.d("welcome: " + $scope.welcome);

        var $parentScope = $scope.$parent;                

        var buildDetail = null;
        

        if($stateParams['build']) {

            // get projectId and buildId form url params 
            var projectId = $stateParams['project'];
            var buildId = $stateParams['build'];

            $scope.selectedBuild.isLoading = true;
            $scope.$emit('loading');

            marvwebUtil.getProjectTree().then(function(projectTreeData){

                // TODO: check if projectTreeData is valid

                for(var i=0, len=projectTreeData.length; i<len; i++) {

                    if(projectTreeData[i].id == projectId) {
                        $scope.selectedBuild['project'] = projectTreeData[i].project;
                        break;
                    }
                }

                // TODO: check if the projectId is found in projectTreeData

                marvwebUtil.getBuildTree(projectId).then(function(buildTreeData) {

                    for(var i=0, len=buildTreeData.length; i<len; i++) {

                        if(buildTreeData[i].id == buildId) {
                            $scope.selectedBuild['build'] = buildTreeData[i].build;
                            break;
                        }
                    }

                    // validate if the buildId in param is not found in backend
                    if(i == len) {
                        _log_.e('build with id ' + buildId + ' is not found');
                        $scope.addAlert('build with id ' + buildId + ' is not found');
                        $scope.$emit('loaded');
                        $scope.selectedBuild.isLoading = false;
                        return;
                    }

                    var baseList = [];
                    for(var j=i+1; j<len; j++) {
                        baseList.push(buildTreeData[j]);
                        if($stateParams['base'] 
                            && ($stateParams['base'] == buildTreeData[j].id)) {
                            $scope.selectedBuild.base = buildTreeData[j].build;
                        }
                    }
                    $scope.selectedBuild["baseList"] = baseList;


                    if($stateParams['base']) {
                        buildDetail = marvwebUtil.getBuildDiff(buildId,
                        $stateParams['base']);
                        $parentScope.welcome = marvwebUtil.getProjectLabel($scope.selectedBuild.project) 
                        + " : " + $scope.selectedBuild.build.build
                        + ' VS ' + $scope.selectedBuild.base.build;

                    } else {
                        buildDetail = marvwebUtil
                        .getBuildDetail(buildId);
                        $parentScope.welcome = marvwebUtil.getProjectLabel($scope.selectedBuild.project) 
                        + " : " + $scope.selectedBuild.build.build;
                        $scope.selectedBuild["base"] = null;
                    }

                    buildDetail.then(function(data) {

                        if(!data) return;

                        updateColumns(data.langs);
                        // update grid data
                        $scope.selectedBuild['originalData'] = data.data;
                        gridHelper.filterGridData($scope.selectedBuild,
                            $scope.gridOptions);
                        $scope.$emit('loaded');
                        $scope.selectedBuild.isLoading = false;
                    });
                });
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

            $scope.selectedBuild.colConfig = newColumns;
            $scope.selectedBuild['showLangs'] = checkedLangs;
            $scope.gridOptions.columns = newColumns;
        };

        _log_.d("Exit the detail controller");

    }]);
});