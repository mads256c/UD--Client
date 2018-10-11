namespace InjectedMain {

    function Main(): void {
        CommentHeightFixer.Initialize();
        ConversationChangeObserver.Initialize();
        Comments.Initialize();
        console.log("UD- Starting...");
    }

    class CssClassNames {
        public static readonly CommentHeightDivParent: string = "IWI4RYB-d-r IWI4RYB-d-O IWI4RYB-d-k IWI4RYB-d-f IWI4RYB-d-t IWI4RYB-b-r";

        public static readonly ActiveConversation: string = "IWI4RYB-d-r IWI4RYB-d-G IWI4RYB-d-O IWI4RYB-d-f IWI4RYB-b-c IWI4RYB-b-l IWI4RYB-d-k IWI4RYB-b-k";

        public static readonly CommentSection: string = "IWI4RYB-d-r IWI4RYB-d-O IWI4RYB-d-k IWI4RYB-d-f IWI4RYB-b-e do-select IWI4RYB-d-t";

        public static readonly CommentWrapper: string = "commentmargin";

        public static readonly CommentName: string = "gwt-InlineHTML IWI4RYB-b-b IWI4RYB-b-o green";

        public static readonly CommentText: string = "gwt-HTML IWI4RYB-b-G";

        public static readonly CommentReplyDeleteWrapper: string = "IWI4RYB-d-r IWI4RYB-d-G IWI4RYB-d-O IWI4RYB-d-k IWI4RYB-d-f";

        public static readonly CommentReply: string = "gwt-HTML IWI4RYB-b-F IWI4RYB-b-o";

        public static readonly CommentTimeWrapper: string = "IWI4RYB-b-g IWI4RYB-b-h";

        public static readonly CommentTime: string = "gwt-HTML";
    }

    class CssIds {
        public static readonly CommentTitle: string = "ud--commenttitle";
        public static readonly CommentSection: string = "ud--commentsection";
        public static readonly CommentInput: string = "ud--commentinput";
        public static readonly CommentHelp: string = "ud--commenthelp";
    }

    class CommentHeightFixer {
        private static readonly UpdateRate: number = 100;
        private static Height: number = 0;


        public static Initialize(): void {
            setTimeout(CommentHeightFixer.FixHeight, CommentHeightFixer.UpdateRate);
        }

        private static FixHeight(): void {
            let commentHeightDiv: HTMLScriptElement | null = <HTMLScriptElement>document.getElementsByClassName(CssClassNames.CommentHeightDivParent)[0].nextSibling;
            if (commentHeightDiv !== null) {
                if (CommentHeightFixer.Height !== parseFloat(commentHeightDiv.style.height!.replace("px", ""))) {
                    CommentHeightFixer.Height = parseFloat(commentHeightDiv.style.height!.replace("px", "")) / 3;
                    if (CommentHeightFixer.Height < 100) {
                        CommentHeightFixer.Height = 100;
                    }
                    commentHeightDiv.style.height = CommentHeightFixer.Height + "px";
                }
            }
        }
    }

    class ConversationChangeObserver {
        private static readonly UpdateRate: number = 100;
        private static ConversationId: number = 0;

        public static Initialize(): void {
            setInterval(ConversationChangeObserver.Observe, ConversationChangeObserver.UpdateRate);
        }

        private static Observe(): void {
            if (document.getElementsByClassName(CssClassNames.ActiveConversation).length !== 0) {
                // @ts-ignore
                let activeConversationId = document.getElementsByClassName(CssClassNames.ActiveConversation)[0].__listener.j.k;
                if (ConversationChangeObserver.ConversationId === 0 || activeConversationId !== ConversationChangeObserver.ConversationId) {
                    ConversationChangeObserver.ConversationId = activeConversationId;
                    ConversationChangeObserver.OnConversationChanged(ConversationChangeObserver.ConversationId);
                }
            }
        }

        private static OnConversationChanged(conversationId: number): void {
            console.log(conversationId);

            Comments.RemoveComments();
            Comments.CreateComments(conversationId);
        }

    }

    class Comments {
        public static Initialize(): void {
            document.documentElement.addEventListener("commentsgotten", Comments.OnCommentsGotten, false);
        }

        public static RemoveComments(): void {
            let abortCommentRequestEvent: CustomEvent = new CustomEvent('abortcommentrequests');
            document.documentElement.dispatchEvent(abortCommentRequestEvent);

            let commentTitle: HTMLElement | null = document.getElementById(CssIds.CommentTitle);
            if (commentTitle !== null) {
                commentTitle.remove();
            }

            let commentSection: HTMLElement | null = document.getElementById(CssIds.CommentSection);
            if (commentSection !== null) {
                commentSection.remove();
            }

            let commentInput: HTMLElement | null = document.getElementById(CssIds.CommentInput);
            if (commentInput !== null) {
                commentInput.remove();
            }

            let commentHelp: HTMLElement | null = document.getElementById(CssIds.CommentHelp);
            if (commentHelp !== null) {
                commentHelp.remove();
            }
        }

        public static CreateComments(conversationId: number): void {
            let getCommentsEvent: CustomEvent = new CustomEvent('getcomments', {detail: conversationId});
            document.documentElement.dispatchEvent(getCommentsEvent);
        }

        public static OnCommentsGotten(e: any) {
            let json: any = JSON.parse(e.detail);

            let commentDoc: Element = document.getElementsByClassName(CssClassNames.CommentSection)[0];
            let title: HTMLElement = document.createElement("h3");
            title.id = CssIds.CommentTitle;
            title.innerText = "UD- kommentarfelt";

            commentDoc.appendChild(title);

            let comments: HTMLElement = document.createElement("div");
            comments.id = CssIds.CommentSection;

            commentDoc.appendChild(comments);

            Comment.CommentsArray = [];

            json.forEach(function (commentInfo: any) {
                let replyTo: number | null = null;
                if (commentInfo.ReplyTo !== null) {
                    replyTo = parseInt(commentInfo.ReplyTo);
                }

                let comment = new Comment(parseInt(commentInfo.Id), parseInt(commentInfo.ConversationId), commentInfo.Name, commentInfo.UserId, commentInfo.Text, commentInfo.Time, replyTo).Build();

                if (comment !== null) {
                    comments.appendChild(comment);
                }

            });
        }
    }

    class Comment {

        public static CommentsArray: Array<HTMLElement>;

        private readonly Id: number;
        private readonly ConversationId: number;
        private readonly Name: string;
        private readonly UserId: number;
        private Text: string;
        private readonly Time: string;
        private readonly ReplyTo: number | null;


        constructor(id: number, conversationId: number, name: string, userId: number, text: string, time: string, replyTo: number | null) {
            this.Id = id;
            this.ConversationId = conversationId;
            this.Name = name;
            this.UserId = userId;
            this.Text = text;
            this.Time = time;
            this.ReplyTo = replyTo
        }

        public Build(): HTMLElement | null {
            let commentWrapper: HTMLElement = this.CreateCommentWrapper();
            let commentNameTextWrapper: HTMLElement = this.CreateCommentNameTextWrapper();
            let commentName: HTMLElement = this.CreateCommentName();
            this.CreateUserInfo(commentName);
            let contentWrapper: HTMLElement = this.CreateContentWrapper();
            this.CreateCommentImage(contentWrapper);
            this.CreateCommentVideo(contentWrapper);
            let commentText: HTMLElement = this.CreateCommentText();
            let commentReplyDeleteTimeWrapper: HTMLElement = this.CreateCommentReplyDeleteTimeWrapper();
            let commentReply: HTMLElement = this.CreateCommentReply(commentWrapper);
            let commentDelete: HTMLElement = this.CreateCommentDelete();
            let commentTimeWrapper: HTMLElement = this.CreateCommentTimeWrapper();
            let commentTime: HTMLElement = this.CreateCommentTime();

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

        private CreateCommentWrapper(): HTMLElement {
            let commentWrapper: HTMLElement | null = document.createElement("div");
            commentWrapper.className = CssClassNames.CommentWrapper;

            return commentWrapper;
        }

        private CreateCommentNameTextWrapper(): HTMLElement {
            let commentNameTextWrapper: HTMLElement | null = document.createElement("div");

            return commentNameTextWrapper;
        }

        private CreateCommentName(): HTMLElement {
            let commentName: HTMLElement | null = document.createElement("div");
            commentName.className = CssClassNames.CommentName;
            commentName.innerText = this.Name;


            return commentName;
        }

        private CreateUserInfo(commentName: HTMLElement): void {

            if (this.UserId !== 0) {
                let commentUserInfoEvent: HTMLElement | null = document.createElement("div");
                commentUserInfoEvent.id = "ud--commentuserinfoevent";

                let commentUserInfoName: HTMLElement | null = document.createElement("span");
                commentUserInfoName.innerText = this.Name;
                commentUserInfoName.className = "ud--userinfoname";

                let commentUserInfoImage: HTMLImageElement | null = document.createElement("img");
                commentUserInfoImage.src = "https://www.uddataplus.dk/shared/brugerfoto?brug_id=" + this.UserId;
                commentUserInfoImage.style.marginTop = "10px";
                commentUserInfoImage.style.maxHeight = "100px";
                commentUserInfoImage.style.maxWidth = "100px";
                commentUserInfoImage.className = "ud--userinfoimage";

                commentUserInfoEvent.appendChild(commentUserInfoName);
                commentUserInfoEvent.appendChild(commentUserInfoImage);


                commentName.addEventListener('mouseover', function (e) {
                    commentUserInfoEvent!.style.left = (e.pageX - commentUserInfoEvent!.clientWidth / 2).toString() + "px";
                    commentUserInfoEvent!.style.top = (e.pageY - commentUserInfoEvent!.clientHeight - 20).toString() + "px";
                    document.body.appendChild(commentUserInfoEvent!);

                }, false);

                commentName.addEventListener('mousemove', function (e) {
                    commentUserInfoEvent!.style.left = (e.pageX - commentUserInfoEvent!.clientWidth / 2).toString() + "px";
                    commentUserInfoEvent!.style.top = (e.pageY - commentUserInfoEvent!.clientHeight - 20).toString() + "px";
                }, false);

                commentName.addEventListener('mouseleave', function () {
                    let oldUserInfo: HTMLElement | null = document.getElementById("ud--commentuserinfoevent");

                    if (oldUserInfo !== null) {
                        oldUserInfo.remove();
                    }
                }, false);
            }
        }

        private CreateContentWrapper(): HTMLElement {
            let contentWrapper: HTMLElement | null = document.createElement("div");

            return contentWrapper;
        }

        private CreateCommentImage(contentWrapper: HTMLElement): void {
            let previousImgTag: number = 0;

            let text: string = this.Text;

            while (text.includes("[IMG](", previousImgTag)) {
                previousImgTag = text.indexOf("[IMG](", previousImgTag) + 6;
                let substr: string = text.substring(previousImgTag);
                let url: string = "";
                for (let i: number = 0; i < substr.length; i++) {

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
                    let imageLink: HTMLAnchorElement | null = document.createElement("a");
                    imageLink.href = url;
                    imageLink.target = "_blank";

                    let image: HTMLImageElement | null = document.createElement("img");
                    image.src = url;
                    image.className = "ud--commentimage";

                    imageLink.appendChild(image);

                    contentWrapper.appendChild(imageLink);

                    this.Text = this.Text.replace("[IMG](" + url + ")", "");
                }

            }
        }

        private CreateCommentVideo(contentWrapper: HTMLElement): void {

            let previousVidTag: number = 0;

            let text: string = this.Text;

            while (text.includes("[VID](", previousVidTag)) {
                previousVidTag = text.indexOf("[VID](", previousVidTag) + 6;
                let substr: string = text.substring(previousVidTag);
                let url: string = "";
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
                    let video: HTMLVideoElement | HTMLIFrameElement | null;
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

        private CreateCommentText(): HTMLElement {
            let commentText: HTMLElement | null = document.createElement("div");
            commentText.className = CssClassNames.CommentText;
            commentText.innerText = this.Text;

            return commentText;
        }

        private CreateCommentReplyDeleteTimeWrapper(): HTMLElement {
            let commentReplyDeleteTimeWrapper: HTMLElement | null = document.createElement("div");
            commentReplyDeleteTimeWrapper.className = CssClassNames.CommentReplyDeleteWrapper;

            return commentReplyDeleteTimeWrapper;
        }

        private CreateCommentReply(commentWrapper: HTMLElement): HTMLElement {
            let commentReply: HTMLElement | null = document.createElement("div");
            commentReply.className = CssClassNames.CommentReply;
            commentReply.style.display = "inline-block";
            commentReply.innerText = "Svar";

            let commentReplyEvent: CustomEvent = new CustomEvent("commentreply", {
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

        private CreateCommentDelete(): HTMLElement {
            let commentDelete: HTMLElement | null = document.createElement("div");
            commentDelete.className = CssClassNames.CommentReply;
            commentDelete.style.display = "inline-block";
            commentDelete.style.marginLeft = "5px";
            commentDelete.innerText = "Slet";

            let commentDeleteEvent: CustomEvent = new CustomEvent("deletecomment", {
                detail: {
                    conversationId: this.ConversationId,
                    userId: this.UserId,
                    id: this.Id
                }
            });
            commentDelete.addEventListener("click", function () {
                if (confirm("Er du sikker på at du vil slette denne kommentar?")) {
                    document.documentElement.dispatchEvent(commentDeleteEvent)
                }
            });

            return commentDelete;
        }

        private CreateCommentTimeWrapper(): HTMLElement {
            let commentTimeWrapper: HTMLElement = document.createElement("div");
            commentTimeWrapper.className = CssClassNames.CommentTimeWrapper;
            commentTimeWrapper.style.display = "inline-block";

            return commentTimeWrapper;
        }

        private CreateCommentTime(): HTMLElement {
            let commentTime: HTMLElement = document.createElement("div");
            commentTime.className = CssClassNames.CommentTime;
            commentTime.innerText = this.Time;

            return commentTime;
        }

    }

    Main();
}