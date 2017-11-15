/*
 ~   DataTables ListView
 ~   ©2017 http://jeradrutnam.com/
 ~
 ~   This requires DataTables 1.10.12 or newer with DataTables Bootstrap Extension.
 ~
 ~   @summary     ListView
 ~   @description ListView tables plug-in for DataTables
 ~   @version     1.0.0
 ~   @file        dataTables.listView.js
 ~   @author      Jerad Rutnam (www.jeradrutnam.com)
 ~   @copyright   Copyright 2016-2017 JERAD RUTNAM™.
 ~
 ~   This source file is free software, available under the following license:
 ~      
 ~          MIT license - http://datatables.net/license/mit
 ~
 ~   This source file is distributed in the hope that it will be useful, but
 ~   WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 ~   or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 ~
 ~   For details please refer to: http://www.datatables.net
*/

(function(window, document, undefined){

    var factory = function($, DataTable) {
        "use strict";
        
        /* Set the defaults for DataTables initialisation */
//        $.extend(true, DataTable.defaults, {
//            bSortCellsTop: true,
//            responsive: false,
//            autoWidth: false,
//            language: {
//                searchPlaceholder: 'Filter by ...',
//                search: ''
//            }
//        });
        
        var listViewExtend = function(settings, opts) {

            // Sanity check that we are using DataTables 1.10 or newer
            if (!DataTable.versionCheck || !DataTable.versionCheck('1.10.12')) {
                throw 'DataTables Responsive requires DataTables 1.10.12 or newer';
            }

            this.s = {
                dt: new DataTable.Api(settings),
                columns: []
            };

            // Check if responsive has already been initialised on this table
            if (this.s.dt.settings()[0].listView) {
                return;
            }

            // details is an object, but for simplicity the user can give it as a string
            if (opts && typeof opts.details === 'string') {
                opts.details = { type: opts.details };
            }
            
            this.c = $.extend( true, {}, listViewExtend.defaults, DataTable.defaults.listView, opts );
            settings.listView = this;
            this._constructor();

        };
        
        listViewExtend.prototype = {
            
            
            _constructor: function(){
                
                this.c.layout = (this.c.layout == undefined) ? this.c.listView.layout : this.c.layout;
                this.c.columnFilters = (this.c.columnFilters == undefined) ? this.c.listView.columnFilters : this.c.columnFilters;
                this.c.checkbox = (this.c.checkbox == undefined) ? this.c.listView.checkbox : this.c.checkbox;
                this.c.checkboxTemplate = (this.c.checkboxTemplate == undefined) ? this.c.listView.checkboxTemplate : this.c.checkboxTemplate;
                this.c.grid = (this.c.grid == undefined) ? this.c.listView.grid : this.c.grid;
                this.c.gridTemplate = (this.c.gridTemplate == undefined) ? this.c.listView.gridTemplate : this.c.gridTemplate;
                
		        var dt = this.s.dt;
                var elem = $('table', dt.table().container()).context;

                var ROW_SELECTED_CLASS = 'DTTT_selected';
                
                $(elem).addClass('dataTable-listView');

                if(this.c.layout){
                    $(elem)
                        .addClass('datatables-listview-layout')
                        .removeClass('form-inline');
                    
                    var dataTablesLengthElem = $('.dataTables_length', elem).parent().prop('class', 'col-sm-2');
                    var dataTablesInfoElem = $('.dataTables_info', elem).parent().prop('class', 'col-sm-4');
                    var dataTablesPaginateElem = $('.dataTables_paginate', elem).parent().prop('class', 'col-sm-6');
                    
                    $('.row:first-child', elem).append('<div class="col-sm-6"><div id="' + dt.table().context[0].sTableId + '_tools" class="dataTables_tools"></div></div>');
                    $('.row:last-child', elem).prepend(dataTablesLengthElem);
                }
                
                if(this.c.grid){
                    var toolsContainer = (this.c.layout) ? '.dataTables_tools' : '.dataTables_filter';
                    var gridTemplate = this.c.gridTemplate;
                    
                    dt.table().page.len(12).draw();
                    
                    $('.dataTables_length', dt.containers()[0]).find('select').html('<option value="12">12</option>' +
                            '<option value="24">24</option>'+
                            '<option value="48">48</option>' +
                            '<option value="96">96</option>');
                    
                    var btnGridView = $('<button class="btn btn-default"><i class="fw fw-grid"></i></button>')
                                            .appendTo($(toolsContainer, elem))
                                            .on('click', function() {
                                                $(dt.table().node()).addClass('grid-view');
                                                
                                                dt.rows().nodes().each(function () {
                                                    $(this).addClass(gridTemplate);
                                                });
                                                
                                                $(dt.table)
                                                    .off('draw')
                                                    .on('draw', function () {
                                                        dt.rows().nodes().each(function () {
                                                            $(this).addClass(gridTemplate);
                                                        });
                                                });
                                            });
                    
                    var btnListView = $('<button class="btn btn-default"><i class="fw fw-list"></i></button>')
                                            .appendTo($(toolsContainer, elem))
                                            .on('click', function() {
                                                $(dt.table().node()).removeClass('grid-view');
                                                
                                                dt.rows().nodes().each(function () {
                                                    $(this).removeClass(gridTemplate);
                                                });
                                                
                                                $(dt.table)
                                                    .off('draw')
                                                    .on('draw', function () {
                                                        dt.rows().nodes().each(function () {
                                                            $(this).removeClass(gridTemplate);
                                                        });
                                                });
                                            });
                }
                
                if(this.c.columnFilters){
                    
                    //$('thead', elem).append('<tr class="filter-row"><th colspan="' + dt.table().columns()[0].length + '"></th></tr>');
                    
                    var filterRow = $('<tr class="filter-row"></tr>').appendTo($('thead', elem));
                    
                    dt.table().columns().every(function(i) {
                        var column = this;
                        
                        if( ($(column.header()).data('filter')) && ($(column.header()).data('filter') !== 'no-filter') ){
                            
                            if($(column.header()).data('filter') == 'select'){
                                var select = $('<select class="form-control"><option value="">All</option></select>')
                                                .on('change', function() {
                                                    var val = $.fn.dataTable.util.escapeRegex(
                                                        $(this).val()
                                                    );

                                                    column
                                                        .search(val ? '^' + val + '$' : '', true, false)
                                                        .draw();
                                                })
                                                .appendTo(filterRow)
                                                .wrap('<th></th>');
                                
                                if ($(column.nodes()).attr('data-search')) {
                                    var titles = [];
                                    column.nodes().unique().sort().each(function (d, j) {
                                        var title = $(d).attr('data-display');
                                        if ($.inArray(title, titles) < 0) {
                                            titles.push(title);
                                            if (title !== undefined) {
                                                select.append('<option value="' + title + '">' + title + '</option>');
                                            }
                                        }
                                    });
                                } else {
                                    column.data().unique().sort().each(function (d, j) {
                                        if(typeof d == 'object'){
                                            console.warn('"data-search" & "data-display" attributes are required for this column. Please read the documentation for more details');
                                            return;
                                        }
                                        else {
                                            select.append('<option value="' + d + '">' + d + '</option>');
                                        }
                                    });
                                }
                            }
                            else {
                                $('<input type="text" class="form-control" placeholder="Search for ' + $(column.header()).html() + '">')
                                    .on('keyup change', function() {
                                        var val = $.fn.dataTable.util.escapeRegex(
                                            $(this).val()
                                        );

                                        column
                                            .search($(this).val())
                                            .draw();
                                    })
                                    .appendTo(filterRow)
                                    .wrap('<th></th>');
                            }

                        }
                        else {
                            $('<th></th>').appendTo(filterRow);
                        }
                    });               
                    
                }
                
                if(this.c.checkbox){
                    
                    var filterRow = $('tr.filter-row', dt.table().header());
                    var checkboxTemplate = this.c.checkboxTemplate;
                    
                    if(filterRow){
                       filterRow.prepend('<th></th>');
                    }
                    
                    $(checkboxTemplate)
                            .on('change', function(e) {
                                if(this.checked) {
                                    dt.table().rows().every(function(i) {
                                        $(this.node()).addClass(ROW_SELECTED_CLASS);
                                        $('td.select-checkbox input[type=checkbox]', this.node()).prop('checked', true);
                                    });
                                }
                                else{
                                    dt.table().rows().every(function(i) {
                                        $(this.node()).removeClass(ROW_SELECTED_CLASS);
                                        $('td.select-checkbox input[type=checkbox]', this.node()).prop('checked', false);
                                    });
                                }

                            })
                            .prependTo($('tr:first-child', dt.table().header()))
                            .wrap('<th class="select-all-checkox"></th>');
                    
                    dt.table().rows().every(function(i) {
                        $(checkboxTemplate)
                            .on('change', function(e) {
                                if(this.checked) {
                                    $(e.target).closest('tr').addClass(ROW_SELECTED_CLASS);
                                }
                                else{
                                    $(e.target).closest('tr').removeClass(ROW_SELECTED_CLASS);
                                }

                            })
                            .prependTo(this.node())
                            .wrap('<td class="select-checkbox"></td>');
                    });
                    
                }
                

//                //Search input default styles override
//                var search_input = elem.closest('.dataTables_wrapper').find('div[id$=_filter] input');
//                search_input.before('<i class="fw fw-search search-icon"></i>').removeClass('input-sm');
//
//                // Create sorting dropdown menu for list table advance operations
//                var dropdownmenu = $('<ul class="dropdown-menu arrow arrow-top-right dark sort-list add-margin-top-2x"><li class="dropdown-header">Sort by</li></ul>');
//                $('.sort-row th', elem).each(function () {
//                    if (!$(this).hasClass('no-sort')) {
//                        dropdownmenu.append('<li><a href="#' + $(this).html() + '" data-column="' + $(this).index() + '">' + $(this).html() + '</a></li>');
//                    }
//                });
//
//                //Append advance operations to list table toolbar
//                $('.dataTable.list-table').closest('.dataTables_wrapper').find('.dataTablesTop .dataTables_toolbar').html('' +
//                    '<ul class="nav nav-pills navbar-right remove-margin" role="tablist">' +
//                    '<li><button data-click-event="toggle-select" class="btn btn-default btn-primary">Select</li>' +
//                    '<li class="select-all-btn" style="display:none;"><button data-click-event="toggle-select-all" class="btn btn-default btn-primary">Select All</li>' +
//                    '<li><button class="btn btn-default" data-toggle="dropdown"><i class="fw fw-sort"></i></button>' + dropdownmenu[0].outerHTML + '</li>' +
//                    '</ul>'
//                );
//
//                //Sorting dropdown menu select function
//                $('.dataTables_wrapper .sort-list li a').click(function () {
//                    $(this).closest('li').siblings('li').find('a').removeClass('sorting_asc').removeClass('sorting_desc');
//
//                    var thisTable = $(this).closest('.dataTables_wrapper').find('.dataTable').dataTable();
//
//                    if (!($(this).hasClass('sorting_asc')) && !($(this).hasClass('sorting_desc'))) {
//                        $(this).addClass('sorting_asc');
//                        thisTable.fnSort([
//                            [$(this).attr('data-column'), 'asc']
//                        ]);
//                    } else if ($(this).hasClass('sorting_asc')) {
//                        $(this).switchClass('sorting_asc', 'sorting_desc');
//                        thisTable.fnSort([
//                            [$(this).attr('data-column'), 'desc']
//                        ]);
//                    } else if ($(this).hasClass('sorting_desc')) {
//                        $(this).switchClass('sorting_desc', 'sorting_asc');
//                        thisTable.fnSort([
//                            [$(this).attr('data-column'), 'asc']
//                        ]);
//                    }
//                });
//
//                //Enable/Disable selection on rows
//                $('.dataTables_wrapper').off('click', '[data-click-event=toggle-select]');
//                $('.dataTables_wrapper').on('click', '[data-click-event=toggle-select]', function () {
//                    var button = this,
//                        thisTable = $(this).closest('.dataTables_wrapper').find('.dataTable').dataTable();
//                    if ($(button).html() == 'Select') {
//                        thisTable.api().rows().every(function () {
//                            $(this.node()).attr('data-type','selectable');
//                        });
//                        thisTable.addClass("table-selectable");
//                        $(button).addClass("active").html('Cancel');
//                        $(button).closest('li').siblings('.select-all-btn').show();
//                    } else if ($(button).html() == 'Cancel'){
//                        thisTable.api().rows().every(function () {
//                            $(this.node()).removeAttr('data-type');
//                            $(this.node()).removeClass(ROW_SELECTED_CLASS);
//                        });
//                        thisTable.removeClass("table-selectable");
//                        $(button).removeClass("active").html('Select');
//                        $(button).closest('li').siblings('.select-all-btn').hide();
//                    }
//                });
//
//                //Select/Deselect all rows functions
//                $('.dataTables_wrapper').off('click', '[data-click-event=toggle-select-all]');
//                $('.dataTables_wrapper').on('click', '[data-click-event=toggle-select-all]', function () {
//                    var button = this,
//                        thisTable = $(this).closest('.dataTables_wrapper').find('.dataTable').dataTable();
//                    if ($(button).html() == 'Select All') {
//                        thisTable.api().rows().every(function () {
//                            $(this.node()).addClass(ROW_SELECTED_CLASS);
//                            $(button).html('Deselect All');
//                        });
//                    } else if ($(button).html() == 'Deselect All') {
//                        thisTable.api().rows().every(function () {
//                            $(this.node()).removeClass(ROW_SELECTED_CLASS);
//                            $(button).html('Select All');
//                        });
//                    }
//                });
//
//
//                //Event for row select/deselect
//                $('body').on('click', '[data-type=selectable]', function() {
//                    $(this).toggleClass(ROW_SELECTED_CLASS);
//                    var button = this,
//                        thisTable = $(this).closest('.dataTables_wrapper').find('.dataTable').dataTable();
//
//                    thisTable.api().rows().every(function () {
//                        if (!$(this.node()).hasClass(ROW_SELECTED_CLASS)) {
//                            $(button).closest('.dataTables_wrapper').find('[data-click-event=toggle-selected]').html('Select All');
//                        }
//                    });
//                });
//
//                //delete selected rows
//                $('[data-click-event=delete-selected-rows]').click(function () {
//                    var thisTable = $(this).closest('.dataTables_wrapper').find('.dataTable').dataTable();
//                    thisTable.api().rows('.' + ROW_SELECTED_CLASS).remove().draw(false);
//                });

            }
        }
        
        listViewExtend.defaults = {
            listView:{
                layout: true,
                columnFilters: false,
                checkbox: true,
                checkboxTemplate: '<input type="checkbox">',
                grid: true,
                gridTemplate: 'col-xs-12 col-sm-6 col-md-3 col-lg-2'
            },
//            bSortCellsTop: true,
//            responsive: false,
//            autoWidth: false,
//            language: {
//                searchPlaceholder: 'Filter by ...',
//                search: ''
//            }
        }
        
        /**
         * Version information
         *
         * @name listViewExtend.version
         * @static
         */
        listViewExtend.version = '1.0.0';

        $.fn.dataTable.listViewExtend = listViewExtend;
        $.fn.DataTable.listViewExtend = listViewExtend;

        // Attach a listener to the document which listens for DataTables initialisation
        // events so we can automatically initialise
        //$(document).on('preInit.dt.dte', function(e, settings, json) {            
        $(document).on('init.dt', function(e, settings, json) {  
            if (e.namespace !== 'dt') {
                return;
            }

//            if ( $(settings.nTable).hasClass('dte') ||
//                 $(settings.nTable).hasClass('dt-extended') ||
//                 settings.oInit.listView ||
//                 DataTable.defaults.listView ||
//            ) {
                var init = settings.oInit.listView;

                if (init) {
                    new listViewExtend (settings, $.isPlainObject(init) ? init : {});
                }
            //}
        });
        
        return listViewExtend;

    };

    // Define as an AMD module if possible
    if (typeof define === 'function' && define.amd){
        define(['jquery', 'datatables'], factory);
    }
    else if (typeof exports === 'object'){
        // Node/CommonJS
        factory(require('jquery'), require('datatables'));
    }
    else if (jQuery && !jQuery.fn.dataTable.listViewExtend) {
        // Otherwise simply initialise as normal, stopping multiple evaluation
        factory(jQuery, jQuery.fn.dataTable);
    }

})(window, document);