define(['angular',
    'jcrop'], function(angular,
        jcrop) {
        return ['$scope',
        'screenInfo',
        '$modalInstance',
        function($scope, screenInfo, $modalInstance) {

            $scope.slides = screenInfo.slides;
            $scope.myInterval = 5000;
            $scope.screenText = screenInfo.screenText;

            $scope.curSlide = null;

            $scope.closeDialog = function() {
                $modalInstance.dismiss('cancel');
            };

            $scope.jcropInstance = null;

            $scope.showControl = function() {
                
                if($scope.curSlide) {
                    $scope.myInterval = false;

                    var imgEl = $scope.curSlide.$element.find('img');
                    if(imgEl.length == 0) return;

                    var slideData = $scope.curSlide.$element.scope().slide;

                    console.dir(slideData);

                    var xRatio = imgEl.width()/slideData.imgWidth;
                    var yRatio = imgEl.height()/slideData.imgHeight;

                    _log_.d(xRatio);
                    _log_.d(yRatio);

                    var newX = slideData.ctrlX * xRatio;
                    var newY = slideData.ctrlY * yRatio;
                    var newWith = slideData.ctrlWidth * xRatio;
                    var newHeight = slideData.ctrlHeight * yRatio;

                    _log_.d(newX);
                    _log_.d(newY);
                    _log_.d(newWith);
                    _log_.d(newHeight);

                    imgEl.Jcrop({
                        setSelect: [newX, newY, newX+newWith, newY+newHeight]
                    },
                    function(){
                            $scope.jcropInstance = this;
                    });
                };
            };

            $scope.showImage = function() {
                if($scope.jcropInstance) {
                    $scope.jcropInstance.destroy();
                    $scope.jcropInstance = null;
                    $scope.myInterval = 5000;
                }
            };

            $scope.onSlideChanged = function(nextSlide, direction) {
                $scope.curSlide = nextSlide;
                if(direction) {
                    $scope.showImage();
                }
            };

        }]
    });
