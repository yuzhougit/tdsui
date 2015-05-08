
define(['angular', '../../../constant'], function(angular,constant){
	//alert(constant.appId);
	//return ['$scope', 'CommonUtil',  function($scope, CommonUtil){}];

	var appId = constant.appId;

	return ['$scope', '$state', 'CommonUtil', appId + '.dataHelper', appId + '.gridHelper', function($scope, $state, CommonUtil, dataHelper, gridHelper) {

		// current build config options
        $scope.selectedBuild = {
            project: null,
            build: null,
            buildLabel: '{Please select a build from dropdown tree}',
            base: null,
            baseList: [],
            config: [{
                "label": "Show Images Only",
                "value": false
            }, {
                "label": "Show Alerts Only",
                "value": false
            }, {
                "label": "Show Updates Only",
                "value": false
            }, {
                "label": "Highlight Longest",
                "value": false
            }],
            colConfig : [],
            summaryMessage: "Summary:",
            globalFilterText: ''
        };

		$scope.projectTreeConfig = {
            "core" : {
                "animation" : 0,
                "check_callback" : true,
                "themes" : { "stripes" : true },
                'worker' : false,
                'multiple' : false,
                'data' : function (obj, callback) {
                    var me = this;
                    if(obj.id === '#') { // root node
                        // get all project data
                        dataHelper.getProjectTree().then(function(data){
                            callback.call(me, data);
                        });
                    } else {
                        dataHelper.getBuildTree(obj.id).then(function(data){
                            callback.call(me, data);
                        });
                    }
                }
            },
            'state' : {
                "key" : "marvweb_project_tree"
            },
            'search' : {
                show_only_matches: false
            },
            'plugins': ['wholerow', 'search', 'state']
        };

        $scope.onInitTree = function(tree) {
            $scope.projectTree = tree;
        };

        $scope.onSelectTreeNode = function(evt, data) {

        	var node;
            if(data.action == "select_node" && (node = data.node.original) && node.pid) {
            	
                var newBuild = node.build;
            	var oldBuild = $scope.selectedBuild.build;

            	if($scope.isLoading || (oldBuild && oldBuild.id == newBuild.id)) {
            		return;
            	}

            	var parent = data.instance._model.data[node.pid];
            	var project = parent.original.project;

            	_log_.d('Project: ' + project.id + ', Build: ' + newBuild.id);
                
                //reset info in selectedBuild
                $scope.selectedBuild = angular.extend({}, $scope.selectedBuild, {
                    project: null,
                    build: null,
                    buildLabel: '{Please select a build from dropdown tree}',
                    base: null,
                    baseList: []
                });

               	// go to detail 
                $state.go(appId + "Detail", {
                    "project" : project.id,
                    "build": newBuild.id,
                    "base": null
                });
            }
        };

	}];
});