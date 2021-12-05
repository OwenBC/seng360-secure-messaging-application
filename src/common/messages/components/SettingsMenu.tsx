import { SettingsIcon } from '@chakra-ui/icons'
import { IconButton, Menu, MenuButton, MenuList, MenuItem, MenuDivider } from '@chakra-ui/react'
import { useContext } from "react";
import Context, { ContextType } from "../../../lib/Context";

function SettingsMenu() {
	const { socket, serverKeys } = useContext(Context) as ContextType;
	return (
		<Menu>
			<MenuButton
				as={IconButton}
				aria-label="Settings"
				h="3em"
				w="3em"
				m="1em"
				icon={<SettingsIcon />}
				borderRadius="2em"
				_hover={{
					cursor: "pointer",
				}}
			/>
			<MenuList>
				<MenuItem onClick={() => {window.location.reload();}}>
					Sign out
				</MenuItem>
				<MenuDivider />
				<MenuItem color="red" onClick={() => {
					if (serverKeys.publicKey === undefined) return;
					socket.sendMessage(
					  serverKeys.publicKey?.encrypt('[da]:[None]:[None]:[None]:[None]')
					);
					window.location.reload();
				}}>
					Delete Account
				</MenuItem>
			</MenuList>
		</Menu>
	)
}

export default SettingsMenu