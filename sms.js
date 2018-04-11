

function getBody() {
    var textBody = $("#smsTextArea").val();
    var toNumber = $("#smsToNumber").val();

    return JSON.stringify({"toNumber":toNumber, "message":textBody});
}

function sendMessage() {
    $.ajax({
        type: "POST", 
        url: "http://localhost:3000/message",
        data: getBody(),
        contentType: 'application/json',
        success: function(){
            alert("message sent successfully");
        }
    });
};