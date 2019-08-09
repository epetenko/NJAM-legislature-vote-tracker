var jqueryNoConflict = jQuery;

// begin main function
jqueryNoConflict(document).ready(function(){




    

    initializeTabletopObject('https://docs.google.com/spreadsheets/d/193EUlvakkgEgblsUh4j76H5OZ6Ujm-zA6JC6ltJsWys/pubhtml');
    

});




// pull data from google spreadsheet
function initializeTabletopObject(dataSpreadsheet){
    Tabletop.init({
        key: dataSpreadsheet,
        callback: writeTableWith,
        simpleSheet: true,
        debug: false
    });
}

// create table headers
function createTableColumns(){

    /* swap out the properties of mDataProp & sTitle to reflect
    the names of columns or keys you want to display.
    Remember, tabletop.js strips out spaces from column titles, which
    is what happens with the More Info column header */

    var tableColumns =   [
   {'mDataProp': 'county', 'sTitle': 'County', 'sClass': 'left'},
        {'mDataProp': 'district', 'sTitle': 'District', 'sClass': 'left'},
        {'mDataProp': 'fy2018aid', 'sTitle': 'FY 2018 Christie aid proposal', 'sClass': 'left'},
        {'mDataProp': 'change', 'sTitle': 'Total Change under Dem proposal', 'sClass': 'left'},
        {'mDataProp': 'pctchange', 'sTitle': 'Percent Change', 'sClass': 'left'},
        {'mDataProp': 'fy2018aiddem', 'sTitle': 'Aid under Dem proposal', 'sClass': 'left'}

	];
    return tableColumns;

}


// create the table container and object
function writeTableWith(dataSource){

    jqueryNoConflict('#demo').html('<table cellpadding="0" cellspacing="0" border="0" class="display table table-hover" id="data-table-container"></table>');

    var oTable = jqueryNoConflict('#data-table-container').dataTable({
		'sPaginationType': 'bootstrap',
		'iDisplayLength': 25,
        'aaSorting': [[ 3, 'desc' ]],
        'aaData': dataSource, 
        'aoColumns': createTableColumns(),
        'oLanguage': {
            'sLengthMenu': '_MENU_ <br>records per page'
        }
    });
var pymChild = new pym.Child(); 

};






//define two custom functions (asc and desc) for string sorting
jQuery.fn.dataTableExt.oSort['string-case-asc']  = function(x,y) {
	return ((x < y) ? -1 : ((x > y) ?  0 : 0));
};

jQuery.fn.dataTableExt.oSort['string-case-desc'] = function(x,y) {
	return ((x < y) ?  1 : ((x > y) ? -1 : 0));
};

