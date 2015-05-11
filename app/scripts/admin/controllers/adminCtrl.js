
define(['angular', '../../../constant'], function(angular,constant){

    var appId = constant.appId;


    return ['$scope', '$q','Restangular', "$http", function($scope, $q, Restangular, $http){

    	var controllerName  = appId+ '.adminCtrl';

    	$scope.projects = [];
        $scope.selectedProject = {};

        //load all projects, TODO: get projects by page
        var projects = Restangular.all('project');
        projects.getList().then(function(data){

        	$scope.projects = data;
        });

        $scope.addProject = function(newProject) {

        	projects.post(newProject).then(function(data){

        		if(data && data.errMsg) {
        			$scope.addAlert('danger', data.errMsg);
        			return;
        		}

        		$scope.projects.unshift(data);
        	});
        }

        $scope.updateProject = function(project) {

            project.put({
                product: project['product'],
                release: project['release'],
                platform: project['platform']
            }).then(function(data){

                if(data && data.errMsg) {
                    $scope.addAlert('danger', data.errMsg);
                    return;
                }

                for(var index=0; index < $scope.projects.length; index++) {
                    if($scope.projects[index].id == project.id) {
                        $scope.projects.splice(index,1,data);
                        break;
                    }
                }

                $scope.selectedProject = {};
            });
        }

        $scope.editProject = function(project) {

            $scope.selectedProject = Restangular.copy(project);
        }

        $scope.cancelEdit = function() {

            $scope.selectedProject = {};
        }

        $scope.currentProject = null;
        $scope.builds = {};
        $scope.adminBuilds = function(project){

            $scope.currentProject = project;
        }


    }];
});