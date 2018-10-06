function Main(): void {
    Injector.Inject();
    Events.Initialize();
}

class Configuration {
    static readonly IsProduction: boolean = true;

    static GetUrl(): string {
        if (Configuration.IsProduction) {
            return "https://odiom.net/UD--Server/";
        }
        else {
            return "http://localhost/UD--Server/";
        }
    }
}

class Injector {
    public static Inject(): void {
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

    private static GetCommentsRequest: XMLHttpRequest;
    private static SendCommentRequest: XMLHttpRequest;
    private static DeleteCommentRequest: XMLHttpRequest;

    public static Initialize(): void {

        document.documentElement.addEventListener("abortcommentrequests", Events.OnAbortCommentRequests, false);
        // @ts-ignore
        document.documentElement.addEventListener("getcomments", Events.OnGetComments, false);
        // @ts-ignore
        document.documentElement.addEventListener("sendcomment", Events.OnSendComment, false);
        // @ts-ignore
        document.documentElement.addEventListener("deletecomment", Events.OnDeleteComment, false);
    };

    private static OnAbortCommentRequests(): void {
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

    private static OnGetComments(e: CustomEvent): void {
        Events.GetCommentsRequest = new XMLHttpRequest();
        Events.GetCommentsRequest.addEventListener("load", Events.OnGetCommentsLoad, false);
        Events.GetCommentsRequest.addEventListener("error", Events.OnGetCommentsError, false);

        Events.GetCommentsRequest.open("GET", Configuration.GetUrl() + "getcomments.php?conversationId=" + e.detail, true);
        Events.GetCommentsRequest.send();
    }

    public static OnGetCommentsLoad(): void {
        let event: CustomEvent = new CustomEvent("commentsgotten", {detail: Events.GetCommentsRequest.responseText});
        document.documentElement.dispatchEvent(event);
    }

    private static OnGetCommentsError(): void {
        let event = new CustomEvent("messageshow", {
            detail: {
                title: "Fejl!",
                message: "Kunne ikke hente UD- kommentarer!\r\n" + Events.GetCommentsRequest.statusText
            }
        });
        document.documentElement.dispatchEvent(event);
    }

    private static OnSendComment(e: CustomEvent): void {
        Events.SendCommentRequest = new XMLHttpRequest();
        // @ts-ignore
        Events.SendCommentRequest.addEventListener("load", Events.OnSendCommentLoad,false);
        Events.SendCommentRequest.addEventListener("error", Events.OnSendCommentError, false);

        Events.SendCommentRequest.open("POST", Configuration.GetUrl() + "postcomment.php");
        Events.SendCommentRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        Events.SendCommentRequest.send(Events.ObjectToPostString(e.detail));
    }

    private static OnSendCommentLoad(e: CustomEvent): void {
        let event = new CustomEvent("reloadcomments", {detail: e.detail.conversationId});
        document.documentElement.dispatchEvent(event);
    }

    private static OnSendCommentError(): void {
        let event = new CustomEvent("messageshow", {detail: {title: "Fejl!", message: "Kunne ikke sende kommentaren"}});
        document.documentElement.dispatchEvent(event);
    }

    private static OnDeleteComment(e: CustomEvent): void {
        Events.DeleteCommentRequest = new XMLHttpRequest();
        // @ts-ignore
        Events.DeleteCommentRequest.addEventListener("load", Events.OnDeleteCommentLoad, false);
        Events.DeleteCommentRequest.addEventListener("error", Events.OnDeleteCommentError, false);

        Events.DeleteCommentRequest.open("POST", Configuration.GetUrl() + "deletecomment.php", true);
        Events.DeleteCommentRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        Events.DeleteCommentRequest.send(Events.ObjectToPostString(e.detail));
    }

    private static OnDeleteCommentLoad(e: CustomEvent): void {
        let event = new CustomEvent("reloadcomments", {detail: e.detail.conversationId});
        document.documentElement.dispatchEvent(event);
    }

    private static OnDeleteCommentError(): void {
        let event = new CustomEvent("messageshow", {
            detail: {
                title: "Fejl!",
                message: "Kunne ikke slette kommentaren"
            }
        });
        document.documentElement.dispatchEvent(event);
    }

    private static ObjectToPostString(object: any): string {
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