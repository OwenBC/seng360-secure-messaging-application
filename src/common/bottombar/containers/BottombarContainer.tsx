import { AddIcon, ChatIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/layout";
import { Input } from "@chakra-ui/react";
import Line from "../../../shared/Line";
import BottombarButton from "../components/BottombarButton";

function BottombarContainer() {
  return (
    <>
      <Line />
      <Flex
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        width="100%"
        maxH="20%"
        minH="10%"
      >
        <BottombarButton icon={<AddIcon />} onClick={() => {}} />
        <Flex marginY="0.75em" borderRadius="1em" grow={1}>
          <Input padding="0.75em" width="100%" placeholder="Message" />
        </Flex>
        <BottombarButton icon={<ChatIcon />} onClick={() => {}} />
      </Flex>
    </>
  );
}

export default BottombarContainer;
