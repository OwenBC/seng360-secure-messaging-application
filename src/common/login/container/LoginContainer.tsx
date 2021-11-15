import { Input } from "@chakra-ui/input";
import {
  Box,
  Center,
  Heading,
  HStack,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import { useContext, useState } from "react";
import Context, { ContextType } from "../../../lib/Context";

function LoginContainer() {
  const { socket, serverKeys } = useContext(Context) as ContextType;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Center flexGrow={1}>
      <VStack height="40%" width="40%" borderStyle="solid" borderWidth="1px">
        <Center flexGrow={1} flexDirection="column">
          <Heading>Login</Heading>
          <HStack>
            <Text>Username: </Text>
            <Input
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
          </HStack>
          <Box>
            <HStack>
              <Text>Password: </Text>
              <Input
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
              />
            </HStack>
          </Box>
        </Center>
        <HStack flexGrow={1} w="100%" justifyContent="space-between">
          <Spacer />
          <Button onClick={() => {}}>Register</Button>
          <Spacer />
          <Button
            onClick={() => {
              if (serverKeys.publicKey === undefined) return;
              socket.sendMessage(
                serverKeys.publicKey?.encrypt(
                  `[login]:[${username}]:[${password}]`
                )
              );
            }}
          >
            Login
          </Button>
          <Spacer />
        </HStack>
      </VStack>
    </Center>
  );
}

export default LoginContainer;
