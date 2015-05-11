
// app.js: create the app module

define(['angular',
    './constant',
    'common/utils/CommonUtil',
    'common/components/treeView',
    './scripts/services',
    'css!./styles/themes/css/' + $theme + '/app'], function(angular, constant, CommonUtil, treeView, services) {

        //_log_.d("Enter into the function to ruturn tdsui module");
        window.document.title = constant.appName; // TODO: suggest platform to do this change
        var appId = constant.appId;
        var moduleName = appId;


        return angular.module(moduleName, [CommonUtil.name, treeView.name, services.name], function(){
            // funtion when create module
        }).config(['$stateProvider','$urlRouterProvider', 'RestangularProvider', "$httpProvider", function($stateProvider,$urlRouterProvider, RestangularProvider, $httpProvider) {

            RestangularProvider.setDefaultHttpFields({
                'timeout' : 1000000
            });

            $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

            $httpProvider.defaults.transformRequest = [function(data) {
                return angular.isObject(data) && String(data) !== '[object File]' ? $.param(data) : data;
            }];

            // config function of module
        }]).run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
            // run function of module
        }]).controller(moduleName + 'Ctrl', ['$scope', '$element', '$state', '$stateParams','$q', appId+'.dataHelper', 'CommonUtil', function($scope, $element, $state,$stateParams,$q, dataHelper, CommonUtil) {

            $scope.alerts = [];

            $scope.addAlert = function(type, message) {
                $scope.alerts.push({type: type, msg: message});
            };

            $scope.closeAlert = function(index) {
                $scope.alerts.splice(index, 1);
            };


            // process event when state change
            $scope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){

                _log_.d('state changed to :' + toState.name);

                
                switch(toState.name) {
                    case moduleName+'Home':
                    case moduleName+'Detail':
                        $scope.$toggleSelectedItem(toState.name);
                        break;
                    default:
                        // jump to home when app module 
                        $scope.$toggleSelectedItem(toState.name);
                        break;
                }
            });

            $scope.isLoading = false;

            $scope.$on("loading", function() {
                CommonUtil.indicator(appId, 'loading data, please wait...', null, 'lg'); // TODO: check why message doesn't work
                $scope.isLoading = true;
            });

            $scope.$on("loaded", function() {
                CommonUtil.indicator(appId, '', null, 'lg');
                $scope.isLoading = false;
            });

        }]);
    });