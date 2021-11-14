import { Flex } from "@chakra-ui/layout";
import { useState } from "react";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import Container from "./common/messages/containers/Container";
import SidebarContainer from "./common/sidebar/containers/SidebarContainer";
import Context, { ContextType } from "./lib/Context";

function App() {
  const [users, setUsers] = useState(["user1", "user2"]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const socketUrl = "ws://localhost:9999";
  const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => console.log("opened"),
    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => true,
  });

  const store: ContextType = {
    users: { list: users, set: setUsers },
    isAuthenticated: { value: isAuthenticated, set: setIsAuthenticated },
    socket: {
      sendMessage: sendMessage,
      lastMessage: lastMessage,
      readyState: readyState,
    },
    messages: {
      history: messageHistory,
      setHistory: setMessageHistory,
    },
  };

  return (
    <Context.Provider value={store}>
      <Flex flexDirection="row" height="100vh">
        <SidebarContainer />
        <Container />
      </Flex>
    </Context.Provider>
  );
}

export default App;
