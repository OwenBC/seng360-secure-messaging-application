import { Box, Flex, Text } from "@chakra-ui/layout";
import { Heading } from "@chakra-ui/react";
import { ParsedMessage } from "../../../interfaces/ParsedMessage";
import MessageContextButton from "./MessageContextButton";

interface MessageProps {
  message: ParsedMessage;
  activeChat: string;
  image: File | null;
  handleDeleteMessage: (id: string) => void;
}

function Message({
  message,
  activeChat,
  image,
  handleDeleteMessage,
}: MessageProps) {
  return (
    <Flex
      flexDirection={message.from === activeChat ? "row" : "row-reverse"}
      padding="1em"
    >
      <Box
        maxW="sm"
        border="1px"
        paddingX="1em"
        borderColor="black"
        borderStyle="solid"
        borderRadius="15px"
        overflow="hidden"
      >
        <Heading size="xsm">{message.from + " - " + (new Date(message.time)).toLocaleTimeString()}</Heading>
        <Text>{message.text}</Text>
      </Box>
      {message.from === activeChat ? (
        <></>
      ) : (
        <MessageContextButton
          handleDeleteMessage={handleDeleteMessage}
          id={message.id}
        />
      )}
    </Flex>
  );
}

export default Message;
