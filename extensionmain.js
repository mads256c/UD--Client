"use strict";
function Main() {
    Injector.Inject();
    Events.Initialize();
}
class Configuration {
    static GetUrl() {
        if (Configuration.IsProduction) {
            return "https://odiom.net/UD--Server/";
        }
        else {
            return "http://localhost/UD--Server/";
        }
    }
}
Configuration.IsProduction = true;
class Injector {
    static Inject() {
        let c = document.createElement("link");
        c.rel = "stylesheet";
        // @ts-ignore
        c.href = chrome.extension.getURL("injected/main.css");
        document.head.appendChild(c);
        //Create a html script element.
        let s = document.createElement("script");
        // @ts-ignore
        s.src = chrome.extension.getURL("injected/main.js"); //Set the src to our code.
        document.head.appendChild(s); //Add the element to the document.
    }
}
class Events {
    static Initialize() {
        document.documentElement.addEventListener("abortcommentrequests", Events.OnAbortCommentRequests, false);
        // @ts-ignore
        document.documentElement.addEventListener("getcomments", Events.OnGetComments, false);
        // @ts-ignore
        document.documentElement.addEventListener("sendcomment", Events.OnSendComment, false);
        // @ts-ignore
        document.documentElement.addEventListener("deletecomment", Events.OnDeleteComment, false);
    }
    ;
    static OnAbortCommentRequests() {
        if (Events.GetCommentsRequest !== undefined) {
            Events.GetCommentsRequest.abort();
        }
        if (Events.SendCommentRequest !== undefined) {
            Events.SendCommentRequest.abort();
        }
        if (Events.DeleteCommentRequest !== undefined) {
            Events.DeleteCommentRequest.abort();
        }
    }
    static OnGetComments(e) {
        Events.GetCommentsRequest = new XMLHttpRequest();
        Events.GetCommentsRequest.addEventListener("load", Events.OnGetCommentsLoad, false);
        Events.GetCommentsRequest.addEventListener("error", Events.OnGetCommentsError, false);
        Events.GetCommentsRequest.open("GET", Configuration.GetUrl() + "getcomments.php?conversationId=" + e.detail, true);
        Events.GetCommentsRequest.send();
    }
    static OnGetCommentsLoad() {
        let event = new CustomEvent("commentsgotten", { detail: Events.GetCommentsRequest.responseText });
        document.documentElement.dispatchEvent(event);
    }
    static OnGetCommentsError() {
        let event = new CustomEvent("messageshow", {
            detail: {
                title: "Fejl!",
                message: "Kunne ikke hente UD- kommentarer!\r\n" + Events.GetCommentsRequest.statusText
            }
        });
        document.documentElement.dispatchEvent(event);
    }
    static OnSendComment(e) {
        Events.SendCommentRequest = new XMLHttpRequest();
        // @ts-ignore
        Events.SendCommentRequest.addEventListener("load", Events.OnSendCommentLoad, false);
        Events.SendCommentRequest.addEventListener("error", Events.OnSendCommentError, false);
        Events.SendCommentRequest.open("POST", Configuration.GetUrl() + "postcomment.php");
        Events.SendCommentRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        Events.SendCommentRequest.send(Events.ObjectToPostString(e.detail));
    }
    static OnSendCommentLoad(e) {
        let event = new CustomEvent("reloadcomments", { detail: e.detail.conversationId });
        document.documentElement.dispatchEvent(event);
    }
    static OnSendCommentError() {
        let event = new CustomEvent("messageshow", { detail: { title: "Fejl!", message: "Kunne ikke sende kommentaren" } });
        document.documentElement.dispatchEvent(event);
    }
    static OnDeleteComment(e) {
        Events.DeleteCommentRequest = new XMLHttpRequest();
        // @ts-ignore
        Events.DeleteCommentRequest.addEventListener("load", Events.OnDeleteCommentLoad, false);
        Events.DeleteCommentRequest.addEventListener("error", Events.OnDeleteCommentError, false);
        Events.DeleteCommentRequest.open("POST", Configuration.GetUrl() + "deletecomment.php", true);
        Events.DeleteCommentRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        Events.DeleteCommentRequest.send(Events.ObjectToPostString(e.detail));
    }
    static OnDeleteCommentLoad(e) {
        let event = new CustomEvent("reloadcomments", { detail: e.detail.conversationId });
        document.documentElement.dispatchEvent(event);
    }
    static OnDeleteCommentError() {
        let event = new CustomEvent("messageshow", {
            detail: {
                title: "Fejl!",
                message: "Kunne ikke slette kommentaren"
            }
        });
        document.documentElement.dispatchEvent(event);
    }
    static ObjectToPostString(object) {
        let string = "";
        for (let property in object) {
            if (object.hasOwnProperty(property)) {
                string += property + "=" + object[property] + "&";
            }
        }
        return string.substring(0, string.length - 1);
    }
}
Main();
//# sourceMappingURL=extensionmain.js.map