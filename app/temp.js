$scope.isLoading = false;
                        $scope.debug = window.DEBUG_MODE;

                        $scope.$state = $state;
                        $scope.$stateParams = $stateParams;

                        $scope.welcome = "Welcome to GS Test Decision System";
                        $scope.globalSearch.placeholder = "Search resource string";


                        /*

                        $scope.$on("f-search-confirm", function(evt, callback, result){  
                            callback(true);
                        });

                        $scope.$on('f-search', function(evt, callback, val){

                            var results = [];
                            callback(results);
                        });*/


                        var defaultRoot = "Projects";
                        
                        $scope.navigators = [{
                           'label' : defaultRoot
                        }];

                        $scope.$on('$stateChangeSuccess',
                            function(event, toState, toParams, fromState, fromParams){
                                //_log_.d("Catch event of $stateChangeSuccess");
                            $scope.onReady.then(function(){
                                //console.dir(toState);
                                if(toState.name == "marvwebDetail") {
                                    $scope.navigators = [{
                                        'label' : defaultRoot
                                    },{
                                        'label' : toParams.projectName
                                    },{
                                        'label' : toParams.build + (toParams.base? " vs " + toParams.base : "")
                                    }];
                                }
                                
                            });
                               
                        });

                        $scope.$on("loading", function() {
                            $scope.isLoading = true;
                        });

                        $scope.$on("loaded", function() {
                            $scope.isLoading = false;
                        });
                        //console.dir(marvwebUtil.getProjects());

                        $scope.onReady = $q.all([
                            marvwebUtil.getProjectTree()
                            .then(function(data) {
                                $scope.projectTreeData = data;
                            })
                        ]);