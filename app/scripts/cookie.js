"use strict";

const cookieToast = new bootstrap.Toast(document.querySelector('.cookie'));
const consentBtn = document.getElementById("accept-cookie");

if (document.cookie === ""){
    cookieToast.show();
}

consentBtn.addEventListener("click", createCookie);

function createCookie(){
    document.cookie = `melonseed_uuid=${crypto.randomUUID()};max-age=604800`;
    cookieToast.hide();
}

