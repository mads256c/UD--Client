//Global configuration.
const conf =
{
    activeConversationClass: "IWI4RYB-d-r IWI4RYB-d-G IWI4RYB-d-O IWI4RYB-d-f IWI4RYB-b-c IWI4RYB-b-l IWI4RYB-d-k IWI4RYB-b-k",
    updateRate: 100,

    commentClass: "IWI4RYB-d-r IWI4RYB-d-O IWI4RYB-d-k IWI4RYB-d-f IWI4RYB-b-e do-select IWI4RYB-d-t",

    commentChainWrapperClass: "",

    commentWrapperClass: "commentmargin",

    commentNameClass: "gwt-InlineHTML IWI4RYB-b-b IWI4RYB-b-o green",

    commentTextClass: "gwt-HTML IWI4RYB-b-G",

    commentReplyTimeWrapperClass: "IWI4RYB-d-r IWI4RYB-d-G IWI4RYB-d-O IWI4RYB-d-k IWI4RYB-d-f",

    commentReplyClass: "gwt-HTML IWI4RYB-b-F IWI4RYB-b-o",

    commentTimeWrapperClass: "IWI4RYB-b-g IWI4RYB-b-h",

    commentTimeClass: "gwt-HTML",

    commentInputClass: "gwt-TextArea IWI4RYB-q-c input-block-level",

    uddataMagicStyle: "flex: 0 1 auto;"
};
//Function that runs itself. It makes sure that we don't pollute the namespace with our variables.
(function main()
{
    console.log("UD- starting");

    document.documentElement.addEventListener("commentsget", onCommentsGet, false);
    document.documentElement.addEventListener("commentreply", onCommentReply, false);
    document.documentElement.addEventListener("commentsreload", onCommentsReload, false);


    let height = 0;
    //Halves original comments size. HACK!
    setInterval(function(){
        let v = document.getElementsByClassName("IWI4RYB-d-r IWI4RYB-d-O IWI4RYB-d-k IWI4RYB-d-f IWI4RYB-d-t IWI4RYB-b-r")[0].nextSibling;

            if (v !== undefined && v !== null) {
                if (height !== parseFloat(v.style.height.replace("px", ""))) {
                    height = parseFloat(v.style.height.replace("px", "")) / 3;
                    if (height < 100) {
                        height = 100;
                    }
                    v.style.height = height + "px";
                }
            }

    }, 100);

    let conversationId = 0;

    setInterval(function() {
        if (document.getElementsByClassName(conf.activeConversationClass).length) {
            let activeConversationId = document.getElementsByClassName(conf.activeConversationClass)[0].__listener.j.k;
            if (conversationId === 0 || activeConversationId !== conversationId) {
                conversationId = activeConversationId;
                onConversationChange(conversationId);
            }
        }
    }, conf.updateRate);
})();

let currentConversation;

function onConversationChange(conversationId)
{
    console.log("Conversation change: " + conversationId);

    currentConversation = conversationId;

    removeComments();
    createComments(conversationId);
}

function removeComments()
{
    let event = new CustomEvent('cancelrequest');
    document.documentElement.dispatchEvent(event);

    let title = document.getElementById("ud--commenttitle");
    if (title !== undefined && title !== null) {
        title.remove();
    }

    let comments = document.getElementById("ud--commentsection");
    if (comments !== undefined && comments !== null) {
        comments.remove();
    }

    let commentInput = document.getElementById("ud--commentinput");
    if (commentInput !== undefined && commentInput !== null) {
        commentInput.remove();
    }

    let commentHelp = document.getElementById("ud--commenthelp");
    if (commentHelp !== undefined && commentHelp !== null) {
        commentHelp.remove();
    }
}

function createComments(conversationId)
{
    let event = new CustomEvent('sendrequest', { detail: conversationId });

    document.documentElement.dispatchEvent(event);
}

function onCommentsGet(e)
{
    let title = document.createElement("h3");
    title.id = "ud--commenttitle";
    title.innerText = "UD- kommentarfelt";

    let comments = document.createElement("div");
    comments.className = conf.commentChainWrapperClass;
    comments.id = "ud--commentsection";
    comments.style = conf.uddataMagicStyle;

    let json = JSON.parse(e.detail);

    let commentsArray = {};


    json.forEach(function(obj) {

        let commentWrapper = document.createElement("div");
        //commentWrapper.innerText = "ID: " + obj.Id + " Name: " + obj.Name + " Time:" + obj.Time + " Text: " + obj.Text;
        commentWrapper.className = conf.commentWrapperClass;
        commentWrapper.style = conf.uddataMagicStyle;


            let commentNameTextWrapper = document.createElement("div");
            commentNameTextWrapper.style = conf.uddataMagicStyle;


                let commentName = document.createElement("span");
                commentName.className = conf.commentNameClass;
                commentName.innerText = obj.Name;

                let commentUserInfoEvent = document.createElement("div");
                commentUserInfoEvent.id = "ud--commentuserinfoevent";

                let commentUserInfoName = document.createElement("span");
                commentUserInfoName.innerText = obj.Name;
                commentUserInfoName.className = "ud--userinfoname";

                let commentUserInfoImage = document.createElement("img");
                commentUserInfoImage.src = "https://www.uddataplus.dk/shared/brugerfoto?brug_id=" + obj.UserId.toString();
                commentUserInfoImage.style.marginTop = "10px";
                commentUserInfoImage.style.maxHeight = "100px";
                commentUserInfoImage.style.maxWidth = "100px";
                commentUserInfoImage.className = "ud--userinfoimage";


                commentUserInfoEvent.appendChild(commentUserInfoName);
                commentUserInfoEvent.appendChild(commentUserInfoImage);

                commentName.addEventListener('mouseover', function(e) {
                    commentUserInfoEvent.style.left = (e.pageX - commentUserInfoEvent.clientWidth / 2).toString() + "px";
                    commentUserInfoEvent.style.top = (e.pageY - commentUserInfoEvent.clientHeight - 20).toString() + "px";
                    document.body.appendChild(commentUserInfoEvent);

                }, false);

                commentName.addEventListener('mousemove', function(e) {
                    commentUserInfoEvent.style.left = (e.pageX - commentUserInfoEvent.clientWidth / 2).toString() + "px";
                    commentUserInfoEvent.style.top = (e.pageY - commentUserInfoEvent.clientHeight - 20).toString() + "px";
                }, false)

                commentName.addEventListener('mouseleave', function(e) {
                    let d = document.getElementById("ud--commentuserinfoevent");

                    if (d !== undefined && d !== null)
                    {
                        d.remove();
                    }
                    }, false);

                let commentText = document.createElement("div");
                commentText.className = conf.commentTextClass;
                commentText.innerText = obj.Text;

                let previousImgTag = 0;

                let contentWrapper = document.createElement("div");

                while (obj.Text.includes("[IMG](", previousImgTag))
                {
                    previousImgTag = obj.Text.indexOf("[IMG](", previousImgTag) + 6;
                    let substr = obj.Text.substring(previousImgTag);
                    let url = "";
                    for (let i = 0; i < substr.length; i++) {

                        if (substr[i] === ")")
                        {
                            break;
                        }

                        if (i === substr.length - 1)
                        {
                            url = "";
                            break;
                        }

                        url += substr[i];
                    }

                    if (url !== "")
                    {
                        let imageLink = document.createElement("a");
                        imageLink.href = url;
                        imageLink.target = "_blank";

                        let image = document.createElement("img");
                        image.src = url;
                        image.className = "ud--commentimage";

                        imageLink.appendChild(image);

                        contentWrapper.appendChild(imageLink);

                        commentText.innerText = commentText.innerText.replace("[IMG](" + url + ")", "");
                    }

                }

        let previousVidTag = 0;

        while (obj.Text.includes("[VID](", previousVidTag))
        {
            previousVidTag = obj.Text.indexOf("[VID](", previousVidTag) + 6;
            let substr = obj.Text.substring(previousVidTag);
            let url = "";
            for (let i = 0; i < substr.length; i++) {

                if (substr[i] === ")")
                {
                    break;
                }

                if (i === substr.length - 1)
                {
                    url = "";
                    break;
                }

                url += substr[i];
            }

            if (url !== "")
            {
                let video;
                if (url.includes("youtube.com")){
                    video = document.createElement("iframe");
                    video.src = url.replace("youtube.com/", "youtube.com/embed/").replace("watch?v=", "");
                    video.frameBorder = "0";
                    video.allowFullscreen = true;
                    video.className = "ud--commentvideo";
                }
                else {
                    video = document.createElement("video");
                    video.src = url;
                    video.className = "ud--commentvideo";
                    video.controls = true;
                }

                    contentWrapper.appendChild(video);


                commentText.innerText = commentText.innerText.replace("[VID](" + url + ")", "");
            }

        }

                commentText.append(contentWrapper);



                commentNameTextWrapper.appendChild(commentName);
                commentNameTextWrapper.appendChild(commentText);



            let commentReplyTimeWrapper = document.createElement("div");
            commentReplyTimeWrapper.className = conf.commentReplyTimeWrapperClass;
            commentReplyTimeWrapper.style = conf.uddataMagicStyle;



                let commentReply = document.createElement("div");
                commentReply.className = conf.commentReplyClass;
                commentReply.style = "display: inline-block;";
                commentReply.innerText = "Svar";

                let commentReplyEvent = new CustomEvent('commentreply', {detail: {conversationId: obj.ConversationId, commentId: obj.Id, commentDiv: commentWrapper}});
                commentReply.onclick = function(a, b){
                document.documentElement.dispatchEvent(commentReplyEvent)};

                let commentTimeWrapper = document.createElement("div");
                commentTimeWrapper.className = conf.commentTimeWrapperClass;
                commentTimeWrapper.style = "display: inline-block;";

                    let commentTime = document.createElement("div");
                    commentTime.className = conf.commentTimeClass;
                    commentTime.innerText = obj.Time;

                    commentTimeWrapper.appendChild(commentTime);

                commentReplyTimeWrapper.appendChild(commentReply);
                commentReplyTimeWrapper.appendChild(commentTimeWrapper);

            commentWrapper.appendChild(commentNameTextWrapper);
            commentWrapper.appendChild(commentReplyTimeWrapper);


        commentsArray[obj.Id] = commentWrapper;


        if (obj.ReplyTo === null) {
            comments.appendChild(commentWrapper);
        }
        else{
            commentWrapper.style.paddingLeft = "10px";
            commentsArray[obj.ReplyTo].appendChild(commentWrapper);
        }

    });


    let commentInput = createCommentInput();
    commentInput.addEventListener('keydown', function(event){

        //Auto size
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";

        //Comment send
        if (event.code === "Enter" || event.code === "NumpadEnter")
        {
            event.preventDefault();
            let commentSendEvent = new CustomEvent("commentsend", {detail: {conversationId: currentConversation, name: uddata_bruger.fornavn + " " + uddata_bruger.efternavn, userId: uddata_bruger.brug_id, text: this.value}});

            document.documentElement.dispatchEvent(commentSendEvent);
        }
    });

    let commentDoc = document.getElementsByClassName(conf.commentClass)[0];
    commentDoc.appendChild(title);
    commentDoc.appendChild(comments);
    commentDoc.appendChild(commentInput);
    commentDoc.appendChild(createCommentHelp(commentInput, false));



}

function onCommentReply(e)
{
    let conversationId = e.detail.conversationId;
    let commentId = e.detail.commentId;
    let commentDiv = e.detail.commentDiv;

    removeCommentInput();

    let textarea = createCommentReplyInput();
    textarea.addEventListener('keydown', function(event){

        //Auto size
        this.style.height = "auto";
        this.style.height = this.scrollHeight + "px";

        //Comment send
        if (event.code === "Enter" || event.code === "NumpadEnter")
        {
            event.preventDefault();
            let commentSendEvent = new CustomEvent("commentsend", {detail: {conversationId: conversationId, replyId: commentId, name: uddata_bruger.fornavn + " " + uddata_bruger.efternavn, userId: uddata_bruger.brug_id, text: this.value}});

            document.documentElement.dispatchEvent(commentSendEvent);

            this.remove();
        }
    });

    commentDiv.appendChild(textarea);
    commentDiv.appendChild(createCommentHelp(textarea, true));

    //alert("This feature does not work yet\n");
}

function removeCommentInput()
{
    let textarea = document.getElementById("ud--commentreplyinput");
    if (textarea !== undefined && textarea !== null)
    {
        textarea.remove();
    }

    let help = document.getElementById("ud--commentreplyhelp");
    if (help !== undefined && help !== null)
    {
        help.remove();
    }
}

function createCommentReplyInput()
{
    let textarea = document.createElement("textarea");
    textarea.id = "ud--commentreplyinput";
    textarea.className = conf.commentInputClass;
    textarea.rows = 1;
    textarea.maxLength = 5000;
    textarea.placeholder = "Skriv en UD- kommentar ...";

    return textarea;
}

function onCommentsReload(e)
{
    onConversationChange(e.detail);
}

function createCommentInput()
{
    let textarea = document.createElement("textarea");
    textarea.id = "ud--commentinput";
    textarea.className = conf.commentInputClass;
    textarea.rows = 1;
    textarea.maxLength = 5000;
    textarea.placeholder = "Skriv en UD- kommentar ...";

    return textarea;
}

function createCommentHelp(commentInput, isReply)
{
    let helpWrapper = document.createElement("div");
    if (isReply){
        helpWrapper.id = "ud--commentreplyhelp";
    }
    else{
        helpWrapper.id = "ud--commenthelp";
    }
    let insertImageHelp = document.createElement("a");
    insertImageHelp.innerText = "Indsæt billede";

    insertImageHelp.addEventListener('click', function(e){
        commentInput.value += "[IMG](<Indsæt billed url her>)";
    },false);

    let spacer = document.createElement("span");
    spacer.innerText = "•";
    spacer.style.marginLeft = "5px";
    spacer.style.marginRight = "5px";

    let insertVideoHelp = document.createElement("a");
    insertVideoHelp.innerText = "Indsæt video";

    insertVideoHelp.addEventListener('click', function(e){
        commentInput.value += "[VID](<Indsæt video url her>)";
    },false);

    helpWrapper.appendChild(insertImageHelp);
    helpWrapper.appendChild(spacer);
    helpWrapper.appendChild(insertVideoHelp);

    return helpWrapper;
}