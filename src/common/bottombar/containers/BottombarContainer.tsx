import { AddIcon, ChatIcon } from "@chakra-ui/icons";
import { Flex } from "@chakra-ui/layout";
import BottombarButton from "../components/BottombarButton";
import MessageBox from "../components/MessageBox";

function BottombarContainer() {
  return (
    <Flex
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      width="100%"
      maxH="20%"
      minH="10%"
    >
      <BottombarButton icon={<AddIcon />} onClick={() => {}} />
      <MessageBox />
      <BottombarButton icon={<ChatIcon />} onClick={() => {}} />
    </Flex>
  );
}

export default BottombarContainer;
