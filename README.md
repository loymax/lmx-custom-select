# lmx custom select

Customizable select for AngularJS

## Demo

![gif demo](https://raw.githubusercontent.com/loymax/lmx-custom-select/master/demo-lmx-custom-select.gif)

Or see demo on [this link](https://loymax.github.io/lmx-custom-select/)

## Getting Started 

1. You need to connect a lot of dependencies:

* [Baron](https://github.com/Diokuz/baron)
* [Modernizr](https://modernizr.com/download?addtest-setclasses)
* [mobile-detect.js](https://github.com/hgoebl/mobile-detect.js) (and [add tests for Modernizr](https://github.com/loymax/lmx-custom-select/wiki/Add-tests-for-Modernizr))
* [ng-outside-click](https://github.com/abrkt/ng-outside-click)

2. Add lmx-custom-select.min.js

3. Add to the page [minimum required CSS](https://github.com/loymax/lmx-custom-select/wiki/minimum-required-CSS) for styling

4. Add modules

```javascript
var App = angular.module('app', ['ngOutsideClick', 'lmxCustomSelect']);
```

5. Make select!

```html
<div
    lmx-custom-select
    ng-model="date"
    repeat="dates"
    placeholder="Day"
    caption="Select a day"
    options="d for d in dates track by d"
></div>
```

## Options

* ng-model — binds the value of select to application data
* repeat — data for list of values to select
* placeholder — placeholder text if value is not selected
* caption — title in the drop-down list
* options — analog of options for select
* filter-by-text — filtering values

## npm

```npm install lmx-custom-select```
