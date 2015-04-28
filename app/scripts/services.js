define(['angular','./util', './dataHelper', './gridHelper'], 
    function(angular, util, dataHelper, gridHelper) {

    _log_.d("Enter into the function to return marvweb.services module");

    return angular.module("marvweb.services", [])
    .factory('marvweb.utility', dataHelper)
    .factory('marvweb.gridhelper', gridHelper);
});