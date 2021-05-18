export const types = `
    type Forum {
        _id: String!
        title: String
        description: String
    }

    input ForumDoc {
        title: String
        description: String
    }

    type ForumTopic {
        _id: String!
        title: String
        description: String
    }

    input ForumTopicDoc{
        title: String
        description: String
    }

    type ForumDiscussion{
        _id: String!
        title: String
        description: String
    }

    input ForumDiscussionDoc{
        title: String
        description: String
    }
`;

export const queries = `
    forums: [Forum]
    forumDetail(_id: String!): Forum
    forumsTotalCount: Int

    forumTopics: [ForumTopic]
    forumTopicDetail(_id: String!): ForumTopic
    forumTopicsTotalCount:Int

    forumDiscussions: [ForumDiscussion]
    forumDiscussionDetail(_id: String!): ForumDiscussion
    forumDiscussionsTotalCount: Int
`;

export const mutations = `
    forumsAdd(doc: ForumDoc!): Forum
    forumsEdit(_id: String! doc: ForumDoc): Forum
    forumsRemove(_id: String!): JSON

    forumTopicsAdd(doc: ForumTopicDoc): ForumTopic
    forumTopicsEdit(_id: String! doc: ForumTopicDoc): ForumTopic
    forumTopicsRemove(_id: String!): JSON

    forumDiscussionsAdd(doc: ForumDiscussionDoc): ForumDiscussion
    forumDiscussionsEdit(_id: String! doc: ForumDiscussionDoc): ForumDiscussion
    forumDiscussionsRemove(_id: String!): JSON 
`;
