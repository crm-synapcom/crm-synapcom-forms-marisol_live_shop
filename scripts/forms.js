$(document).ready(function() {
    // base configuration
    var success_message = 'Obrigado por se cadastrar.'
    var error_message = 'Você já é cadastrado. Acompanhe nossos lançamentos e ofertas por e-mail.'
    var validate = {
        'name': true
    }

    $('#contact_name').on('focusout', function() {
        var input = $(this);
        var test = input.val();
        if(test){
            input.removeClass('invalid').addClass('valid');
        }
        else{
            input.removeClass('valid').addClass('invalid');
        }
    });

    $('#contact_email').on('focusout', function() {
        var input=$(this);
        var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        var test=re.test(input.val());
        if(test){
            input.removeClass('invalid').addClass('valid');
        }
        else{
            input.removeClass('valid').addClass('invalid');
        }
    });

    $('#contact_submit').click(function(event){
        event.preventDefault();

        // verifying inputs
        if($('#contact_name').hasClass('invalid') && validate.name){
            alert('Por favor, insira seu nome.')
            return
        }
        if($('#contact_email').hasClass('invalid')){
            alert('Por favor, insira um email válido.')
            return
        }
        
        if($('#contact_privacy_policy').is(':checked') == false){
            alert('Para se cadastrar é preciso concordar com a política de privacidade.')
            return
        }
        // getting URL parameters
        var self = window.location.toString();
        var querystring = self.split("?");
        if (querystring.length > 1) {
            var pairs = querystring[1].split("&");
            for (i in pairs) {
                var keyval = pairs[i].split("=");
                if (sessionStorage.getItem(keyval[0]) === null) {
                sessionStorage.setItem(keyval[0], decodeURIComponent(keyval[1]));
                }
            }
        }

        var rest_data = {
            'name': $('#contact_name').val(),
            'email': $('#contact_email').val(),
            'utm_source': sessionStorage.getItem('utm_source') == null ? '' : sessionStorage.getItem('utm_source'),
            'utm_medium': sessionStorage.getItem('utm_medium') == null ? '' : sessionStorage.getItem('utm_medium'),
            'utm_campaign': sessionStorage.getItem('utm_campaign') == null ? '' : sessionStorage.getItem('utm_campaign'),
            'utm_term': sessionStorage.getItem('utm_term') == null ? '' : sessionStorage.getItem('utm_term'),
            'utm_content': sessionStorage.getItem('utm_content') == null ? '' : sessionStorage.getItem('utm_content'),
            'source_page': querystring[0],
            'privacy_policy': ''
        }

        $.ajax({
            url: 'https://subscribeformsbackend.azurewebsites.net/api/marisol-live_shop',
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(rest_data),
            success: function() {
                alert(success_message);
                $('input').each(function() {
                    if($(this).is(':text')) {
                        $(this).val('')
                    }
                })
            },
            error: function(response) {
                var r = response.responseJSON.message;
                if(r == 'subscriber already exists') {
                    alert(error_message);
                } else {
                    
                }
            }
        })

    });
});