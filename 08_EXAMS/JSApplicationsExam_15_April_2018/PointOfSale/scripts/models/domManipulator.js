function showInfo() {
    let total = $('input[name="total"]').val();
    let qty = $('input[name="qty"]').val();
    let price = $('input[name="price"]').val();
    let subTotal = qty * price;
    $('#sub_total').text('Sub-total: ');
    $('#total').text(total);
    if(!isNaN(subTotal)){
        $('#sub_total').text('Sub-total: ' + subTotal.toFixed(2));
        $('#total').text((Number(total) + subTotal).toFixed(2));
    }



}