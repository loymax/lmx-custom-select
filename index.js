angular.module('lmxCustomSelect', [])

    .run(['$templateCache', $templateCache => {
        const template = `
            <div class="customSelect">
                <div outside-click="close()">
                    <input class="customSelect-selected" ng-class="{'_disabled': !model}" ng-click="trigger()" ng-value="value" type="text" readonly />

                    <div class="customSelect-scroller__wrapper" ng-class="{'_hide': !isVisible}">
                        <div class="customSelect-filter__wrapper" ng-if="filterByText">
                            <input class="customSelect-filter" type="text" ng-model="$parent.valueOfFilterByText" ng-attr-placeholder="{{filterByText.placeholder}}" />
                        </div>
                    
                        <div class="customSelect-scroller">
                            <ul class="customSelect-list">
                                <li class="customSelect-item _caption" ng-if="caption">{{caption}}</li>
                                <li class="customSelect-item" ng-repeat="value in filteredRepeat = (repeat | filter:valueOfFilterByText)" ng-click="subValue ? select(value[subValue.value]) : select(value)">
                                    {{subValue ? value[subValue.text] : value}}
                                </li>
                                <li class="customSelect-item _incorrect" ng-if="!filteredRepeat.length">{{filterByText.noMatchFound}}</li>
                            </ul>
                        </div>

                        <div class="customSelect-scroller__track">
                            <div class="customSelect-scroller__bar"></div>
                        </div>
                    </div>
                 </div>

                 <select ng-model="model" ng-options="{{options}}"></select>
            </div>
        `;

        $templateCache.put('lmx-custom-select.html', template);
    }])

    .directive('lmxCustomSelect', $filter => {
        return {
            restrict: 'A',
            replace: true,
            require: 'ngModel',
            scope: {
                repeat: '=',
                nameVariableForOptions: '@repeat',
                options: '@',
                placeholder: '@',
                caption: '@',
                filterByText: '<'
            },
            templateUrl: ($element, $attrs) => {
                return $attrs.templateUrl || 'lmx-custom-select.html';
            },
            link: ($scope, elem, attrs, ngModelController) => {
                $scope.filterByText = attrs.filterByText === undefined ? false : ({
                    ...{
                        placeholder: 'Search',
                        noMatchFound: 'Filter is incorrect',
                    },
                    ...$scope.filterByText
                });

                $scope.valueOfFilterByText = '';
                $scope[$scope.nameVariableForOptions] = $scope.repeat;
                $scope.options = attrs.options.replace(attrs.repeat, "repeat");

                const options = attrs.options.split(/\s+/);

                if (options[1] === 'as') {
                    $scope.subValue = {
                        value: options[0].split('.')[1],
                        text: options[2].split('.')[1]
                    };
                    $scope.$watch('repeat', newValue => {
                        if (newValue) {
                            setData({repeat: newValue});
                        }
                    });
                }

                $scope.$watch('valueOfFilterByText', (newValue, oldValue) => {
                    if (newValue !== oldValue) {
                        vscroll.update();
                    }
                });

                $scope.$watch('model', (newValue, oldValue) => {
                    if (newValue !== oldValue) {
                        setData({model: newValue});
                    }
                });

                $scope.select = value => {
                    $scope.close();
                    $scope.model = value;
                    ngModelController.$setViewValue($scope.model);
                };

                $scope.close = () => {
                    $scope.isVisible = false;
                };

                $scope.trigger = () => {
                    $scope.isVisible = !$scope.isVisible;

                    if ($scope.isVisible) {
                        vscroll.update();
                    }
                };

                const setData = params => {
                    if (options[1] === 'as' && params) {
                        const text = $filter('filter')(params.repeat || $scope.repeat, {[$scope.subValue.value]: params.model || $scope.model});
                        $scope.value = $scope.model && text.length ? text[0][$scope.subValue.text] : $scope.placeholder;
                    } else {
                        $scope.value = $scope.model || $scope.placeholder;
                    }
                };

                ngModelController.$render = () => {
                    $scope.model = ngModelController.$viewValue;
                    setData();
                };

                const vscroll = baron({
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
