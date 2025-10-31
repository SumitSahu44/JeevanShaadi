window.fbAsyncInit = function() {
    FB.init({
        appId: '449674571849301', // Set YOUR APP ID
        status: true, // check login status
        cookie: true, // enable cookies to allow the server to access the session
        xfbml: true // parse XFBML
    });
};

function loginbyfb() {
    FB.login(function(response) {
        if (response.authResponse) {
            if (response.status === 'connected')
                getUserInfo();
        } else {
            console.log('Wrong Attempt.');
        }
    }, {
        scope: 'public_profile,email,user_photos'
    });
}

// Load the SDK asynchronously
(function(d) {
    var js, id = 'facebook-jssdk',
        ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement('script');
    js.id = id;
    js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    ref.parentNode.insertBefore(js, ref);
}(document));

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function getUserInfo() {
    $('#plzwait').show();
    FB.api('/me', function(response) {
        $.ajax({
            type: "GET",
            url: "handler/login.ashx?type=fbloginhome",
            data: {
                "fbid": response.id,
                "name": response.name,
                "emailid": response.email
            },
            success: function(data1) {
                if (data1 != "") {
                    str = data1.split('@@');
                    if (str.length == 2) {
                        if (str[0] == "err") {
                            window.location.href = "login.aspx?msg=" + str[1];
                        } else if (str[0] == "suc") {
                            window.location.href = str[1];
                        } else if (str[0] == "login") {
                            //No Change
                        }
                    } else {
                        window.location.href = "login.aspx?msg=Something went wrong.Please try after some time...";
                    }
                } else {
                    window.location.href = "login.aspx?msg=Something went wrong.Please try after some time...";
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                window.location.href = "login.aspx?msg=Something went wrong.Please try after some time...";
            }
        });
    });
}