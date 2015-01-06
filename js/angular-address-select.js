/**
* addressSelector Module
*
* 地址选择器
*/
angular.module('addressSelector', []).

provider('$address', function() {

	var http;

	this.dataUrl = null;

	this.setUrl = function(str) {
		this.dataUrl = str;
	}

	this.success = function(fn){
		http.get(this.dataUrl).success(fn);
	}

	this.$get = function($http, $log) {
		http = $http;

		if(!this.dataUrl){
			$log.error('请给addressSelector模块一个数据接口地址');
		}

		return this;
	}
}).

directive('address', ['$address', '$filter', function($address, $filter){
	return {
		scope: {},
		controller: function($scope, $element, $attrs, $transclude) {
			this.$scope = $scope;

			$scope.codes = {};

			$address.success(function(res){

				$scope.provinces = res.province;

				filter('province', $scope.codes.province, $scope.provinces);
				filter('city', $scope.codes.city, $scope.province.city);
				filter('area', $scope.codes.area, $scope.city.area);

				function filter(type, code, data){
					if(code){
						$scope[type] = $filter('filter')(data, { code: code })[0];
					}
					else{
						if(type === 'city' || type === 'area'){
							$scope[type] = '';
						}
						else{
							$scope[type] = data[0];
						}
					}
					
				}
			});
		},
		restrict: 'AE', 
		
		link: function($scope, iElm, iAttrs, controller) {

		}
	};

}]).

directive('province', function(){

	return {
		scope: {
			code: '='
		},
		require: '^address',
		restrict: 'AE', 
		template: '<select\
						code=""\
			            ng-model="addressScope.province"\
			            ng-options="p.name for p in addressScope.provinces track by p.code"\
			            ng-change="addressScope.city=addressScope.province.city[0];addressScope.area&&(addressScope.area=addressScope.city.area[0])">\
			       </select>',
		replace: true,
		link: function($scope, iElm, iAttrs, controller) {
			$scope.addressScope = controller.$scope;
			$scope.addressScope.codes.province = $scope.code;
		}
	};

}).

directive('city', function(){

	return {
		scope: {
			code: '='
		},
		require: '^address',
		restrict: 'AE', 
		template: '<select\
						code=""\
			            ng-model="addressScope.city"\
			            ng-show="addressScope.city"\
			            ng-options="c.name for c in addressScope.province.city track by c.code"\
			            ng-change="addressScope.area=addressScope.city.area[0]">\
			       </select>',
		replace: true,
		link: function($scope, iElm, iAttrs, controller) {
			$scope.addressScope = controller.$scope;
			$scope.addressScope.codes.city = $scope.code;
		}
	};

}).

directive('cityArea', function(){

	return {
		scope: {
			code: '='
		},
		require: '^address',
		restrict: 'AE', 
		template: '<select\
						code=""\
			            ng-show="addressScope.area"\
			            ng-model="addressScope.area"\
			            ng-options="a.name for a in addressScope.city.area track by a.code">\
			       </select>',
		replace: true,
		link: function($scope, iElm, iAttrs, controller) {
			$scope.addressScope = controller.$scope;
			$scope.addressScope.codes.area = $scope.code;
		}
	};

})