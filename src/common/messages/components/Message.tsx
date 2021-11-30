import { Box, Flex, Text } from "@chakra-ui/layout";
import { Heading } from "@chakra-ui/react";
import MessageContextButton from "./MessageContextButton";

interface MessageProps {
  message: string;
  activeChat: string;
  image: File | null;
}

function Message({ message, activeChat, image }: MessageProps) {
  const regex =
    /^\[(.*)\]:\[([A-Za-z0-9]*)_([A-Za-z0-9]*)\]:\[(.*)\]:\[(.*)\]:\[(.*)\]/;
  const found = message.match(regex);
  if (
    !found ||
    found[1] !== "history" ||
    (found[2] !== activeChat && found[3] !== activeChat)
  )
    return <></>;
  const from = found[2];
  const id = found[4];
  const text = found[5];
  const time = found[6];

  return (
    <Flex
      flexDirection={from === activeChat ? "row" : "row-reverse"}
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
        <Heading size="xsm">{from + " - " + time}</Heading>
        <Text>{text}</Text>
      </Box>
      {from === activeChat ? <></> : <MessageContextButton id={id} />}
    </Flex>
  );
}

export default Message;
