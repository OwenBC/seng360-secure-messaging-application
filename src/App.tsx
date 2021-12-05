import { Center, Flex } from "@chakra-ui/layout";
import { CircularProgress } from "@chakra-ui/progress";
import { useColorMode } from "@chakra-ui/react";
import NodeRSA from "node-rsa";
import { useEffect, useState } from "react";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
import LoginContainer from "./common/login/container/LoginContainer";
import Container from "./common/messages/containers/Container";
import SidebarContainer from "./common/sidebar/containers/SidebarContainer";
import { ParsedMessage } from "./interfaces/ParsedMessage";
import Context, { ContextType } from "./lib/Context";
import { parseMessage } from "./lib/Util";

function App() {
  const [currentChat, setCurrentChat] = useState<string | undefined>(undefined);
  const [loggedInAs, setLoggedInAs] = useState<string | undefined>(undefined);
  const [chatLogs, setChatLogs] = useState<Map<string, ParsedMessage[]>>(
    new Map()
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [serverPublicKey, setServerPublicKey] = useState<NodeRSA | undefined>(
    undefined
  );

  const [nonce, setNonce] = useState<number>(Math.floor(Math.random() * 4096));
  const [isNonceValidated, setIsNonceValidated] = useState(false);

  const [clientKey, setClientKey] = useState<NodeRSA>(new NodeRSA({ b: 1024 }));

  clientKey.setOptions({
    encryptionScheme: "pkcs1",
  });

  const socketUrl = "ws://localhost:9999";
  const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);

  const handleUsernameChange = (username: string) => {
    setLoggedInAs(username);
  };

  const handleCurrentChatChange = (username: string) => {
    setCurrentChat(username);
  };

  const updateChatLogs = (newChatLogs: Map<string, ParsedMessage[]>) => {
    setChatLogs(newChatLogs);
  };

  const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
    socketUrl,
    {
      onOpen: () => {
        console.log("opened");
      },
      onClose: () => {
        console.log("closed");
      },
      //Will attempt to reconnect on all close events, such as server shutting down
      shouldReconnect: (closeEvent) => true,
    }
  );

  useEffect(() => {
    if (readyState === 1) {
      (getWebSocket() as WebSocket).binaryType = "arraybuffer";
    }
  }, [readyState, getWebSocket]);

  const store: ContextType = {
    currentChat: currentChat,
    loggedInAs: loggedInAs,
    chatLogs: chatLogs,
    isAuthenticated: { value: isAuthenticated, set: setIsAuthenticated },
    serverKeys: {
      publicKey: serverPublicKey,
      setPublicKey: setServerPublicKey,
      nonce: nonce,
      setNonce: setNonce,
    },
    clientKey: {
      key: clientKey,
      setKey: setClientKey,
    },
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

  useEffect(() => {
    if (
      (messageHistory.length === 0 ||
        messageHistory[messageHistory.length - 1] !== lastMessage) &&
      lastMessage !== null
    ) {
      const newMessageHistory = [...messageHistory];
      newMessageHistory.push(lastMessage);
      setMessageHistory(newMessageHistory);

      if (lastMessage?.data === undefined) return;
      if (newMessageHistory.length === 1) {
        const key = new NodeRSA();
        key.setOptions({
          encryptionScheme: "pkcs1",
        });
        key.importKey(lastMessage.data, "pkcs1-public-pem");

        setServerPublicKey(key);

        sendMessage(clientKey.exportKey("pkcs1-public-pem"));
        sendMessage(key.encrypt(nonce.toString()));
      } else if (newMessageHistory.length === 2) {
        const buffer = Buffer.from(lastMessage.data);
        const nonceBack = clientKey.decrypt(buffer, "utf8");

        try {
          if (parseInt(nonceBack) === nonce + 1) {
            setNonce(nonce + 1);
            setIsNonceValidated(true);
          }
        } catch (error) {}
      } else if (newMessageHistory.length === 3) {
        const key = new NodeRSA();
        key.setOptions({
          encryptionScheme: "pkcs1",
        });
        key.importKey(lastMessage.data, "pkcs1-public-pem");

        setServerPublicKey(key);
      } else {
        const message = clientKey.decrypt(
          Buffer.from(lastMessage.data),
          "utf8"
        );
        if (message === "[authorized]:[public key]") setIsAuthenticated(true);
        else if (message.includes("[history]") || message.includes("[m]")) {
          const parsedMessage = parseMessage(message);
          if (parsedMessage === null) return;

          var otherUser = "";
          if (parsedMessage.from !== loggedInAs) otherUser = parsedMessage.from;
          else otherUser = parsedMessage.to;

          const newChatLogs: Map<string, ParsedMessage[]> = new Map(chatLogs);

          if (!newChatLogs.has(otherUser)) {
            newChatLogs.set(otherUser, []);
          }
          const newLogMessages = [...(newChatLogs.get(otherUser) ?? [])];
          newLogMessages.push(parsedMessage);

          newChatLogs.set(otherUser, newLogMessages);

          setChatLogs(newChatLogs);
        } else {
          console.log(message);
        }
      }
    }
  }, [
    lastMessage,
    lastMessage?.data,
    clientKey,
    messageHistory,
    nonce,
    sendMessage,
    setServerPublicKey,
    setMessageHistory,
    chatLogs,
    loggedInAs,
  ]);

  const { setColorMode } = useColorMode();
  setColorMode("light");

  var displayedContent;

  if (!isNonceValidated) {
    displayedContent = (
      <Center flexGrow={1}>
        <CircularProgress isIndeterminate />
      </Center>
    );
  } else {
    if (isAuthenticated) {
      displayedContent = (
        <>
          <SidebarContainer handleCurrentChatChange={handleCurrentChatChange} />
          <Container updateChatLogs={updateChatLogs} />
        </>
      );
    } else {
      displayedContent = (
        <LoginContainer handleUsernameChange={handleUsernameChange} />
      );
    }
  }

  return (
    <Context.Provider value={store}>
      <Flex flexDirection="row" height="100vh">
        {displayedContent}
      </Flex>
    </Context.Provider>
  );
}

export default App;
