import { createContext, Dispatch, SetStateAction } from "react";
import { SendMessage, ReadyState } from "react-use-websocket";

export interface ContextType {
  users: { list: string[]; set: Dispatch<SetStateAction<string[]>> };
  isAuthenticated: { value: boolean; set: Dispatch<SetStateAction<boolean>> };
  socket: {
    sendMessage: SendMessage;
    lastMessage: MessageEvent<any> | null;
    readyState: ReadyState;
  };
  messages: {
    history: MessageEvent<any>[];
    setHistory: React.Dispatch<React.SetStateAction<MessageEvent<any>[]>>;
  };
}

const Context = createContext({});

export default Context;
