$(window).load(function() {

    var winwidth = $(window).width()
    var qsRegex;
    var buttonFilter;
    var $quicksearch = $('#quicksearch');
    var $container = $('#database')
    var timeout;
    var pymChild = null;
    var pymChild = new pym.Child();

    // Get this from the Google Spreadsheet for the general read-in:
    var public_spreadsheet_url = '1CrPjbRGhj0bMipCKEMSho09ZEG1GOrOF8-p3vz-Pj-g';

    // Call the Google Spreadsheet as a regular JSON to get latest timestamp which is not included in Tabletop.js
    var timestampdata = "https://spreadsheets.google.com/feeds/cells/" + public_spreadsheet_url + "/2/public/full?alt=json"

    initializeTabletopObject(public_spreadsheet_url);

    $.ajax({
        url: timestampdata,
        dataType: "jsonp",
        success: function(data) {
            // Get timestamp and parse it to readable format


            var date = data.feed.updated.$t

            var MM = {
                Jan: "Jan.",
                Feb: "Feb.",
                Mar: "March",
                Apr: "April",
                May: "May",
                Jun: "June",
                Jul: "July",
                Aug: "Aug.",
                Sep: "Sept.",
                Oct: "Oct.",
                Nov: "Nov.",
                Dec: "Dec."
            }

            var formatdate = String(new Date(date)).replace(
                /\w{3} (\w{3}) (\d{2}) (\d{4}) (\d{2}):(\d{2}):[^(]+\(([A-Z]{3})\)/,
                function($0, $1, $2, $3, $4, $5, $6) {
                    return MM[$1] + " " + $2 + ", " + $3 + " at " + $4 % 12 + ":" + $5 + (+$4 > 12 ? "PM" : "AM") + " " + $6
                }
            )


            $('.updated').append("Last updated " + formatdate)
        },
    });

    // initialize the table itself
    function initializeTabletopObject(url) {
        Tabletop.init({
            key: url,
            callback: writeTable,
            simpleSheet: false,
            debug: false
        });
    }

    function writeTable(data, tabletop) {
        //These will hold teh yes/no/other totals:
        var yes_count_sen = 0;
        var yes_count_asm = 0;
        var no_count_sen = 0;
        var no_count_asm = 0;
        var other_count_sen = 0;
        var other_count_asm = 0;
        
        //creating the two tables
        $.each(tabletop.sheets(), function(i, v) {
            $('#demo' + i).html('<div class="name">' + i + '</div><table cellpadding="0" cellspacing="0" border="0" class="party-table" id="data-table-container-' + i + '"></table>');
            var dataSource = tabletop.sheets(i).all()
            var oTable = $('#data-table-container-' + i).DataTable({
                'paging': false,
                "bInfo": false,
                // 'sPaginationType': 'bootstrap',
                'iDisplayLength': 120,
                'aaSorting': [
                    [3, 'desc']
                ],
                'aaData': dataSource,
                'aoColumns': createTableColumns(),
                // 'oLanguage': {
                //     'sLengthMenu': '_MENU_ <br>records per page'
                // },
                'createdRow': function(row, data, dataIndex) {
                    // tests whether value is Y or N to add color and sum the totals:
                    $rowv = $(row);
                    $rowv.attr('id', '#row' + data['lastname'])
                    if (data['yn'] == "Y") {
                        $('.vote', $rowv).addClass('support');
                        if (data['chamber'] == 'Sen') {
                            yes_count_sen += 1;
                        } else if (data['chamber'] == 'Asm') {
                            yes_count_asm += 1;
                        }
                    } else if (data['yn'] == 'N') {
                        $('.vote', $rowv).addClass('oppose');
                        if (data['chamber'] == 'Sen') {
                            no_count_sen += 1;
                        } else if (data['chamber'] == 'Asm') {
                            no_count_asm += 1;
                        }                    
                    } else {
                        $('.vote', $rowv).addClass('meh');
                        if (data['chamber'] == 'Sen') {
                            other_count_sen += 1;
                        } else if (data['chamber'] == 'Asm') {
                            other_count_asm += 1;
                        }
                    }
                },
            });

            $(":input").keyup(function() {
                // Filter on the column (the index) of this element
                oTable.search(this.value).draw();
            });

            $('.party-table tbody').on('click', 'tr', function() {
                    var tr = $(this).closest('tr');
                    var row = oTable.row( tr );

                    if ( row.child.isShown() ) {
                    // This row is already open - close it
                        row.child.hide();
                        tr.addClass('hidden-details')
                        $('tr.hidden-details td.details-control').html('&#9660;')
                        tr.removeClass('shown');
                    }
                    else {
                    // Open this row
                        row.child( format(row.data()) ).show();
                        tr.addClass('shown');
                        $('tr.shown td.details-control').html('&#9650;')
                    };
                    pymChild.sendHeight();

            })          

        })

        //append the vote totals:
        $('#yes-total-sen').append("<p>Yes (Y): " + yes_count_sen + "</p>")
        $('#no-total-sen').append("<p>No (N): " + no_count_sen + "</p>")
        $('#other-total-sen').append("<p>Abstained/Didn't Vote (D): " + other_count_sen + "</p>")
        $('#yes-total-asm').append("<p>Yes: " + yes_count_asm + "</p>")
        $('#no-total-asm').append("<p>No: " + no_count_asm + "</p>")
        $('#other-total-asm').append("<p>Abstained/Didn't Vote (D): " + other_count_asm + "</p>")

        pymChild.sendHeight();

    }
    // create table headers
    function createTableColumns() {
        var tableColumns = [
            {
                "className":      'details-control',
                "orderable":      false,
                "data":           null,
                "defaultContent": '&#9660'
            },
            {
                'mDataProp': 'namesansparty',
                'sTitle': 'Name',
                'sClass': 'left title'
            },
            {
                'mDataProp': 'filtercategory',
                'sTitle': 'Party',
                'sClass': 'left district'
            },
            {
                'mDataProp': 'yn',
                'sTitle': 'Vote',
                'sClass': 'vote'
            }
        ];
        return tableColumns;
    }

    function format(v) {
        //the function that shows the detailed info on legislators:
        return '<div id="element-item" class="child"><div class="category ' + v.filtercategory + '">' + v.filtercategory + '</div><img class="leg-image" src="Leg_photos/'+ v.piclink+'"></img><div class="name">'+ v.chamber +'. ' + v.title + '</div><div class="colorsubhed">' + v.subhed1 + '</div><div class="boldsubhed"> District ' + v.subhed2 + '</div><div class="description">' + v.description + '</div><div class="readmore"><a target="_top" href="mailto:' + v.subhed3 + '">Email</a></div></div>';
    }

    // var pymChild = new pym.Child(); 


    //define two custom functions (asc and desc) for string sorting
    jQuery.fn.dataTableExt.oSort['string-case-asc'] = function(x, y) {
        return ((x < y) ? -1 : ((x > y) ? 0 : 0));
    };

    jQuery.fn.dataTableExt.oSort['string-case-desc'] = function(x, y) {
        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
    };



});