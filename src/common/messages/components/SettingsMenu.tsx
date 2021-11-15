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
            <MenuList 
                padding="10"
                background="white"
                border="1px"
                borderColor="black"
                borderStyle="solid"
            >
                <MenuItem 
                    background="white" 
                    border="0px"_hover={{
                        color: "gray",
                        textDecoration: "underline",
                        cursor: "pointer",
                    }}
                >
                    Sign out
                </MenuItem>
                <MenuDivider />
                <MenuItem
                    background="white"
                    color="red"
                    border="0px"_hover={{
                        color: "red",
                        textDecoration: "underline",
                        cursor: "pointer",
                    }}
                >
                    Delete Account
                </MenuItem>
            </MenuList>
        </Menu>
    )
}

export default SettingsMenu