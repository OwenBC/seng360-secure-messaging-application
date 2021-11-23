import { Flex } from "@chakra-ui/layout";
import { useContext, useEffect, useState } from "react";
import Context, { ContextType } from "../../../lib/Context";
import Message from "../components/Message";
import MessageHeader from "../components/MessageHeader";

interface MessagesContainerProps {
	activeChat: string;
}

function MessagesContainer( {activeChat} : MessagesContainerProps ) {
  const { messages, clientKey } = useContext(Context) as ContextType;
  const [messageLog, setMessageLog] = useState<string[]>([]);

  useEffect(() => {
    const newMessageLog: string[] = [];

    if (messages.history.length > 4) {
      for (let index = 4; index < messages.history.length; index++) {
        const decryptedMessage = clientKey.key.decrypt(
          Buffer.from(messages.history[index].data),
          "utf8"
        );
        newMessageLog.push(decryptedMessage);
      }
    }
    setMessageLog(newMessageLog);
  }, [messages.history, clientKey.key]);

  return (
    <>
      <MessageHeader activeChat={activeChat} />
      <Flex flexDirection="column" overflow="scroll" height="100%" width="100%">
        {messageLog.map((message, index) => {
          return <Message key={index} activeChat={activeChat} message={message} image={null}></Message>;
        })}
      </Flex>
    </>
  );
}

export default MessagesContainer;
