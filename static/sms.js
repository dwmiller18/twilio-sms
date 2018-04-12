
// creates the json object to be passed to the post api call
function getBody() {
    var textBody = $("#smsTextArea").val();     // gets value from textbox
    var toNumber = $("#smsToNumber").val();     // gets value from textbox

    // returns toNumber and textBody in json format
    return JSON.stringify({"toNumber":toNumber, "message":textBody});
}

// sends the message
function sendMessage() {
    $.ajax({
        type: "POST",           
        url: "http://localhost:3000/message",   // hits the message endpoint
        data: getBody(),        // runs get data to get info for the post
        contentType: 'application/json',    // api header
        success: function(data){
            console.log(data);      // logs the data into the console
            alert("message sent successfully");     // alerts it was sent successfully
        }
    });
};