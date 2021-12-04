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
import { useCallback, useContext, useState } from "react";
import Context, { ContextType } from "../../../lib/Context";

type LoginRegisterType = "Login" | "Register";

interface LoginContainerProps {
  handleUsernameChange: (username: string) => void;
}

function LoginContainer({ handleUsernameChange }: LoginContainerProps) {
  const { socket, serverKeys } = useContext(Context) as ContextType;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const buttonOnClick = useCallback(
    (loginRegisterType: LoginRegisterType) => {
      var sendStr = "";
      if (loginRegisterType === "Login") {
        sendStr = "[login]:";
      } else if (loginRegisterType === "Register") {
        sendStr = "[signup]:";
      }

      if (serverKeys.publicKey === undefined) return;
      socket.sendMessage(
        serverKeys.publicKey?.encrypt(sendStr + `[${username}]:[${password}]`)
      );
    },
    [username, password]
  );

  return (
    <Center flexGrow={1}>
      <VStack height="40%" width="40%" borderStyle="solid" borderWidth="1px">
        <Center flexGrow={1} flexDirection="column">
          <Heading size="lg" p="0.5em">
            Login
          </Heading>
          <HStack>
            <Text>Username: </Text>
            <Input
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
          </HStack>
          <HStack>
            <Text>Password: </Text>
            <Input
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
          </HStack>
        </Center>
        <HStack flexGrow={1} w="100%" justifyContent="space-between">
          <Spacer />
          <Button
            onClick={() => {
              buttonOnClick("Register");
            }}
          >
            Register
          </Button>
          <Spacer />
          <Button
            onClick={() => {
              buttonOnClick("Login");
              handleUsernameChange(username);
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
