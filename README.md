# [List View](http://jeradrutnam.github.io/DataTables-ListView/)

### Basic usage

List View is initialised using the `list-view` option in the DataTables constructor - a simple boolean `true` will enable the feature. Further options can be specified using this option as an object - see the [documentation](http://jeradrutnam.com/DataTables-ListView/) for details.

Example:

```js
$(document).ready(function(){
    $('#myTable').DataTable({
    	listView: true
    });
});
```

#### OR

```js
$(document).ready(function(){
    $('#myTable').DataTable({
    	listView: {
            layout: true,
            columnFilters: false,
            checkbox: false,
            checkboxTemplate: '<input type="checkbox">',
            grid: true,
            gridTemplate: 'col-xs-12 col-sm-6 col-md-3 col-lg-2'
        }
    });
});
```
### License

Licenses this source under the Apache License, Version 2.0 ([LICENSE](LICENSE)), You may not use this file except in compliance with the License.
