define([], function(){
    return ['$q',
            'Restangular',
            function($q,
                     Restangular) {

                var projectTreeData = [];
                var projectMap = {};
                var buildTreeData = {};
                var marvData = {};

                var getProjectLabel = function(proj) {
                    return proj.release + ' ' 
                        + proj.product + ' ' + proj.platform;
                }

                var getProject = function(id) {

                    return projectMap[id];
                }

                var getProjectTree = function(force) {
                    if(force || !projectTreeData || projectTreeData.length == 0) {

                        return Restangular.all('project')
                        .getList().then(function(data){

                            projectTreeData = [];
                            projectMap = {};

                            angular.forEach(data, function(proj){

                                var projName = getProjectLabel(proj);

                                projectTreeData.push({
                                    'id' : proj.id,
                                    'parent' : "#",
                                    'children': true,
                                    'text' : projName,
                                    'icon' : "fa fa-folder-o",
                                    'project': (projectMap[proj.id] = proj)
                                });

                            });

                            return projectTreeData;
                        }); 

                    } else {
                        return $q(function(resolve) {
                            resolve(projectTreeData);
                        });
                    }
                };

                var getBuildTree = function(projectId) {

                    if((projectId in buildTreeData) 
                        && buildTreeData[projectId].length > 0) {

                        return $q(function(resolve){
                            resolve(buildTreeData[projectId]);
                        });
                    } else {
                        return Restangular.all('build')
                        .getList({projectId: projectId})
                        .then(function(data){

                            if(!data) return [];

                            var buildTree = [];
                            angular.forEach(data, function(build){

                                buildTree.push({
                                  'id' : build.id,
                                  'pid' : projectId,
                                  'parent' : projectId,
                                  'text' : build.build,// + ' (' + build.buildTime +')',
                                  'icon' : "fa fa-file-o",
                                  'build' : build
                                });
                            });
                            buildTreeData[projectId] = buildTree;
                            return buildTree;
                        });
                    }
                };

                var getBuildDetail = function(buildId) {

                    if(!marvData[buildId]) {
                        return Restangular
                        .one("build", buildId)
                        .get()
                        .then(function(data) {
                            if(data) {

                                if(data.errMsg) {
                                    _log_.e(data.errMsg);
                                    return;
                                }

                                marvData[buildId] = {
                                    langs: data.langs,
                                    data: data.data
                                };
                                return marvData[buildId];
                            }
                        });
                    } else {
                        return $q(function(resolve) {
                            resolve(marvData[buildId]);
                        });
                    }
                };
 
                var getBuildDiff = function(buildId, baseId) {

                    var diffKey = buildId + '-' + baseId;
                    if(!marvData[diffKey]) {
                        return Restangular
                        .one("build", "diff")
                        .get({
                            buildId: buildId,
                            baseId: baseId
                        })
                        .then(function(data) {
                            marvData[diffKey] = {
                                langs: data.langs,
                                data: data.data,
                                updated: data.updated
                            };
                            return marvData[diffKey];
                        });
                    } else {
                        return $q(function(resolve) {
                            resolve(marvData[diffKey]);
                        });
                    }  
                };



                return {
                    getProject: getProject,
                    getProjectLabel: getProjectLabel,
                    getProjectTree: getProjectTree,
                    getBuildTree: getBuildTree,
                    getBuildDetail: getBuildDetail,
                    getBuildDiff: getBuildDiff,
                    "extractEnclosed" : function(name) {

                        var str = name || "";
                        var pattern = /[-|_][\d](.*)[\d][\.|-|_]/;
                        var result = name.match(pattern);

                        if(result && result.length > 1) {
                            
                            var ret = result[0];
                            return ret.substring(1,ret.length-1);
                        }
                        
                        return "";
                    }
                };
            }
    ];
})