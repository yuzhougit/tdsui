define([
    'angular',
    './controllers/projectsCtrl',
    './controllers/screenshotCtrl'
    ],

    function(angular, projectsCtrl, screenshotCtrl){

        return angular.module('marvweb.project')
        .directive('onCarouselChange', ['$parse', function ($parse) {
          return {
            require: 'carousel',
            link: function (scope, element, attrs, carouselCtrl) {
                
              var fn = $parse(attrs.onCarouselChange);
              var origSelect = carouselCtrl.select;

              carouselCtrl.select = function (nextSlide, direction) {
                if (nextSlide !== this.currentSlide) {
                  fn(scope, {
                    nextSlide: nextSlide,
                    direction: direction,
                  });
                }
                return origSelect.apply(this, arguments);
              };
            }
          };
        }])
        .controller('marvweb.projectsCtrl', projectsCtrl)
        .controller('marvweb.screenshotCtrl', screenshotCtrl);
    });