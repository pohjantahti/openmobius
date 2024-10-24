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
import React, { useContext, useEffect, useMemo, useState } from "react";
import { RouteContext, RouteOptions } from "./Router";

const routes: Array<{ name: string; route: RouteOptions }> = [
    { name: "Main Menu", route: "mainMenu" },
    { name: "Battle Simulator", route: "battleSimulator" },
    { name: "Asset Viewer", route: "assetViewer" },
    { name: "Replica", route: "replica" },
];

interface Props {
    gameAssetsProvided: boolean;
    route: RouteOptions;
}

function MainAppBar(props: Props) {
    const { gameAssetsProvided, route } = props;
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    const [smallWindow, setSmallWindow] = useState(false);
    const setRoute = useContext(RouteContext);
    const routeName = useMemo(() => routes.filter((a) => a.route === route)[0].name, [route]);

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
        setRoute && setRoute(routes[index].route);
    };

    return (
        <>
            <AppBar position="sticky" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar sx={{ paddingX: 1 }} disableGutters>
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
                            {routeName}
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
                        Asset Viewer
                    </MenuItem>
                    <MenuItem disabled={!gameAssetsProvided} onClick={() => handleClickMenu(3)}>
                        Replica
                    </MenuItem>
                </MenuList>
            </Menu>
        </>
    );
}

export default MainAppBar;
