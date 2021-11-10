import { createContext, Dispatch, SetStateAction } from "react";

export interface ContextType {
  users: { list: string[]; set: Dispatch<SetStateAction<string[]>> };
  isAuthenticated: { value: boolean; set: Dispatch<SetStateAction<boolean>> };
  // socket: {
  //   socket: TcpSocket.Socket;
  //   set: Dispatch<SetStateAction<TcpSocket.Socket>>;
  // };
}

const Context = createContext({});

export default Context;
