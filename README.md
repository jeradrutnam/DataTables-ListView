# [List View](http://jeradrutnam.github.io/DataTables-ListView/)

### Quick Start

1. Import required CSS files in `<head>` tag
```html
<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdn.datatables.net/1.10.16/css/dataTables.bootstrap.min.css" rel="stylesheet">
<link href="css/dataTables.listView.css" rel="stylesheet">
```
2. Import required JS files just before the closing `</body>` tag
```html
<script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="https://cdn.datatables.net/1.10.16/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/1.10.16/js/dataTables.bootstrap.min.js"></script>
<script src="js/dataTables.listView.js"></script>
```
And follow the usage example below.

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
