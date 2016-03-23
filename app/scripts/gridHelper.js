define([],function(){
    return ['CommonUtil',
    function(CommonUtil) {

        var showLongest = false;

        var refreshSize = function(grid) {
            
            return grid && grid.resizeCanvas();
        };

        var setShowLongest = function(show) {
            showLongest = show;
        };

        var newNumCol = function(){
            return {
                id: "sel", 
                name: "#", 
                field: "num", 
                behavior: "select", 
                cssClass: "cell-selection", 
                width: 40, 
                resizable: false, 
                selectable: false
            };
        };

        var newIssueCol = function() {
            return {
                id: "issue",
                name: "issue",
                field: "issue",
                bShow: true,
                sortable: false,
                formatter: function(row, cell, cellData, columnDef, rowData) {
                    var issues = filterAlerts(cellData);

                    if(issues.length > 0) {
                        return "<i class='warning'"
                            + " tooltip-trigger='click'"
                            + " tooltip-placement='right'"
                            + " tooltip-append-to-body='true'"
                            + " tooltip-html-unsafe='"
                            + "<span class=\"tooltip-in-slickgrid\">"
                            + issuesToMsg(issues) 
                            + "</span>" 
                            + "'>"
                            + issues.length 
                            +"</i>";
                    }

                    return "";
                },
                width: 50,
                minWidth: 50
            };
        };

        var newKeyCol = function() {
            return {
                id: "key",
                name: "key",
                field: "key",
                bShow: true,
                sortable: true,
                width: 100,
                minWidth: 100,
                editor: Slick.Editors.Text,
                getFieldValue : function(data, columnDef){
                    var keyData = data[columnDef.field];
                    return keyData? keyData.key : "";
                },
                formatter: function(row, cell, cellData, columnDef, rowData) {
                    var content = '<div'
                    +' tooltip-placement="auto top"'
                    +' tooltip-append-to-body="true"'
                    +' tooltip-html-unsafe="'
                    + '<span class=\'tooltip-in-slickgrid\'>'
                    + cellData.key 
                    + '</span>'
                    + '">'
                    + cellData.key
                    + '</div>';
                    return content;
                }
            };
        };

        var newLangColumn = function(lang) {
            return {
                    id: lang.id,
                    name: lang.name,
                    field: lang.id,
                    bShow: true,
                    sortable: true,
                    formatter: function(row, cell, cellData, columnDef, rowData) {
                        var content = "";
                        if(cellData) {
                            
                            var screenIcon = "";
                            if(checkExistScreen(cellData)) {
                                screenIcon = '<i class="fa fa-picture-o" '
                                    + '></i>&nbsp;';
                            }

                            if("value" in cellData) {
                                var i10nText = cellData.value;

                                var valEl = angular.element('<span></span>').text(i10nText);

                                if(cellData.pre) {
                                    valEl.addClass('changed');
                                }

                                if(showLongest && cellData.longest) {
                                    valEl.addClass('hightlight');
                                }

                                content = "<div"
                                            +" tooltip-placement='auto top'"
                                            +" tooltip-append-to-body='true'"
                                            +" tooltip-html-unsafe='"
                                            + "<span class=\"tooltip-in-slickgrid\">"
                                            + "[" + CommonUtil.escapeXml(CommonUtil.escapeXml(cellData.value)) + "]"
                                            + "<br>width: " + cellData.pxLength + "px";
                                if(cellData.pre) {
                                    content += "<br>Previous build value: <br>["
                                        + CommonUtil.escapeXml(CommonUtil.escapeXml(cellData.pre.value))
                                        + "]";
                                }
                                content +=  "</span>" 
                                            + "'>"
                                            + screenIcon 
                                            + valEl[0].outerHTML
                                            + "</div>";
                                
                            }
                        } else {
                            content = "[NOT FOUND]";
                        }

                        return content;
                    },
                    width: 100,
                    minWidth: 100,
                    resizable: true,
                    //editor: Slick.Editors.Text,
                    getFieldValue: function(data, columnDef) {
                        var langData = data[columnDef.field];
                        return langData? langData.value : "";
                    }
                };
        };

        // filter alerts by showed langs
        /*
            issue: Map, lang id, 
        */
        var filterAlerts = function(issue) {

            if(!issue) return [];

            var langCols = me.selectedBuild? me.selectedBuild['showLangs']:[];
            var issues = [];
            angular.forEach(langCols, function(langCol){
                var langIssues = issue[langCol.id];
                if(langIssues && langIssues.length > 0) {
                    angular.forEach(langIssues, function(issueCode){
                        issues.push({
                            code: issueCode,
                            lang: langCol.name
                        });
                    });
                }
            });
            return issues;
        };

        var checkAlert = function(issue, langs) {
            if(!issue) return false;
            
            for(var i=0, n=langs.length; i<n; i++){
                var langId = langs[i].id;
                if(issue[langId]) {
                    return true;
                }
            }
            return false;
        };

        var checkExistScreen = function(cellData) {
            return cellData && 
                ((cellData.screenList && cellData.screenList.length > 0) ||
                    (cellData.preScreenList && cellData.preScreenList.length > 0))
        };

        var me = this;

        var filterGridData = function(selectedBuild, gridOptions) {
            me.selectedBuild = selectedBuild;
            me.gridOptions = gridOptions;

            var data = selectedBuild['originalData'];
            var langs = selectedBuild['showLangs'];
            var filterData = [];

            for(var index=0; index < data.length; index++ ) {

                var item = data[index];

                if(selectedBuild.config[0].value) { // show images only
                    var bImageExist = false;
                    for (var i=0; i<langs.length; i++ ) {
                        var cellData = item[langs[i].id];
                        if(checkExistScreen(cellData)) {
                            bImageExist = true;
                            break;
                        }
                    };

                    if(!bImageExist){
                        continue;
                    }
                }

                if(selectedBuild.config[1].value) { // show alerts only
                    var bAlertExist = checkAlert(item['issue'], langs);
                    if(!bAlertExist) continue;
                }

                if(selectedBuild.config[2].value) { // show updates only
                    
                    var bUpdateExist = false;
                    for (var i=0; i<langs.length; i++ ) {
                        var cellData = item[langs[i].id];
                        if(cellData && cellData.pre) {
                            bUpdateExist = true;
                            break;
                        }
                    };
                    if(!bUpdateExist) continue;
                }

                if(selectedBuild.globalFilterText && selectedBuild.globalFilterText != "") {

                    var bGlobalTextExist = false;
                    for (var i=0; i<langs.length; i++ ) {
                        var cellData = item[langs[i].id];
                        var value = cellData?cellData.value.toLowerCase() : '';
                        if(value.indexOf(selectedBuild.globalFilterText.toLowerCase()) != -1) { // global filter data occurs
                            bGlobalTextExist = true;
                            break;
                        }
                    }

                    if(!bGlobalTextExist) continue;
                }

                
                filterData.push(item);
            }

            gridOptions.data = filterData;
            gridOptions.grid.scrollRowToTop(0); 
        };

        var issuesToMsg = function (issues) {
            var baseURL = "http://mindtouchgs.eng.citrite.net/Process/G11n_Development/I18n_Process/I18n_Platform/z_Error_Code/Mirror_Error_Code";

            var codeMapping = {
                2001: 'Resource not found.',
                2003: 'Not translated.',
                2008: 'Incorret count of % .',
                2010: 'L10n text is 2 times longer than EN text.',
                2011: 'L10n resource has not been updated yet.'
            };

            var msg = "";

            angular.forEach(codeMapping, function(desc, code) {
                var langs = [];
                angular.forEach(issues, function(issue){
                    if(issue.code == code) {
                        langs.push(issue.lang);
                    }
                });

                if(langs.length == 0) return;

                msg += code + ", "
                    + desc + "[" + langs.join(', ') + "]"
                    +"<br>";

            });

            return msg;
        };

        return {
            setShowLongest: setShowLongest,
            newIssueCol: newIssueCol,
            newKeyCol: newKeyCol,
            newLangColumn: newLangColumn,
            filterAlerts: filterAlerts,
            checkAlert: checkAlert,
            checkExistScreen: checkExistScreen,
            filterGridData: filterGridData
        }
    }];
});