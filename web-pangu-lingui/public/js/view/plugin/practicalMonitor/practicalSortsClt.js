$(function () {

  $('#itf_business_sel').change(function () {
    $.ajax({
      url: '/practicalMonitor/practicalSortsChange', data: {
        date: $('#date').val(),
				chartList: $('#chartList').val(),
				selected: $('#itf_business_sel').val()
      }, type: 'get', dataType: 'json', success: function success(data) {
        var a1 = document.getElementById('detail1');
        a1.href = a1.href + '&selectVal=' + $('#itf_business_sel').val()
					+ '&date=' + $('#date').val();
// console.log($('#itf_business_sel').val());
        var a2 = document.getElementById('detail2');
        a2.href = a2.href + '&selectVal=' + $('#itf_business_sel').val()
					+ '&date=' + $('#date').val();
// console.log(a1.href);
        var a3 = document.getElementById('detail3');
        a3.href = a3.href + '&selectVal=' + $('#itf_business_sel').val()
					+ '&date=' + $('#date').val();
        $('#tab1 .list ol').empty();
        for (var i = 0; i < data.output.length; i++) {
          $('#tab1 .list').find('ol').append('<li>' + data.output[i].clerk
						+ '<strong class="text-error pull-right">' + data.output[i].pTime + '</strong></li>');
        };
        $('#tab2 .list ol').empty();
        
        for (var i = 0; i < data.output1.length; i++) {
          $('#tab2 .list').find('ol').append('<li>' + data.output1[i].clerk
						+ '<strong class="text-error pull-right">' + data.output1[i].pTime + '</strong></li>');
        }
        $('#tab3 .list ol').empty();
        for (var i = 0; i < data.output2.length; i++) {
          $('#tab3 .list').find('ol').append('<li>' + data.output2[i].businessHall
						+ '<strong class="text-error pull-right">' + data.output2[i].avgHall + '</strong></li>');
        }
      }
    });
  });

/*	function showDetail(){
window.location.href = "/practicalMonitor/clerkSort.html?chartList=" + $("#chartList").val()
+ "&_pjax=true" + "&business=" + $("#itf_business_sel").val();
}
window.showDetail = showDetail;*/
});


