import { useContext } from "react";
import Context, { ContextType } from "../../../lib/Context";
import { Heading, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';

interface MessageContextButtonProps {
	id: string;
}

function MessageContextButton( {id}: MessageContextButtonProps ) {
	const { socket, serverKeys } = useContext(Context) as ContextType;

    return(
		<Menu>
            <MenuButton
                as={Heading}
                textAlign="center"
                _hover={{
                color: "gray",
                textDecoration: "underline",
                cursor: "pointer",
                }}
                padding="1em"
                margin="0em"
                height="0px"
                verticalAlign="top"
            >
                ...
            </MenuButton>
            <MenuList
                padding="10"
            >
                <MenuItem
                    background="white"
                    color="red"
                    border="0px" 
                    _hover={{
                        color: "red",
                        textDecoration: "underline",
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        if (serverKeys.publicKey === undefined) return;
                        socket.sendMessage(
                            serverKeys.publicKey?.encrypt(
                                `[d]:[]:[${id}]:[]:[]`// Figure out what to put here
                            )
                        );
                    }}
                >
                    Delete Message
                </MenuItem>
            </MenuList>
        </Menu>
    );
}

export default MessageContextButton;