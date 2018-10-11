"use strict";
var InjectedMain;
(function (InjectedMain) {
    function Main() {
        CommentHeightFixer.Initialize();
        ConversationChangeObserver.Initialize();
    }
    class CssClassNames {
    }
    CssClassNames.CommentHeightDivParent = "IWI4RYB-d-r IWI4RYB-d-O IWI4RYB-d-k IWI4RYB-d-f IWI4RYB-d-t IWI4RYB-b-r";
    CssClassNames.ActiveConversation = "IWI4RYB-d-r IWI4RYB-d-G IWI4RYB-d-O IWI4RYB-d-f IWI4RYB-b-c IWI4RYB-b-l IWI4RYB-d-k IWI4RYB-b-k";
    CssClassNames.CommentWrapper = "commentmargin";
    CssClassNames.CommentName = "gwt-InlineHTML IWI4RYB-b-b IWI4RYB-b-o green";
    CssClassNames.CommentText = "gwt-HTML IWI4RYB-b-G";
    CssClassNames.CommentReplyDeleteWrapper = "IWI4RYB-d-r IWI4RYB-d-G IWI4RYB-d-O IWI4RYB-d-k IWI4RYB-d-f";
    CssClassNames.CommentReply = "gwt-HTML IWI4RYB-b-F IWI4RYB-b-o";
    class CssIds {
    }
    CssIds.CommentTitle = "ud--commenttitle";
    CssIds.CommentSection = "ud--commentsection";
    CssIds.CommentInput = "ud--commentinput";
    CssIds.CommentHelp = "ud--commenthelp";
    class CommentHeightFixer {
        static Initialize() {
            setTimeout(CommentHeightFixer.FixHeight, CommentHeightFixer.UpdateRate);
        }
        static FixHeight() {
            let commentHeightDiv = document.getElementsByClassName(CssClassNames.CommentHeightDivParent)[0].nextSibling;
            if (commentHeightDiv !== null) {
                if (CommentHeightFixer.Height !== parseFloat(commentHeightDiv.style.height.replace("px", ""))) {
                    CommentHeightFixer.Height = parseFloat(commentHeightDiv.style.height.replace("px", "")) / 3;
                    if (CommentHeightFixer.Height < 100) {
                        CommentHeightFixer.Height = 100;
                    }
                    commentHeightDiv.style.height = CommentHeightFixer.Height + "px";
                }
            }
        }
    }
    CommentHeightFixer.UpdateRate = 100;
    CommentHeightFixer.Height = 0;
    class ConversationChangeObserver {
        static Initialize() {
            setTimeout(ConversationChangeObserver.Observe, ConversationChangeObserver.UpdateRate);
        }
        static Observe() {
            if (document.getElementsByClassName(CssClassNames.ActiveConversation).length !== 0) {
                // @ts-ignore
                let activeConversationId = document.getElementsByClassName(CssClassNames.ActiveConversationClass)[0].__listener.j.k;
                if (ConversationChangeObserver.ConversationId === 0 || activeConversationId !== ConversationChangeObserver.ConversationId) {
                    ConversationChangeObserver.ConversationId = activeConversationId;
                    ConversationChangeObserver.OnConversationChanged(ConversationChangeObserver.ConversationId);
                }
            }
        }
        static OnConversationChanged(conversationId) {
            console.log(conversationId);
            Comments.RemoveComments();
            Comments.CreateComments(conversationId);
        }
    }
    ConversationChangeObserver.UpdateRate = 100;
    ConversationChangeObserver.ConversationId = 0;
    class Comments {
        static RemoveComments() {
            let abortCommentRequestEvent = new CustomEvent('abortcommentrequests');
            document.documentElement.dispatchEvent(abortCommentRequestEvent);
            let commentTitle = document.getElementById(CssIds.CommentTitle);
            if (commentTitle !== null) {
                commentTitle.remove();
            }
            let commentSection = document.getElementById(CssIds.CommentSection);
            if (commentSection !== null) {
                commentSection.remove();
            }
            let commentInput = document.getElementById(CssIds.CommentInput);
            if (commentInput !== null) {
                commentInput.remove();
            }
            let commentHelp = document.getElementById(CssIds.CommentHelp);
            if (commentHelp !== null) {
                commentHelp.remove();
            }
        }
        static CreateComments(conversationId) {
            let getCommentsEvent = new CustomEvent('getcomments', { detail: conversationId });
            document.documentElement.dispatchEvent(getCommentsEvent);
        }
    }
    class Comment {
        constructor(id, name, userId, text) {
            this.Id = id;
            this.Name = name;
            this.UserId = userId;
            this.Text = text;
        }
        static CreateCommentWrapper() {
            let commentWrapper = document.createElement("div");
            commentWrapper.className = CssClassNames.CommentWrapper;
            return commentWrapper;
        }
        static CreateCommentNameTextWrapper() {
            let commentNameTextWrapper = document.createElement("div");
            return commentNameTextWrapper;
        }
        CreateCommentName() {
            let commentName = document.createElement("div");
            commentName.className = CssClassNames.CommentName;
            commentName.innerText = this.Name;
            return commentName;
        }
        CreateUserInfo(commentName) {
            if (this.UserId !== 0) {
                let commentUserInfoEvent = document.createElement("div");
                commentUserInfoEvent.id = "ud--commentuserinfoevent";
                let commentUserInfoName = document.createElement("span");
                commentUserInfoName.innerText = this.Name;
                commentUserInfoName.className = "ud--userinfoname";
                let commentUserInfoImage = document.createElement("img");
                commentUserInfoImage.src = "https://www.uddataplus.dk/shared/brugerfoto?brug_id=" + this.UserId;
                commentUserInfoImage.style.marginTop = "10px";
                commentUserInfoImage.style.maxHeight = "100px";
                commentUserInfoImage.style.maxWidth = "100px";
                commentUserInfoImage.className = "ud--userinfoimage";
                commentUserInfoEvent.appendChild(commentUserInfoName);
                commentUserInfoEvent.appendChild(commentUserInfoImage);
                commentName.addEventListener('mouseover', function (e) {
                    commentUserInfoEvent.style.left = (e.pageX - commentUserInfoEvent.clientWidth / 2).toString() + "px";
                    commentUserInfoEvent.style.top = (e.pageY - commentUserInfoEvent.clientHeight - 20).toString() + "px";
                    document.body.appendChild(commentUserInfoEvent);
                }, false);
                commentName.addEventListener('mousemove', function (e) {
                    commentUserInfoEvent.style.left = (e.pageX - commentUserInfoEvent.clientWidth / 2).toString() + "px";
                    commentUserInfoEvent.style.top = (e.pageY - commentUserInfoEvent.clientHeight - 20).toString() + "px";
                }, false);
                commentName.addEventListener('mouseleave', function () {
                    let oldUserInfo = document.getElementById("ud--commentuserinfoevent");
                    if (oldUserInfo !== null) {
                        oldUserInfo.remove();
                    }
                }, false);
            }
        }
        CreateContentWrapper() {
            let contentWrapper = document.createElement("div");
            return contentWrapper;
        }
        CreateCommentImage(contentWrapper) {
            let previousImgTag = 0;
            let text = this.Text;
            while (text.includes("[IMG](", previousImgTag)) {
                previousImgTag = text.indexOf("[IMG](", previousImgTag) + 6;
                let substr = text.substring(previousImgTag);
                let url = "";
                for (let i = 0; i < substr.length; i++) {
                    if (substr[i] === ")") {
                        break;
                    }
                    if (i === substr.length - 1) {
                        url = "";
                        break;
                    }
                    url += substr[i];
                }
                if (url !== "") {
                    let imageLink = document.createElement("a");
                    imageLink.href = url;
                    imageLink.target = "_blank";
                    let image = document.createElement("img");
                    image.src = url;
                    image.className = "ud--commentimage";
                    imageLink.appendChild(image);
                    contentWrapper.appendChild(imageLink);
                    this.Text = this.Text.replace("[IMG](" + url + ")", "");
                }
            }
        }
        CreateCommentVideo(contentWrapper) {
            let previousVidTag = 0;
            let text = this.Text;
            while (text.includes("[VID](", previousVidTag)) {
                previousVidTag = text.indexOf("[VID](", previousVidTag) + 6;
                let substr = text.substring(previousVidTag);
                let url = "";
                for (let i = 0; i < substr.length; i++) {
                    if (substr[i] === ")") {
                        break;
                    }
                    if (i === substr.length - 1) {
                        url = "";
                        break;
                    }
                    url += substr[i];
                }
                if (url !== "") {
                    let video;
                    if (url.replace("youtu.be/", "youtube.com/").includes("youtube.com")) {
                        video = document.createElement("iframe");
                        video.src = url.replace("youtu.be/", "youtube.com/").replace("/embed/", "/").replace("youtube.com/", "youtube.com/embed/").replace("watch?v=", "");
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
                    this.Text = this.Text.replace("[VID](" + url + ")", "");
                }
            }
        }
        CreateCommentText() {
            let commentText = document.createElement("div");
            commentText.className = CssClassNames.CommentText;
            commentText.innerText = this.Text;
            return commentText;
        }
        CreateCommentReplyDeleteTimeWrapper() {
            let commentReplyDeleteTimeWrapper = document.createElement("div");
            commentReplyDeleteTimeWrapper.className = CssClassNames.CommentReplyDeleteWrapper;
            return commentReplyDeleteTimeWrapper;
        }
        CreateCommentReply() {
            let commentReply = document.createElement("div");
            commentReply.className = CssClassNames.CommentReply;
            commentReply.style.display = "inline-block";
        }
    }
    Main();
})(InjectedMain || (InjectedMain = {}));
//# sourceMappingURL=injectedmain.js.map