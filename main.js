$(document).ready(function() {
    $('#payment-form').submit(function(event) {
        event.preventDefault();
        var formData = {
            'invoiceId': $('#invoiceId').val(),
            'amount': $('#amount').val(),
            'description': $('#description').val(),
            'email': $('#email').val(),
            'phone': $('#phone').val(),
            'cardNumber': $('#cardNumber').val(),
            'cardExpMonth': $('#cardExpMonth').val(),
            'cardExpYear': $('#cardExpYear').val(),
            'cardCvv': $('#cardCvv').val()
        };
        $.ajax({
            type: 'POST',
            url: 'https://api.monobank.ua/api/merchant/v1/invoice/send',
            headers: {
                'Content-Type': 'application/json',
                'X-Token': 'uCvdISjbrd2FHrsLAj1quAaX5j2N_ddmHm8_izsglRXw'
            },
            data: JSON.stringify(formData),
            success: function(response) {
                $('#response').html('<p>Payment was successful!</p>');
                console.log(response);
            },
            error: function(xhr, status, error) {
                $('#response').html('<p>Payment failed. Please try again later.</p>');
                console.log(error);
            }
        });
    });
});
