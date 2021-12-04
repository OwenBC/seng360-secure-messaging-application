import NodeRSA from "node-rsa";
import { createContext, Dispatch, SetStateAction } from "react";
import { SendMessage, ReadyState } from "react-use-websocket";
import { ParsedMessage } from "../interfaces/ParsedMessage";

export interface ContextType {
  currentChat?: string;
  loggedInAs?: string;
  chatLogs: Map<string, ParsedMessage[]>;
  isAuthenticated: { value: boolean; set: Dispatch<SetStateAction<boolean>> };
  serverKeys: {
    publicKey: NodeRSA | undefined;
    setPublicKey: Dispatch<SetStateAction<NodeRSA | undefined>>;
    nonce: number;
    setNonce: Dispatch<SetStateAction<number>>;
  };
  clientKey: {
    key: NodeRSA;
    setKey: Dispatch<SetStateAction<NodeRSA>>;
  };
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
