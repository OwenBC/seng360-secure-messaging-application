import { Flex } from "@chakra-ui/layout";
import { useContext, useEffect, useState } from "react";
import { ParsedMessage } from "../../../interfaces/ParsedMessage";
import Context, { ContextType } from "../../../lib/Context";
import Message from "../components/Message";
import MessageHeader from "../components/MessageHeader";

interface MessagesContainerProps {
  activeChat: string;
  updateChatLogs: (newChatLogs: Map<string, ParsedMessage[]>) => void;
}

function MessagesContainer({
  activeChat,
  updateChatLogs,
}: MessagesContainerProps) {
  const { chatLogs, clientKey } = useContext(Context) as ContextType;
  const [messageLog, setMessageLog] = useState<ParsedMessage[]>([]);

  useEffect(() => {
    setMessageLog(chatLogs.get(activeChat) ?? []);
  }, [chatLogs, activeChat, setMessageLog]);

  const handleDeleteMessage = (id: string) => {
    const newChatLogs: Map<string, ParsedMessage[]> = new Map(chatLogs);

    var newLogMessages = [...(newChatLogs.get(activeChat) ?? [])];
    newLogMessages = newLogMessages.filter((message) => message.id !== id);

    newChatLogs.set(activeChat, newLogMessages);

    console.log(newLogMessages.filter((message) => message.id === id));
    console.log(newChatLogs);

    updateChatLogs(newChatLogs);
  };

  return (
    <>
      <MessageHeader activeChat={activeChat} />
      <Flex flexDirection="column" overflow="scroll" height="100%" width="100%">
        {messageLog.map((message, index) => {
          return (
            <Message
              key={index}
              activeChat={activeChat}
              message={message}
              image={null}
              handleDeleteMessage={handleDeleteMessage}
            ></Message>
          );
        })}
      </Flex>
    </>
  );
}

export default MessagesContainer;
