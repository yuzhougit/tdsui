
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


    }];
});