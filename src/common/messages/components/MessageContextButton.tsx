import { useContext } from "react";
import Context, { ContextType } from "../../../lib/Context";
import {
  Heading,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";

interface MessageContextButtonProps {
  id: string;
  handleDeleteMessage: (id: string) => void;
}

function MessageContextButton({
  id,
  handleDeleteMessage,
}: MessageContextButtonProps) {
  const { socket, serverKeys } = useContext(Context) as ContextType;

  return (
    <Menu>
      <MenuButton
        as={Heading}
        _hover={{
          color: "gray",
          cursor: "pointer",
        }}
        paddingRight="2"
        size="lg"
      >
        ...
      </MenuButton>
      <MenuList>
        <MenuItem
          color="red"
          onClick={() => {
            if (serverKeys.publicKey === undefined) return;
            socket.sendMessage(
              serverKeys.publicKey?.encrypt(`[d]:[]:[${id}]:[]:[]`)
            );
            handleDeleteMessage(id);
          }}
        >
          Delete Message
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default MessageContextButton;
