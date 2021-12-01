import { SettingsIcon } from '@chakra-ui/icons'
import { IconButton, Menu, MenuButton, MenuList, MenuItem, MenuDivider } from '@chakra-ui/react'
import React from 'react'

function SettingsMenu() {
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
				<MenuItem>
					Sign out
				</MenuItem>
				<MenuDivider />
				<MenuItem color="red">
					Delete Account
				</MenuItem>
			</MenuList>
		</Menu>
	)
}

export default SettingsMenu