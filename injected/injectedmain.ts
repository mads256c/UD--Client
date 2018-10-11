namespace InjectedMain {

    function Main(): void {
        CommentHeightFixer.Initialize();
        ConversationChangeObserver.Initialize();
    }

    class CssClassNames {
        public static readonly CommentHeightDivParent: string = "IWI4RYB-d-r IWI4RYB-d-O IWI4RYB-d-k IWI4RYB-d-f IWI4RYB-d-t IWI4RYB-b-r";

        public static readonly ActiveConversation: string = "IWI4RYB-d-r IWI4RYB-d-G IWI4RYB-d-O IWI4RYB-d-f IWI4RYB-b-c IWI4RYB-b-l IWI4RYB-d-k IWI4RYB-b-k";

        public static readonly CommentWrapper: string = "commentmargin";

        public static readonly CommentName: string = "gwt-InlineHTML IWI4RYB-b-b IWI4RYB-b-o green";

        public static readonly CommentText: string = "gwt-HTML IWI4RYB-b-G";

        public static readonly CommentReplyDeleteWrapper: string = "IWI4RYB-d-r IWI4RYB-d-G IWI4RYB-d-O IWI4RYB-d-k IWI4RYB-d-f";

        public static readonly CommentReply: string = "gwt-HTML IWI4RYB-b-F IWI4RYB-b-o";
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
            setTimeout(ConversationChangeObserver.Observe, ConversationChangeObserver.UpdateRate);
        }

        private static Observe(): void {
            if (document.getElementsByClassName(CssClassNames.ActiveConversation).length !== 0) {
                // @ts-ignore
                let activeConversationId = document.getElementsByClassName(CssClassNames.ActiveConversationClass)[0].__listener.j.k;
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
    }

    class Comment {

        private Id: number;
        private Name: string;
        private UserId: number;
        private Text: string;


        constructor(id: number, name: string, userId: number, text: string) {
            this.Id = id;
            this.Name = name;
            this.UserId = userId;
            this.Text = text;
        }

        private static CreateCommentWrapper(): HTMLElement {
            let commentWrapper: HTMLElement | null = document.createElement("div");
            commentWrapper.className = CssClassNames.CommentWrapper;

            return commentWrapper;
        }

        private static CreateCommentNameTextWrapper(): HTMLElement {
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
            let commentReplyDeleteTimeWrapper:HTMLElement|null = document.createElement("div");
            commentReplyDeleteTimeWrapper.className = CssClassNames.CommentReplyDeleteWrapper;

            return commentReplyDeleteTimeWrapper;
        }

        private CreateCommentReply(): HTMLElement {
            let commentReply:HTMLElement|null = document.createElement("div");
            commentReply.className = CssClassNames.CommentReply;
            commentReply.style.display = "inline-block";
        }

    }

    Main();
}