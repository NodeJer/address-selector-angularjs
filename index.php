<?php
    $action = $_SERVER['PHP_SELF'];

    $province = 'undefined';

    $city = 'undefined';

    $area = 'undefined';

    if($_SERVER['REQUEST_METHOD'] === 'POST'){
        $province = $_POST['province'];

        $city = $_POST['city'];

        $area = $_POST['area'];
    }
    
?>
<!DOCTYPE html>
<html xmlns:ng="http://angularjs.org">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"/>
<title>Examples</title>
<meta name="description" content="">
<meta name="keywords" content="">
<style>
    code{display: block; margin-bottom: 10px;}
</style>
</head>
<body id="ng-app" ng-controller="addressCtrl">
    <form name="myform" method="post" action="<?php echo $action ?>">
        <select name="province"
            ng-model="province"
            ng-options="p.name for p in provinces track by p.code"
            ng-change="city=province.city[0];area&&(area=city.area[0])"
        >
        </select>
        <select name="city"
            ng-show="city"
            ng-model="city"
            ng-options="c.name for c in province.city track by c.code"
            ng-change="area=city.area[0]"
        >
        </select>
        <select name="area"
            ng-show="area"
            ng-model="area"
            ng-options="a.name for a in city.area track by a.code"
        >
        </select>
        <br>
        省：
        <pre>{{province}}</pre>
        市：
        <pre>{{city}}</pre>
        区域：
        <pre>{{area}}</pre>

        <input type="submit">
    </form>
    <!--[if lte IE 7]>
        <script src="json2.js"></script>
    <![endif]-->
    <script src="angular.min.js"></script>
    <script src="address.js"></script>
    <script>
        angular.module('app', []).

        config(function($sceProvider) {
          // Completely disable SCE to support IE7.
          $sceProvider.enabled(false);
        }).

        controller('addressCtrl', function($scope, $element, $filter){

            $scope.provinces = address.province;

            var p = c = a = [];

            if( '<? echo $_SERVER['REQUEST_METHOD'] ?>' === 'POST'){
                p = $filter('filter')($scope.provinces, '<?php echo $province ?>');
                c = $filter('filter')(p[0].city, '<?php echo $city ?>');
                a = $filter('filter')(c[0].area, '<?php echo $area ?>');
            }

            $scope.province = p[0] || $scope.provinces[0];
            $scope.city =  c[0];
            $scope.area = a[0];
        });

        angular.bootstrap(document.body, ['app']);
    </script>
</body>
</html>