
angular.module('ngOptionsPost', []).

directive('ngOptions', function(){
    return function($scope, elements, attrs) {
        var form = elements[0].form;

        angular.element(form).on('submit', function(){
            var opt = elements[0].options[elements[0].selectedIndex];

            opt.value = angular.toJson($scope[attrs.ngModel]);
        });
    }
});




