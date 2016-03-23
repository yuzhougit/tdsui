
define(['angular', '../../../constant'], function(angular,constant){

    var appId = constant.appId;


    return ['$scope', appId + '.dataHelper', '$state', '$stateParams', '$q','Restangular', "$http", function($scope, dataHelper, $state, $stateParams, $q, Restangular, $http){

    	var controllerName  = appId+ '.adminCtrl';


    	$scope.tabs = [{
    		title:'Projects',
    		template: 'modules/tdsui/scripts/admin/templates/projectAdmin.html',
    		active: true
    	}, {
    		title:'Builds',
    		template: 'modules/tdsui/scripts/admin/templates/buildAdmin.html',
    		active: false
    	}];

    	$scope.projects = [];
        $scope.selectedProject = {};

        //load all projects, TODO: get projects by page
        var projects = Restangular.all('project');
        projects.getList().then(function(data){

        	$scope.projects = data;

        	if($stateParams.project) {

        		angular.forEach($scope.projects, function(p){

        			if(p.id == $stateParams.project) {
        				adminBuilds(p);
        			}
        		});
        	}
        });

        $scope.addProject = function(newProject) {

        	projects.post(newProject).then(function(data){

        		if($scope.checkData(data)) {
        			$scope.projects.unshift(data);
        		}
        	});
        }

        $scope.updateProject = function(project) {

            project.put({
                product: project['product'],
                release: project['release'],
                platform: project['platform'],
                receiver: project['receiver']
            }).then(function(data){

                if($scope.checkData(data)) {

	                for(var index=0; index < $scope.projects.length; index++) {
	                    if($scope.projects[index].id == project.id) {
	                        $scope.projects.splice(index,1,data);
	                        break;
	                    }
	                }

	                $scope.selectedProject = {};
	            }
            });
        }

        $scope.editProject = function(project) {

            $scope.selectedProject = Restangular.copy(project);
        }

        $scope.cancelEdit = function() {

            $scope.selectedProject = {};
        }

        $scope.deleteProject = function (project) {

        	$scope.$emit('loading');
            project.remove().then(function(data){

            	if($scope.checkData(data)) {
            		var index = $scope.projects.indexOf(project);
                    $scope.projects.splice(index,1);

                    if(project.id == $scope.selectedProject.id) {
                        $scope.selectedProject = {
                        };
                    }
            	}
            	
            	$scope.$emit('loaded');
            });
        }


        // build admin
        $scope.currentProject = null;
        $scope.currentProjectLabel = null;
        $scope.Builds = [];
        $scope.selectedBuild = {
            projectId: null
        };

        var builds = Restangular.all('build');
        

        $scope.adminBuilds = function(project) {
        	$state.go(appId +'Admin',{project: project.id});
        }

        var adminBuilds = function(project){

            $scope.currentProject = project;
            $scope.currentProjectLabel = dataHelper.getProjectLabel(project);
            $scope.selectedBuild.projectId = project.id;

            $scope.tabs[0].active = false;
            $scope.tabs[1].active = true;

            loadBuilds();
        }

        var loadBuilds = function() {

            builds.getList({
            	projectId: $scope.selectedBuild.projectId
            }).then(function(data){
	        	$scope.Builds = data;
	        });
        }

        $scope.addBuild = function(newBuild){

        	//console.dir(newBuild);
        	
        	$scope.$emit('loading');
        	builds.post({
        		projectId: newBuild.projectId,
        		build: newBuild.build
        	}).then(function(data){
        		if($scope.checkData(data)) {
        			var buildData = data;
                	$scope.Builds.unshift(buildData);

                	 var fd = new FormData();
        			fd.append('file', newBuild.buildFile);

                	Restangular.one('build/upload', buildData.id)
                	.withHttpConfig({transformRequest: angular.identity})
					.customPOST(fd, '', undefined, {'Content-Type': undefined}).then(function(data){

						if($scope.checkData(data)) {
                    		$scope.repalceBuild(buildData, data);
						}

						$scope.$emit('loaded');
					});
        		} else {
        			$scope.$emit('loaded');
        		}
        	});
        }

        $scope.repalceBuild = function(existBuild, newBuild) {

            var index = $scope.Builds.indexOf(existBuild);
            if(newBuild){
                $scope.Builds.splice(index,1, newBuild);
            } else {
                $scope.Builds.splice(index,1);
            }
            
        }

        $scope.editBuild = function(build) {
        	$scope.selectedBuild = Restangular.copy(build);
        }

        $scope.cancelEditBuild = function() {
        	$scope.selectedBuild = {
	            projectId: $scope.currentProject.id
	        };
        }

        $scope.updateBuild = function(build) {

            build.put({
            	projectId: build['projectId'],
                build: build['build'],
            }).then(function(data){

                if($scope.checkData(data)) {

	                for(var index=0; index < $scope.Builds.length; index++) {
	                    if($scope.Builds[index].id == build.id) {
	                        $scope.Builds.splice(index,1,data);
	                        break;
	                    }
	                }

	                $scope.cancelEditBuild();
	            }
            });
        }
        $scope.deleteBuild = function (build) {

        	$scope.$emit('loading');
            build.remove().then(function(data){

            	if($scope.checkData(data)) {
            		var index = $scope.Builds.indexOf(build);
                    $scope.Builds.splice(index,1);

                    if(build.id == $scope.selectedBuild.id) {
                        $scope.selectedBuild = {
                        	projectId: $scope.selectedBuild.projectId
                        };
                    }
            	}
            	
            	$scope.$emit('loaded');
            });
        }

        $scope.reExtractBuild = function(build) {

        	$scope.$emit('loading');
        	Restangular.one('build/reextract', build.id).put().then(function(){

        		if($scope.checkData(data)) {}
        		$scope.$emit('loaded');
        	});    
        }

        $scope.clearBuildCache = function(build) {

            $scope.$emit('loading');
            Restangular.one('build/clearCache', build.id).put().then(function(){

                if($scope.checkData(data)) {}
                $scope.$emit('loaded');
            });    
        }

        $scope.$watch("selectedBuild.buildFile", function(newValue, oldValue) {

            if(newValue) {
                $scope.selectedBuild.build = 
                    dataHelper.extractEnclosed(newValue.name);
            } else {
                $scope.selectedBuild.build = "";
            }

        });


    }];
});