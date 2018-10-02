//This javascript code injects "injected/main.js" into the top javascript context.
//This is needed because normally we only have access to our own things, but we need access to the whole html document.

//Function that runs itself. It makes sure that we don't pollute the namespace with our variables.
(function()
{
    let c = document.createElement("link");
    c.rel = "stylesheet";
    c.href = chrome.extension.getURL("injected/main.css");
    (document.head || document.documentElement).appendChild(c);

    //Create a html script element.
    let s = document.createElement("script");
    s.src = chrome.extension.getURL("injected/main.js"); //Set the src to our code.
    (document.head || document.documentElement).appendChild(s); //Add the element to the document.

    document.documentElement.addEventListener('cancelrequest', onCancelRequest, false);
    document.documentElement.addEventListener('sendrequest', onSendRequest, false);

})();

let getRequest;
function onCancelRequest()
{
    if (getRequest !== undefined && getRequest !== null)
    {
        getRequest.abort();
    }
}

function onSendRequest(e)
{
    console.log("Test: " + e.detail);

    getRequest = new XMLHttpRequest();
    getRequest.onreadystatechange = function(){
        if (this.readyState === 4 && this.status === 200){
            let event = new CustomEvent('commentsget', {detail: this.responseText});
            document.documentElement.dispatchEvent(event);
        }
    };

    getRequest.open("GET", "http://localhost/UD--Server/getcomments.php?conversationId=0", true);
    getRequest.send();
}