// READ records
/* global $ */

function readRecords() {
    $.get("/songs/", {}, function (data, status) {
        data.forEach(function(value) {
            var row = '<tr id="row_id_'+ value.id +'">'
			+ displayColumns(value)
				+ '</tr>';
            $('#songs').append(row);
        });
    });
}

function displayColumns(value) {
    return 	'<td>'+value.id+'</td>'
            + '<td class="title">'+value.title+'</td>'
			+ '<td class="abstract">'+value.abstract.substring(0,255)+' ...</td>'
			+ '<td class="authors">'+value.name+'</td>'
			+ '<td align="center">'
			+	'<button onclick="viewRecord('+ value.id +')" class="btn btn-edit">Update</button>'
			+ '</td>'
			+ '<td align="center">'
			+	'<button onclick="deleteRecord('+ value.id +')" class="btn btn-danger">Exclude</button>'
			+ '</td>';
}

function addRecord() {
    $('#id').val('');
    $('#title').val('');
    $('#abstract').val('');
    $('#authors').val('');
    $('#keywords').val('');
    $('#url').val('');

    $('#myModalLabel').html('Add New Song');
    $('#add_new_record_modal').modal('show');
}

function viewRecord(id) {
    var url = "/songs/" + id;

    $.get(url, {}, function (data, status) {
        //bind the values to the form fields
        $('#title').val(data.title);
        $('#abstract').val(data.abstract);
        $('#authors').val(data.authors);
        $('#keywords').val(data.keywords);
        $('#url').val(data.url);

        $('#id').val(id);
        $('#myModalLabel').html('Edit Song');

        $('#add_new_record_modal').modal('show');
    });
}
function saveRecord() {
    var formData = $('#record_form').serializeObject();
    if(formData.id) {
        updateRecord(formData);
    } else {
        createRecord(formData);
    }
}

function createRecord(formData) {
    $.ajax({
        url: '/songs/',
        type: 'POST',
        accepts: {
            json: 'application/json'
        },
        data: formData,
        success: function(data) {
            $('#add_new_record_modal').modal('hide');

            var row = '<tr id="row_id_'+ data.id +'">'
			+ displayColumns(data)
				+ '</tr>';
            $('#songs').append(row);
        } 
    });
}

function updateRecord(formData) {
    $.ajax({
        url: '/songs/'+formData.id,
        type: 'PUT',
        accepts: {
            json: 'application/json'
        },
        data: formData,
        success: function(data) {
$('#row_id_'+formData.id+'>td.title').html(formData.title);
            $('#row_id_'+formData.id+'>td.abstract').html(formData.abstract.substring(0,255)+' ...');
            $('#row_id_'+formData.id+'>td.authors').html(formData.authors);
            $('#add_new_record_modal').modal('hide');
        } 
    });
}
function deleteRecord(id) {
    $.ajax({
        url: '/songs/'+id,
        type: 'DELETE',
        success: function(data) {
            $('#row_id_'+id).remove();
        }
    });
}
$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

