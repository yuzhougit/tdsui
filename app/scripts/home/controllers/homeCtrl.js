
define(['angular', '../../../constant'], function(angular,constant){
	//alert(constant.appId);
	//return ['$scope', 'CommonUtil',  function($scope, CommonUtil){}];

	var appId = constant.appId;

	return ['$scope', '$state', 'CommonUtil', appId + '.dataHelper', appId + '.gridHelper', function($scope, $state, CommonUtil, dataHelper, gridHelper) {

        var controllerName  = appId+ '.homeCtrl';
        _log_.d('Enter into the function: ' +  controllerName);

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
            globalFilterText: '',
            originalData: [],
            alertLines: 0,
            updatedLines: 0,
            filterLength: 0
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
                        _log_.d('get all project data');
                        dataHelper.getProjectTree(true).then(function(data){ // force reload project tree when enter home every time
                            callback.call(me, data);
                        });
                    } else {
                        _log_.d('get build data for project:' + obj.id);
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
            _log_.d('The project tree is inited');
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

                var base = null;
                for(var i=1; i<parent.children.length; i++) {
                    if(parent.children[i-1] == newBuild.id) {
                        base = parent.children[i];
                        break;
                    }
                }
            	var project = parent.original.project;

            	_log_.d('Project: ' + project.id + ', Build: ' + newBuild.id);

               	// go to detail 
                $state.go(appId + "Detail", {
                    "project" : project.id,
                    "build": newBuild.id,
                    "base": base
                });
            }
        };

        // right: detail grid config options
        $scope.gridOptions = {
            data: [],
            options: {
                enableCellNavigation: true,
                enableHeaderFilters: true,
                enableColumnReorder: true,
                enableTextSelectionOnCells: true,
                multiColumnSort: true,
                editable: true,
                asyncEditorLoading: false,
                autoEdit: false,
                multiSelect: false,                        
                showHeaderRow: true,
                explicitInitialization: true,
                forceFitColumns: true,
                caseSensitiveFilter: false,
                autoHeight: false,
                cellHighlightCssClass: "hightlight",
                enableCellTitle: function(data, field) {
                    return false;
                },
                onClick: function(e, grid) {

                    var args = grid.getCellFromEvent(e);
                    if(!args || !args.row) return;

                    var data = grid.getDataItem(args.row);
                    var field = grid.getColumns()[args.cell].field;
                    var cellData = data[field];
                   
                    if(gridHelper.checkExistScreen(cellData)) {
                        showScreen && showScreen(cellData);
                    }
                }
            },
            columns: []
        };

        // 
        $scope.$on('onFilterDataChanged', 
            function(event, filteredData, gridConfig){
                var langs = $scope.selectedBuild['showLangs'];
                var updatedLines = 0;
                var alertLines = 0;

                angular.forEach(filteredData, function(item){
                    var bAlertExist = gridHelper.checkAlert(item['issue'], langs);
                    if(bAlertExist) alertLines++;

                    var bUpdateExist = false;
                    for (var i=0; i<langs.length; i++ ) {
                        var cellData = item[langs[i].field];
                        if(cellData && 'pre' in cellData && cellData['pre']) {
                            bUpdateExist = true;
                            break;
                        }
                    };

                    if(bUpdateExist) {
                        updatedLines++;
                    }
                });

                angular.extend($scope.selectedBuild, {
                    filterLength: filteredData.length,
                    updatedLines: updatedLines,
                    alertLines: alertLines
                });
        });

        // toggle grid configuration
        $scope.toggleConf = function(e, conf) {

            conf.value = !(conf.value);
            switch(conf.label){
                case "Show Images Only":
                case "Show Alerts Only":
                case "Show Updates Only":
                    gridHelper.filterGridData($scope.selectedBuild,
                        $scope.gridOptions);
                    break;
                case "Highlight Longest":
                    gridHelper.setShowLongest(conf.value);
                    var grid = $scope.gridOptions.grid;
                    window.grid = grid;
                    for(var i=0; i<grid.getDataLength(); i++) {
                        grid.invalidateRow(i);
                    }
                    grid.render();
                    break;
            }
            e.stopPropagation();
        };

        // toggle gird column
        $scope.toggleCol = function(e, col) {

            col.bShow = !(col.bShow);
            switch(col.name){
                case "issue":
                case "key":
                    toggleColumn(col);
                    break;
                default:
                    toggleColumn(col);
                    gridHelper.filterGridData($scope.selectedBuild,
                        $scope.gridOptions);
                    break;
            }
            e.stopPropagation();
        };

        var toggleColumn = function(colConf) {

            var newColumns = [];
            var checkedLangs = [];
            angular.forEach($scope.selectedBuild.colConfig, function(col){
                col.bShow && newColumns.push(col);
                if(col.bShow && col.id != "issue" && col.id != "key") {
                    checkedLangs.push(col);
                }
            });

            $scope.gridOptions.columns = newColumns;
            $scope.selectedBuild['showLangs'] = checkedLangs;
        };

        $scope.globalFilter = function () {
            // simple call filter GridData
            gridHelper.filterGridData($scope.selectedBuild,
                $scope.gridOptions);
        }

        $scope.compare = function(base) {

            $scope.selectedBuild['base'] = base;
            var project = $scope.selectedBuild["project"];
            var build = $scope.selectedBuild["build"];

            $state.go(appId + "Detail", {
                "project" : project.id,
                "build": build.id,
                "base": base.id
            });
        };

	}];
});