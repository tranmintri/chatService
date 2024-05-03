import { reducerCases } from "./constants";
export const initialState = {
  userInfo: undefined,
  newUser: false,
  contactsPage: false,
  currentChatUser: undefined,
  currentChat: undefined,
  messages: [],
  groups: [],
  onlineUsers: [],
  socket: undefined,
  socket2: undefined,
  videoCall: undefined,
  voiceCall: undefined,
  incomingVoiceCall: undefined,
  incomingVideoCall: undefined,
  callPage: false,
  callAccepted: false,
  search: false,
  searchValue: "",
  searchStartDate: null,
  searchEndDate: null,
  filterName: "",
  receivedInvitations: [],
  sentInvitations: [],
  friendList: [],
  reactionList: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case reducerCases.SET_FRIENDS:
      return {
        ...state,
        friendList: action.friends,
      };
    case reducerCases.ADD_FRIEND:
      return {
        ...state,
        friendList: [...state.friendList, action.newFriend],
      };
    case reducerCases.REMOVE_FRIEND:
      return {
        ...state,
        friendList: state.friendList?.filter(
          (friend) => friend.id !== action.friend
        ),
      };

    case reducerCases.SET_REACTIONS:
      return {
        ...state,
        reactionList: action.reactionList,
      };
    case reducerCases.ADD_REACTION:
      return {
        ...state,
        reactionList: [...state.reactionList, action.newReaction],
      };
    case reducerCases.REMOVE_REACTIONS:
      return {
        ...state,
        reactionList: state.reactionList?.filter(
          (reaction) => reaction.reactionId !== action.reactionId
        ),
      };

    case reducerCases.SET_SENT_INVITATION:
      return {
        ...state,
        sentInvitations: action.send,
      };
    case reducerCases.ADD_INVITATION:
      return {
        ...state,
        sentInvitations: [...state.sentInvitations, action.newSend],
      };
    case reducerCases.REMOVE_SENT_INVITATION:
      return {
        ...state,
        sentInvitations: state.sentInvitations.filter(
          (invitation) => invitation.receiver !== action.receiverId
        ),
      };
    case reducerCases.SET_RECEIVE_INVITATION:
      return {
        ...state,
        receivedInvitations: action.receive,
      };
    case reducerCases.ADD_RECEIVE_INVITATION:
      return {
        ...state,
        receivedInvitations: [...state.receivedInvitations, action.newReceive],
      };
    case reducerCases.REMOVE_RECEIVE_INVITATION:
      return {
        ...state,
        receivedInvitations: state.receivedInvitations.filter(
          (invitation) => invitation.sender !== action.senderId
        ),
      };

    case reducerCases.SET_USER_INFO:
      return {
        ...state,
        userInfo: action.userInfo,
      };
    case reducerCases.SET_RECEIVE_SOCKET:
      return {
        ...state,
        receiveSocket: action.receiveSocket,
      };

    case reducerCases.SET_NEW_USER:
      return {
        ...state,
        newUser: action.newUser,
      };
    case reducerCases.SET_ALL_CONTACTS_PAGE:
      return {
        ...state,
        contactsPage: action.contactsPage,
      };
    case reducerCases.SET_CALL_PAGE:
      return {
        ...state,
        callPage: action.callPage,
      };
    case reducerCases.SET_SEARCH:
      return {
        ...state,
        search: action.search,
      };
    //start
    case reducerCases.SET_INCOMING_VOICE_CALL:
      return {
        ...state,
        incomingVoiceCall: action.incomingVoiceCall,
      };

    case reducerCases.SET_CALL_ACCEPTED:
      return {
        ...state,
        callAccepted: action.callAccepted,
      };

    //end
    case reducerCases.CHANGE_CURRENT_CHAT_USER:
      return {
        ...state,
        currentChatUser: action.user,
      };
    case reducerCases.SET_CURRENT_CHAT:
      return {
        ...state,
        currentChat: action.chat,
      };
    case reducerCases.SET_MESSAGES:
      return {
        ...state,
        messages: action.messages,
      };
    case reducerCases.SET_ALL_GROUP:
      return {
        ...state,
        groups: action.groups,
      };
    case reducerCases.CREATE_GROUP:
      return {
        ...state,
        groups: [action.groups, ...state.groups],
      };
    case reducerCases.SET_ALL_ONLINE_USER:
      return {
        ...state,
        onlineUsers: action.onlineUsers,
      };
    case reducerCases.ADD_ONLINE_USER:
      return {
        ...state,
        onlineUsers: [...state.onlineUsers, action.newOnlineUsers],
      };
    case reducerCases.REMOVE_ONLINE_USER:
      const updatedOnlineUsers = state.onlineUsers.filter(
        (id) => id !== action.onlineUsers
      );
      return {
        ...state,
        onlineUsers: updatedOnlineUsers,
      };
    case reducerCases.SET_SOCKET:
      return {
        ...state,
        socket: action.socket,
      };
    case reducerCases.SET_SOCKET2:
      return {
        ...state,
        socket2: action.socket2,
      };
    case reducerCases.ADD_MESSAGES:
      return {
        ...state,
        messages: [...state.messages, action.newMessage],
      };
    case reducerCases.SET_SEARCH_VALUE:
      return {
        ...state,
        searchValue: action.searchValue,
      };
    case reducerCases.SET_START_DATE:
      return {
        ...state,
        searchStartDate: action.searchStartDate,
      };
    case reducerCases.SET_END_DATE:
      return {
        ...state,
        searchEndDate: action.searchEndDate,
      };
    case reducerCases.SET_FILTER_NAME:
      return {
        ...state,
        filterName: action.filterName,
      };
    default:
      return state;
  }
};
export default reducer;
