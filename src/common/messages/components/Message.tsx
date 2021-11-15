import { Box, Flex, Text } from '@chakra-ui/layout';
import { Heading } from '@chakra-ui/react';
import React from 'react'

const user = "user0";

interface MessageProps {
	name: string;
	time: string;
	text: string;
	image: File | null;
	onClick: () => void;
}

function Message({ name, time, text, image, onClick }: MessageProps) {
	return (
		<Flex 
			flexDirection={name ===  user ? "row-reverse":"row"} 
			padding="1em"
		>
			<Box maxW="sm" border="1px" paddingX="1em" borderColor="black" borderStyle="solid" borderRadius="15px" overflow="hidden">
				<Heading fontSize="small">
					{name + ' - ' + time}
				</Heading> 
				<Text>
					{text}
				</Text>
			</Box>
			<Heading
				onClick={onClick}
				textAlign="center"
				_hover={{
				  color: "gray",
				  textDecoration: "underline",
				  cursor: "pointer",
				}}
				padding="1em"
				margin="0em"
			>
				...
			</Heading>
		</Flex>
	);
}

export default Message
