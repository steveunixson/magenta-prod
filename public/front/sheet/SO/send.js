$('#table tr').click(function () {
  $(this).addClass('selected').siblings().removeClass('selected');
  const value = $(this).find('td:first').html();
  alert(value);
});

$('.ok').on('click', (e) => {
  alert($('#table tr.selected td:first').html());
});
