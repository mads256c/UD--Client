//Global configuration.
const conf =
{
    activeConversationClass: "IWI4RYB-d-r IWI4RYB-d-G IWI4RYB-d-O IWI4RYB-d-f IWI4RYB-b-c IWI4RYB-b-l IWI4RYB-d-k IWI4RYB-b-k",
    updateRate: 100,

    commentClass: "always-visible IWI4RYB-b-s ps-container ps-active-y"
};
//Function that runs itself. It makes sure that we don't pollute the namespace with our variables.
(function main()
{
    console.log("UD- starting");

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



function onConversationChange(conversationId)
{
    console.log("Conversation change: " + conversationId);

    removeComments();
    createComments(conversationId);
}

function removeComments()
{
    let comments = document.getElementById("ud--commentsection");
    if (comments !== undefined && comments !== null)
        comments.remove();
}

function createComments(conversationId)
{
    let comments = document.createElement("div");
    comments.id = "ud--commentsection";
    comments.innerText = "This is a test. Please ignore! :)";

    document.getElementsByClassName(conf.commentClass)[0].parentElement.appendChild(comments);
}