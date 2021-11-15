import { Container, Flex } from "@chakra-ui/layout";
import { useContext, useEffect, useState } from "react";
import Context, { ContextType } from "../../../lib/Context";
import Message from "../components/Message";
import MessageHeaderContainer from "./MessageHeaderContainer";

function MessagesContainer() {
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
      <MessageHeaderContainer />
      <Flex flexDirection="column" overflow="scroll" height="100%" width="100%">
        {messageLog.map((message, index) => {
          return <Container key={index}>{message}</Container>;
        })}
      </Flex>
    </>
  );
}

export default MessagesContainer;
