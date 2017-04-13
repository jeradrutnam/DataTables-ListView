# List View

### Basic usage

List View is initialised using the `list-view` option in the DataTables constructor - a simple boolean `true` will enable the feature. Further options can be specified using this option as an object - see the documentation for details.

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
            gridView: true
        }
    });
});
```
### License

Licenses this source under the Apache License, Version 2.0 ([LICENSE](LICENSE)), You may not use this file except in compliance with the License.
