import { Flex, Spacer } from "@chakra-ui/layout";
import { Heading } from "@chakra-ui/react";
import React from "react";
import SettingsMenu from "./SettingsMenu";

interface MessageHeaderProps {
  name: string;
}

function MessageHeader({name}: MessageHeaderProps) {
    return (
        <Flex 
            flexDirection="row"
            alignItems="center"
            width="100%"
            maxH="20%"
            minH="10%"
        >
            <Heading
                isTruncated
                textAlign="center"
                padding="1em"
                margin="0em"
            >
            {name}
            </Heading>
            <Spacer />
            <SettingsMenu />
        </Flex>
    )
}

export default MessageHeader;
