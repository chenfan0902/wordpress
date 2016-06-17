$(function() {

  $('#itf_business_sel').change(function () {
		$.ajax({
			url: '/practicalMonitor/practicalSortsChange', data: {
				date: $('#date').val(), chartList: $('#chartList').val(), selected: $('#itf_business_sel').val()
			}, type: 'get', dataType: 'json', success: function success(data) {
				console.log($('#itf_business_sel').val());
				$("#detail").href = $("#detail").href + "&selectVal=" +  $("#itf_business_sel").val();
				console.log($("#detail").href);
				for (var i = 0; i < data.output.length; i++) {
					$('#tab1 .list').find('ol').append('<li>' + data.output[i].clerk + '<strong class="text-error pull-right">' + data.output[i].pTime + '</strong></li>');
				}
				$('#tab2 .list ol').empty();
				for (var i = 0; i < data.output1.length; i++) {
					$('#tab2 .list').find('ol').append('<li>' + data.output1[i].clerk + '<strong class="text-error pull-right">' + data.output1[i].pTime + '</strong></li>');
				}
				$('#tab3 .list ol').empty();
				for (var i = 0; i < data.output2.length; i++) {
					$('#tab3 .list').find('ol').append('<li>' + data.output2[i].businessHall + '<strong class="text-error pull-right">' + data.output2[i].avgHall + '</strong></li>');
				}
			}
		})
	})

/*	function showDetail(){
		window.location.href = "/practicalMonitor/clerkSort.html?chartList=" + $("#chartList").val() + "&_pjax=true" + "&business=" + $("#itf_business_sel").val();
	}
	window.showDetail = showDetail;*/
})


