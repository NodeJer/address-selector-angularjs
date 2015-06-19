var mod = angular.module('ngAddressSelector', []);

mod.directive('address', ['$filter', '$http', '$rootScope', function($filter, $http, $rootScope) {
    return {
        scope: {},
        controller: function($scope, $element, $attrs, $transclude) {
            var addressArr = $scope.addressArr = [];

            this.getScope = function() {
                return $scope;
            }
            this.pushAddress = function(address) {
                addressArr.push(address);
            }

            $http.get($attrs.data).success(function(res) {

            	addressArr = $filter('orderBy')(addressArr, '-name');

                $scope.model = res;
                
                angular.forEach(addressArr, function(address) {
                	//找到上一级
                    findParnet(address);

                    var code = address.code;
                    var name = address.name;
                    var parent = address.parent;

                    if (code) {
                        address.model = $filter('filter')(parent.model[name], {
                            code: code
                        })[0];
                    } else {
                        parent.$watch('model', function(newVal){
                        	if(!newVal)return;
                        	
			            	address.model = newVal[name][0];
			            });
                    }
                });

                function findParnet(address) {

                    var parentName = address.parentName;
                    var name = address.name;

                    if (parentName === 'address') {
                        address.parent = $scope;
                        return;
                    }

                    angular.forEach(addressArr, function(address2) {
                        if (address2.name === parentName) {
                            address.parent = address2;
                        }
                    });
                }
            });
        },
        restrict: 'AE',
    };

}]);

mod.directive('province', function() {

    return {
        scope: {
            code: '@'
        },
        require: '^?address',
        restrict: 'AE',
        controller: function($scope, $element, $attrs, $transclude) {
            $scope.name = 'province';
            $scope.parentName = 'address';
        },
        template: '<select\
			            ng-model="model"\
			            ng-options="p.name for p in parent.model[name] track by p.code"\
			            ng-change="$emit(\'change\')"\
			       </select>',
        replace: true,
        link: function($scope, iElm, iAttrs, addressController) {
            if (!addressController) return;

            addressController.pushAddress($scope);
        }
    };

});
mod.directive('city', function() {

    return {
        scope: {
            code: '@'
        },
        require: '^?address',
        restrict: 'AE',
        controller: function($scope, $element, $attrs, $transclude) {
            $scope.name = 'city';
            $scope.parentName = 'province';
        },
        template: '<select\
			            ng-model="model"\
			            ng-if="parent.model[name]"\
			            ng-options="c.name for c in parent.model[name] track by c.code"\
			       </select>',
        replace: true,
        link: function($scope, iElm, iAttrs, addressController) {
            if (!addressController) return;

            addressController.pushAddress($scope);
        }
    };

});

mod.directive('area', function(){
	return {
		scope: {
			code: '@'
		},
		require: '^?address',
		controller: function($scope, $element, $attrs, $transclude) {
            $scope.name = 'area';
            $scope.parentName = 'city';
        },
		restrict: 'AE', 
		template: '<select\
			            ng-model="model"\
			            ng-if="parent.model[name]"\
			            ng-options="a.name for a in parent.model[name] track by a.code">\
			       </select>',
		replace: true,
		link: function($scope, iElm, iAttrs, addressController) {
			if(!addressController)return;

			addressController.pushAddress($scope);
		}
	};
});

