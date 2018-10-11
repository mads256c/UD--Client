"use strict";
var InjectedMain;
(function (InjectedMain) {
    function Main() {
        CommentHeightFixer.Initialize();
        ConversationChangeObserver.Initialize();
        Comments.Initialize();
        console.log("UD- Starting...");
    }
    class CssClassNames {
    }
    CssClassNames.CommentHeightDivParent = "IWI4RYB-d-r IWI4RYB-d-O IWI4RYB-d-k IWI4RYB-d-f IWI4RYB-d-t IWI4RYB-b-r";
    CssClassNames.ActiveConversation = "IWI4RYB-d-r IWI4RYB-d-G IWI4RYB-d-O IWI4RYB-d-f IWI4RYB-b-c IWI4RYB-b-l IWI4RYB-d-k IWI4RYB-b-k";
    CssClassNames.CommentSection = "IWI4RYB-d-r IWI4RYB-d-O IWI4RYB-d-k IWI4RYB-d-f IWI4RYB-b-e do-select IWI4RYB-d-t";
    CssClassNames.CommentWrapper = "commentmargin";
    CssClassNames.CommentName = "gwt-InlineHTML IWI4RYB-b-b IWI4RYB-b-o green";
    CssClassNames.CommentText = "gwt-HTML IWI4RYB-b-G";
    CssClassNames.CommentReplyDeleteWrapper = "IWI4RYB-d-r IWI4RYB-d-G IWI4RYB-d-O IWI4RYB-d-k IWI4RYB-d-f";
    CssClassNames.CommentReply = "gwt-HTML IWI4RYB-b-F IWI4RYB-b-o";
    CssClassNames.CommentTimeWrapper = "IWI4RYB-b-g IWI4RYB-b-h";
    CssClassNames.CommentTime = "gwt-HTML";
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
            setInterval(ConversationChangeObserver.Observe, ConversationChangeObserver.UpdateRate);
        }
        static Observe() {
            if (document.getElementsByClassName(CssClassNames.ActiveConversation).length !== 0) {
                // @ts-ignore
                let activeConversationId = document.getElementsByClassName(CssClassNames.ActiveConversation)[0].__listener.j.k;
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
    class CommentInfo {
        constructor(id, conversationId, name, userId, text, time, replyTo) {
            this.Id = id;
            this.ConversationId = conversationId;
            this.Name = name;
            this.UserId = userId;
            this.Text = text;
            this.Time = time;
            this.ReplyTo = replyTo;
        }
    }
    class Comments {
        static Initialize() {
            document.documentElement.addEventListener("commentsgotten", Comments.OnCommentsGotten, false);
        }
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
        static OnCommentsGotten(e) {
            let commentDoc = document.getElementsByClassName(CssClassNames.CommentSection)[0];
            let title = document.createElement("h3");
            title.id = CssIds.CommentTitle;
            title.innerText = "UD- kommentarfelt";
            commentDoc.appendChild(title);
            let comments = document.createElement("div");
            comments.id = CssIds.CommentSection;
            commentDoc.appendChild(comments);
            Comment.CommentsArray = [];
            let json = JSON.parse(e.detail);
            json.forEach(function (commentInfo) {
                let replyTo = null;
                if (commentInfo.ReplyTo !== null) {
                    replyTo = parseInt(commentInfo.ReplyTo);
                }
                let comment = new Comment(parseInt(commentInfo.Id), parseInt(commentInfo.ConversationId), commentInfo.Name, parseInt(commentInfo.UserId), commentInfo.Text, commentInfo.Time, replyTo).Build();
                if (comment !== null) {
                    comments.appendChild(comment);
                }
            });
        }
    }
    class Comment {
        constructor(id, conversationId, name, userId, text, time, replyTo) {
            this.Id = id;
            this.ConversationId = conversationId;
            this.Name = name;
            this.UserId = userId;
            this.Text = text;
            this.Time = time;
            this.ReplyTo = replyTo;
        }
        Build() {
            let commentWrapper = this.CreateCommentWrapper();
            let commentNameTextWrapper = this.CreateCommentNameTextWrapper();
            let commentName = this.CreateCommentName();
            this.CreateUserInfo(commentName);
            let contentWrapper = this.CreateContentWrapper();
            this.CreateCommentImage(contentWrapper);
            this.CreateCommentVideo(contentWrapper);
            let commentText = this.CreateCommentText();
            let commentReplyDeleteTimeWrapper = this.CreateCommentReplyDeleteTimeWrapper();
            let commentReply = this.CreateCommentReply(commentWrapper);
            let commentDelete = this.CreateCommentDelete();
            let commentTimeWrapper = this.CreateCommentTimeWrapper();
            let commentTime = this.CreateCommentTime();
            commentWrapper.appendChild(commentNameTextWrapper);
            commentNameTextWrapper.appendChild(commentName);
            commentWrapper.appendChild(contentWrapper);
            contentWrapper.appendChild(commentNameTextWrapper);
            commentNameTextWrapper.appendChild(commentText);
            commentWrapper.appendChild(commentReplyDeleteTimeWrapper);
            if (this.UserId !== 0) {
                commentReplyDeleteTimeWrapper.appendChild(commentReply);
            }
            // @ts-ignore
            if (this.UserId === uddata_bruger.brug_id) {
                commentReplyDeleteTimeWrapper.appendChild(commentDelete);
            }
            commentReplyDeleteTimeWrapper.appendChild(commentTimeWrapper);
            commentTimeWrapper.appendChild(commentTime);
            Comment.CommentsArray[this.Id] = commentWrapper;
            if (this.ReplyTo === null) {
                return commentWrapper;
            }
            else {
                commentWrapper.style.paddingLeft = "10px";
                if (Comment.CommentsArray[this.ReplyTo] !== undefined) {
                    Comment.CommentsArray[this.ReplyTo].appendChild(commentWrapper);
                }
                return null;
            }
        }
        CreateCommentWrapper() {
            let commentWrapper = document.createElement("div");
            commentWrapper.className = CssClassNames.CommentWrapper;
            return commentWrapper;
        }
        CreateCommentNameTextWrapper() {
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
        CreateCommentReply(commentWrapper) {
            let commentReply = document.createElement("div");
            commentReply.className = CssClassNames.CommentReply;
            commentReply.style.display = "inline-block";
            commentReply.innerText = "Svar";
            let commentReplyEvent = new CustomEvent("commentreply", {
                detail: {
                    conversationId: this.ConversationId,
                    commentId: this.Id,
                    commentDiv: commentWrapper
                }
            });
            commentReply.addEventListener("click", function () {
                document.documentElement.dispatchEvent(commentReplyEvent);
            });
            return commentReply;
        }
        CreateCommentDelete() {
            let commentDelete = document.createElement("div");
            commentDelete.className = CssClassNames.CommentReply;
            commentDelete.style.display = "inline-block";
            commentDelete.style.marginLeft = "5px";
            commentDelete.innerText = "Slet";
            let commentDeleteEvent = new CustomEvent("deletecomment", {
                detail: {
                    conversationId: this.ConversationId,
                    userId: this.UserId,
                    id: this.Id
                }
            });
            commentDelete.addEventListener("click", function () {
                if (confirm("Er du sikker på at du vil slette denne kommentar?")) {
                    document.documentElement.dispatchEvent(commentDeleteEvent);
                }
            });
            return commentDelete;
        }
        CreateCommentTimeWrapper() {
            let commentTimeWrapper = document.createElement("div");
            commentTimeWrapper.className = CssClassNames.CommentTimeWrapper;
            commentTimeWrapper.style.display = "inline-block";
            return commentTimeWrapper;
        }
        CreateCommentTime() {
            let commentTime = document.createElement("div");
            commentTime.className = CssClassNames.CommentTime;
            commentTime.innerText = this.Time;
            return commentTime;
        }
    }
    Main();
})(InjectedMain || (InjectedMain = {}));
//# sourceMappingURL=injectedmain.js.map