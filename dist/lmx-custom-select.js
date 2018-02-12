'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

angular.module('lmxCustomSelect', []).run(['$templateCache', function ($templateCache) {
    var template = '\n            <div class="customSelect">\n                <div outside-click="close()">\n                    <input class="customSelect-selected" ng-class="{\'_disabled\': !model}" ng-click="trigger()" ng-value="value" type="text" readonly />\n\n                    <div class="customSelect-scroller__wrapper" ng-class="{\'_hide\': !isVisible}">\n                        <input class="customSelect-filter" type="text" ng-model="$parent.valueOfFilterByText" ng-if="filterByText" />\n                        \n                        <div class="customSelect-scroller">\n                            <ul class="customSelect-list">\n                                <li class="customSelect-item _disabled" ng-if="caption">{{caption}}</li>\n                                <li class="customSelect-item" ng-repeat="value in filteredRepeat = (repeat | filter:valueOfFilterByText)" ng-click="subValue ? select(value[subValue.value]) : select(value)">\n                                    {{subValue ? value[subValue.text] : value}}\n                                </li>\n                                <li class="customSelect-item _disabled" ng-if="!filteredRepeat.length">Filter is incorrect</li>\n                            </ul>\n                        </div>\n\n                        <div class="customSelect-scroller__track">\n                            <div class="customSelect-scroller__bar"></div>\n                        </div>\n                    </div>\n                 </div>\n\n                 <select ng-model="model" ng-options="{{options}}"></select>\n            </div>\n        ';

    $templateCache.put('lmx-custom-select.html', template);
}]).directive('lmxCustomSelect', function ($filter) {
    return {
        restrict: 'A',
        replace: true,
        require: 'ngModel',
        scope: {
            repeat: '=',
            nameVariableForOptions: '@repeat',
            options: '@',
            placeholder: '@',
            caption: '@'
        },
        templateUrl: function templateUrl($element, $attrs) {
            return $attrs.templateUrl || 'lmx-custom-select.html';
        },
        link: function link($scope, elem, attrs, ngModelController) {
            $scope.filterByText = attrs.filterByText !== undefined;
            $scope.valueOfFilterByText = '';
            $scope[$scope.nameVariableForOptions] = $scope.repeat;
            $scope.options = attrs.options.replace(attrs.repeat, "repeat");

            var options = attrs.options.split(/\s+/);

            if (options[1] === 'as') {
                $scope.subValue = {
                    value: options[0].split('.')[1],
                    text: options[2].split('.')[1]
                };
                $scope.$watch('repeat', function (newValue) {
                    if (newValue) {
                        setData({ repeat: newValue });
                    }
                });
            }

            $scope.$watch('valueOfFilterByText', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    vscroll.update();
                }
            });

            $scope.$watch('model', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    setData({ model: newValue });
                }
            });

            $scope.select = function (value) {
                $scope.close();
                $scope.model = value;
                ngModelController.$setViewValue($scope.model);
            };

            $scope.close = function () {
                $scope.isVisible = false;
            };

            $scope.trigger = function () {
                $scope.isVisible = !$scope.isVisible;

                if ($scope.isVisible) {
                    vscroll.update();
                }
            };

            var setData = function setData(params) {
                if (options[1] === 'as' && params) {
                    $scope.text = $filter('filter')(params.repeat || $scope.repeat, _defineProperty({}, $scope.subValue.value, params.model || $scope.model))[0][$scope.subValue.text];
                    $scope.value = $scope.model ? $scope.text : $scope.placeholder;
                } else {
                    $scope.value = $scope.model || $scope.placeholder;
                }
            };

            ngModelController.$render = function () {
                $scope.model = ngModelController.$viewValue;
                setData();
            };

            var vscroll = baron({
                root: elem[0].querySelector('.customSelect-scroller__wrapper'),
                scroller: '.customSelect-scroller',
                barOnCls: '_scrollbar',
                track: '.customSelect-scroller__track',
                bar: '.customSelect-scroller__bar',
                cssGuru: true,
                direction: 'v'
            });
        }
    };
});