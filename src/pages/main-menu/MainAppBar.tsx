import {
    AppBar,
    Button,
    Divider,
    Icon,
    IconButton,
    ListSubheader,
    Menu,
    MenuItem,
    MenuList,
    Stack,
    Toolbar,
    Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import GithubIcon from "@mui/icons-material/Github";
import React, { useContext, useEffect, useState } from "react";
import { RouteContext, RouteOptions } from "./Router";

const routes: Array<{ name: string; route: RouteOptions }> = [
    { name: "Main Menu", route: "mainMenu" },
    { name: "Battle Simulator", route: "battle" },
    { name: "Asset Collections", route: "assetCollections" },
    { name: "Asset Viewer", route: "assetViewer" },
    { name: "Replica", route: "replica" },
];

interface Props {
    gameAssetsProvided: boolean;
}

function MainAppBar(props: Props) {
    const { gameAssetsProvided } = props;
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [menuIndex, setMenuIndex] = useState(0);
    const [smallWindow, setSmallWindow] = useState(false);
    const setRoute = useContext(RouteContext);

    useEffect(() => {
        const widthChanges = () => {
            if (window.innerWidth <= 400) {
                setSmallWindow(true);
            } else {
                setSmallWindow(false);
            }
        };
        widthChanges();
        addEventListener("resize", widthChanges);
        return () => removeEventListener("resize", widthChanges);
    }, []);

    const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleClickMenu = (index: number) => {
        handleCloseMenu();
        setMenuIndex(index);
        setRoute && setRoute(routes[index].route);
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar variant="regular" sx={{ paddingX: 1 }} disableGutters>
                    <Stack spacing={1} direction="row" flexGrow={1}>
                        <Typography
                            variant="h6"
                            sx={{ cursor: "pointer", marginRight: 1 }}
                            onClick={() => setRoute && setRoute("mainMenu")}
                        >
                            {smallWindow ? "OM" : "OpenMobius"}
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={handleOpenMenu}
                            sx={{
                                width: 200,
                                paddingX: 1,
                                justifyContent: "space-between",
                            }}
                        >
                            {routes[menuIndex].name}
                            <Icon sx={{ lineHeight: 1 }}>
                                <ExpandMoreIcon />
                            </Icon>
                        </Button>
                    </Stack>
                    <IconButton href="https://github.com/pohjantahti/openmobius">
                        <GithubIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Menu open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={handleCloseMenu}>
                <MenuList sx={{ width: 200, paddingY: 0 }}>
                    <MenuItem onClick={() => handleClickMenu(0)}>Main Menu</MenuItem>
                    <Divider />

                    <ListSubheader sx={{ lineHeight: 2 }}>General</ListSubheader>
                    <MenuItem onClick={() => handleClickMenu(1)}>Battle Simulator</MenuItem>
                    <Divider />

                    <ListSubheader sx={{ lineHeight: 2 }}>Game Asset Content</ListSubheader>
                    <MenuItem disabled={!gameAssetsProvided} onClick={() => handleClickMenu(2)}>
                        Asset Collections
                    </MenuItem>
                    <MenuItem disabled={!gameAssetsProvided} onClick={() => handleClickMenu(3)}>
                        Asset Viewer
                    </MenuItem>
                    <MenuItem disabled={!gameAssetsProvided} onClick={() => handleClickMenu(4)}>
                        Replica
                    </MenuItem>
                </MenuList>
            </Menu>
        </>
    );
}

export default MainAppBar;
