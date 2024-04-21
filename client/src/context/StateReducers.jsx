import { reducerCases } from "./constants";
export const initialState = {
  userInfo: undefined,
  newUser: false,
  contactsPage: false,
  currentChatUser: undefined,
  currentChat: undefined,
  messages: [],
  groups: [],
  receivedInvitations: [],
  sentInvitations: [],
  socket: undefined,
  socket2: undefined,
  videoCall: undefined,
  voiceCall: undefined,
  incomingVoiceCall: undefined,
  incomingVideoCall: undefined,

  callPage: false,

  callAccepted: false,
  callEnded: false,
  caller: undefined,
  callerSignal: undefined,
  myStream: undefined,
  remoteStream: undefined,
  myVideo: undefined,
  remoteVideo: undefined,
  peerConnections: undefined,
};

const reducer = (state, action) => {
  switch (action.type) {
    case reducerCases.SET_PEER_CONNECTION:
      console.log("setpeer");
      console.log({ peer: action.setPeer });
      return {
        ...state,
        peerConnections: action.peerConnections,
      };
    case reducerCases.SET_REMOTE_VIDEO:
      return {
        ...state,
        remoteVideo: action.remoteVideo,
      };
    case reducerCases.SET_MY_VIDEO:
      return {
        ...state,
        myVideo: action.myVideo,
      };
    case reducerCases.SET_REMOTE_STREAM:
      return {
        ...state,
        remoteStream: action.remoteStream,
      };
    case reducerCases.SET_MY_STREAM:
      return {
        ...state,
        myStream: action.myStream,
      };
    case reducerCases.SET_CALLER:
      return {
        ...state,
        caller: action.caller,
      };
    case reducerCases.SET_CALLER_SIGNAL:
      return {
        ...state,
        callerSignal: action.callerSignal,
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
    case reducerCases.SET_CALL_END:
      return {
        ...state,
        callEnded: action.callEnded,
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
    default:
      return state;
  }
};
export default reducer;
