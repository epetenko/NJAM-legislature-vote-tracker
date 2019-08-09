$(window).load(function() {

    var winwidth = $(window).width()
    var qsRegex;
    var buttonFilter;
    var $quicksearch = $('#quicksearch');
    var $container = $('#database')
    var timeout;
    var pymChild = null;
    var pymChild = new pym.Child();

$.ajax({
        url: "data/Assembly_Apr2019.json",
        id: "Assembly",
        nickname: "asm",
        success: writeTable
    })



$.ajax({
        url: "data/Senate_Apr2019.json",
        id: "Senate",
        nickname: "sen",
        success: writeTable
    });
    


    // function initializeTabletopObject(url) {
    //     Tabletop.init({
    //         key: url,
    //         callback: writeTable,
    //         simpleSheet: false,
    //         debug: false
    //     });
    // }

    function writeTable(data) {
        var yes_count_sen = 0;
        // var yes_count_asm = 0;
        var no_count_sen = 0;
        // var no_count_asm = 0;
        var other_count_sen = 0;
        // var other_count_asm = 0;
        
            $('#demo' + this.id).html('<div class="name">' + this.id + '</div><table cellpadding="0" cellspacing="0" border="0" class="party-table" id="data-table-container-' + this.id + '"></table>');
            var dataSource = data
            var oTable = $('#data-table-container-' + this.id).DataTable({
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
                    $rowv = $(row);
                    $rowv.attr('id', '#row' + data['lastname'])
                    if (data['yn'] == "Y") {
                        $('.vote', $rowv).addClass('support');
                            yes_count_sen += 1;
                        
                    } else if (data['yn'] == 'N') {
                        $('.vote', $rowv).addClass('oppose');
                        no_count_sen += 1;
                                           
                    } else {
                        $('.vote', $rowv).addClass('meh');
                            other_count_sen += 1;
                    
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

        $('#yes-total-' + this.nickname).append("<p>Yes: " + yes_count_sen + "</p>")
        $('#no-total-' + this.nickname).append("<p>No: " + no_count_sen + "</p>")
        $('#other-total-' + this.nickname).append("<p>Unknown/undecided: " + other_count_sen + "</p>")
        // $('#yes-total-asm').append("<p>Yes: " + yes_count_asm + "</p>")
        // $('#no-total-asm').append("<p>No: " + no_count_asm + "</p>")
        // $('#other-total-asm').append("<p>Unknown/undecided: " + other_count_asm + "</p>")

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
        return '<div id="element-item" class="child"><div class="category ' + v.filtercategory + '">' + v.filtercategory + '</div><img class="leg-image" src="Leg_photos/'+ v.piclink+'"></img><div class="name">'+ v.chamber +'. ' + v.title + '</div><div class="colorsubhed">' + v.Subhed1 + '</div><div class="boldsubhed"> District ' + v.Subhed2 + '</div><div class="description">' + v.Description + '</div><div class="readmore"><a target="_top" href="mailto:' + v.email + '">Email</a></div></div>';
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