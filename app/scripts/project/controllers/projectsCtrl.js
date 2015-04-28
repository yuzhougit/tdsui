
define(['angular',
    'text!../templates/screenDlgTpl.html'], function(angular,
        screenDlgTpl) {
    return [
    '$scope',
    '$state',
    '$stateParams',
    '$timeout',
    'CommonUtil',
    '$modal',
    'marvweb.utility',
    'marvweb.gridhelper',
    function ($scope, $state, $stateParams, $timeout, CommonUtil, $modal, marvwebUtil,gridHelper) {

        // left: tree panel config
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
                        marvwebUtil.getProjectTree().then(function(data){
                            callback.call(me, data);
                        });
                    } else {
                        marvwebUtil.getBuildTree(obj.id).then(function(data){
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
        // current build config options
        $scope.selectedBuild = {
            isLoading: false,
            project: null,
            build: null,
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

        $scope.onInitTree = function(tree) {
            $scope.projectTree = tree;
        };

        var refreshSize = function(force) {
            if(force) {
                $scope.gridOptions.grid && $scope.gridOptions.grid.resizeCanvas();
            }
        };

        // toggle the maximun of detail panel
        $scope.maximumDetails = false;
        $scope.toggleMaximumDetails = function(){
            $scope.maximumDetails = !$scope.maximumDetails;
            $timeout(function() {
              refreshSize(true);
            }, 50);
        };

        $scope.onSelectTreeNode = function(evt, data) {

            if(data.action == "select_node") {
                //console.dir(data);
                var node = data.node.original;

                if(node.pid) { // build node

                    var newBuild = node.build;
                    var oldBuild = $scope.selectedBuild.build;

                    if($scope.selectedBuild.isLoading || 
                        (oldBuild && oldBuild.id == newBuild)) {
                        return;
                    }

                    var treeData = data.instance._model.data;
                    var parent = treeData[node.pid];
                    var pNode = parent.original;
                    var project = pNode.project;

                    $state.go("marvwebDetail", {
                        "project" : project.id,
                        "build": newBuild.id,
                        "base": null
                    });
                }
            }
        };

        $scope.$on('onFilterDataChanged', 
            function(event, filteredData, gridConfig){
                var langs = $scope.selectedBuild['showLangs'];
                var updatedLine = 0;
                var alertLine = 0;

                angular.forEach(filteredData, function(item){
                    var bAlertExist = gridHelper.checkAlert(item['issue'], langs);
                    if(bAlertExist) alertLine++;

                    var bUpdateExist = false;
                    for (var i=0; i<langs.length; i++ ) {
                        var cellData = item[langs[i].field];
                        if(cellData && 'pre' in cellData && cellData['pre']) {
                            bUpdateExist = true;
                            break;
                        }
                    };

                    if(bUpdateExist) {
                        updatedLine++;
                    }
                });

                updateSummary(filteredData.length, 
                    gridConfig.data.length, updatedLine, alertLine);
        });

        var updateSummary = function(show, total, updated, issues) {
            var message = "";
            message += 'Keys: ' + show +'/' + total;
            if(updated) {
                message += ", Updated Lines: " + updated;
            }

            if(issues) {
                message += ", Alert Lines: " + issues;
            }

            $scope.selectedBuild.summaryMessage = message;
        };

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
            $scope.selectedBuild['showLangs'];
        };

        $scope.globalFilter = function () {
            // simple call filter GridData
            gridHelper.filterGridData($scope.selectedBuild,
                $scope.gridOptions);
        }

        $scope.compare = function(base) {

            //console.dir(base);
            //return;
            $scope.selectedBuild['base'] = base;
            var project = $scope.selectedBuild["project"];
            var build = $scope.selectedBuild["build"];

            $state.go("marvwebDetail", {
                "project" : project.id,
                "build": build.id,
                "base": base.id
            });
        };
    }];
});