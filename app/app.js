/**
 * Created by hammer on 2014/8/31.
 */
define(['angular',
        'common/utils/CommonUtil',
        'common/components/treeView',
        './scripts/services',
        'css!./styles/themes/css/' + $theme + '/app'
       ], 
       function(
        angular,
        CommonUtil,
        treeView,
        marvwebServices) {
            _log_.d("Enter into the function to ruturn marvweb module");
            console.dir(marvwebServices);

            return angular.module('marvweb',[
                    marvwebServices.name,
                    CommonUtil.name,
                    treeView.name
                ])
            .config(['$stateProvider',
                '$urlRouterProvider',
                function($stateProvider,
                    $urlRouterProvider) {

                    _log_.d("Enter into the config"+
                        " of marvweb module");

                }])
            .run(['$rootScope',
                '$state',
                '$stateParams',
                function($rootScope,
                    $state,
                    $stateParams) {

                    _log_.d("Enter into the run"+
                        " of marvweb module");

                }])
            .controller('marvwebCtrl',[
                    '$scope',
                    '$state',
                    '$stateParams',
                    '$q',
                    'marvweb.utility',

                    function($scope,
                        $state,
                        $stateParams,
                        $q,
                     marvwebUtil) {

                        _log_.d("Enter into the function of marvwebCtrl in marvweb module");
                        $scope.isLoading = false;
                        $scope.debug = window.DEBUG_MODE;
                        $scope.$state = $state;
                        $scope.$stateParams = $stateParams;

                        $scope.welcome = "Welcome to GS Test Decision System";
                        $scope.globalSearch.placeholder = "Search resource string";

                        $scope.$on("f-search-confirm", function(evt, callback, result){
                            
                            callback(true);
                        });

                        $scope.$on('f-search', function(evt, callback, val){

                            var results = [];

                            //alert("dd");

                            callback(results);
                        });


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
                    }
                ]);
       });