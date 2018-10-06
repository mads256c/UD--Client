//This javascript code injects "injected/main.js" into the top javascript context.
//This is needed because normally we only have access to our own things, but we need access to the whole html document.

const production = false;

const prodUrl = "https://odiom.net/UD--Server/";
const localUrl = "http://localhost/UD--Server/";

let url;

//Function that runs itself. It makes sure that we don't pollute the namespace with our variables.
(function()
{
    url = production ? prodUrl : localUrl;

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
    document.documentElement.addEventListener("commentsend", onCommentSend, false);
    document.documentElement.addEventListener("commentdelete", onCommentDelete, false);

})();

let getRequest;
let postRequest;
function onCancelRequest()
{
    if (getRequest !== undefined && getRequest !== null)
    {
        getRequest.abort();
    }

    if (postRequest !== undefined && postRequest !== null)
    {
        postRequest.abort();
    }
}

function onSendRequest(e)
{
    let conversationId = e.detail;
    console.log("Test: " + conversationId);

    getRequest = new XMLHttpRequest();
    getRequest.addEventListener("load", function(){
        let event = new CustomEvent('commentsget', {detail: getRequest.responseText});
        document.documentElement.dispatchEvent(event);
    });

    getRequest.addEventListener("error", function(){
        let event = new CustomEvent("messageshow", {detail: {title: "Fejl!", message: "Kunne ikke hente UD- kommentarer!\r\n" + getRequest.statusText}});
        document.documentElement.dispatchEvent(event);
    });

    getRequest.open("GET", url + "getcomments.php?conversationId=" + conversationId, true);
    getRequest.send();
}

function onCommentSend(e)
{
    postRequest = new XMLHttpRequest();
    postRequest.addEventListener("load",function(){
        let event = new CustomEvent('commentsreload', {detail: e.detail.conversationId});
        document.documentElement.dispatchEvent(event);
    });

    postRequest.addEventListener("error", function(){
        let event = new CustomEvent("messageshow", {detail: {title: "Fejl!", message: "Kunne ikke sende kommentaren"}});
        document.documentElement.dispatchEvent(event);
    });

    postRequest.open("POST", url + "postcomment.php", true);
    postRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    postRequest.send(objectToFormData(e.detail));
}

function onCommentDelete(e)
{
    postRequest = new XMLHttpRequest();
    postRequest.addEventListener("load",function(){
        let event = new CustomEvent('commentsreload', {detail: e.detail.conversationId});
        document.documentElement.dispatchEvent(event);
    });

    postRequest.addEventListener("error", function(){
        let event = new CustomEvent("messageshow", {detail: {title: "Fejl!", message: "Kunne ikke slette kommentaren"}});
        document.documentElement.dispatchEvent(event);
    });

    postRequest.open("POST", url + "deletecomment.php", true);
    postRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    postRequest.send(objectToFormData(e.detail));
}

function objectToFormData(obj) {

    let string = "";

    for(let property in obj) {
        if(obj.hasOwnProperty(property)) {
            string += property + "=" + obj[property] + "&";
        }
    }

    return string.substring(0, string.length-1);
}


