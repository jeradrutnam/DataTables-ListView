# List View

### Basic usage

List View is initialised using the `list-view` option in the DataTables constructor - a simple boolean `true` will enable the feature. Further options can be specified using this option as an object - see the documentation for details.

Example:

```js
$(document).ready(function() {
    $('#myTable').DataTable( {
    	list-view: true
    });
});
```

