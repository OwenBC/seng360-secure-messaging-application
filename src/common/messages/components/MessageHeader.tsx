import { Flex, Spacer } from "@chakra-ui/layout";
import { Heading } from "@chakra-ui/react";
import SettingsMenu from "./SettingsMenu";
import Line from "../../../shared/Line";

interface MessageHeaderProps {
	activeChat: string;
}

function MessageHeader({activeChat}: MessageHeaderProps) {
	return (
		<>
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
				{activeChat}
				</Heading>
				<Spacer />
				<SettingsMenu />
			</Flex>
			<Line />
		</>
	)
}

export default MessageHeader;
