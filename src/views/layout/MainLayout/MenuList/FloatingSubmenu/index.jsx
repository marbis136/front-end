import PropTypes from "prop-types";
import { useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import Popper from "@mui/material/Popper";
import Typography from "@mui/material/Typography";
import Transitions from "../../../../../ui-component/extended/Transitions";

export default function FloatingSubmenu({ open, anchorEl, onClose, menus }) {
    const theme = useTheme();

    // ⏳ Auto cierre tras 10 segundos
    useEffect(() => {
        if (open) {
            const timer = setTimeout(onClose, 10000);
            return () => clearTimeout(timer);
        }
    }, [open, onClose]);

    return (
        <Popper
            open={open}
            anchorEl={anchorEl}
            placement="right-start"
            disablePortal={false}
            keepMounted
            modifiers={[{ name: "offset", options: { offset: [-6, 0] } }]}
            sx={{ zIndex: 2001 }}
            onMouseLeave={onClose}
        >
            {({ TransitionProps }) => (
                <Transitions in={open} {...TransitionProps}>
                    <Box
                        sx={{
                            position: "relative",
                            "&::before": {
                                content: '""',
                                position: "absolute",
                                left: "-6px",
                                top: "20px",
                                width: 12,
                                height: 12,
                                backgroundColor: theme.palette.background.paper,
                                borderLeft: `1px solid ${theme.palette.divider}`,
                                borderBottom: `1px solid ${theme.palette.divider}`,
                                transform: "rotate(45deg)",
                                zIndex: 0,
                                boxShadow: `-2px 2px 8px ${theme.palette.primary.main}25`
                            }
                        }}
                    >
                        <Paper
                            sx={{
                                borderRadius: 3,
                                minWidth: 200,
                                overflow: "hidden",
                                background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                                backdropFilter: "blur(12px)",
                                border: `1px solid ${theme.palette.divider}`,
                                boxShadow: `0 8px 25px ${theme.palette.primary.main}25`,
                                p: 1.2,
                            }}
                            elevation={8}
                        >
                            <List
                                sx={{
                                    "& .MuiListItemButton-root": {
                                        borderRadius: 2,
                                        color: theme.palette.text.primary,
                                        transition: "all 0.2s ease-in-out",
                                        mb: 0.5,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                        "&:hover": {
                                            bgcolor: theme.palette.primary.light,
                                            color: theme.palette.primary.main,
                                            transform: "translateX(4px)",
                                            boxShadow: `0 3px 10px ${theme.palette.primary.main}40`,
                                        },
                                        "&.Mui-selected": {
                                            bgcolor: theme.palette.primary.light,
                                            color: theme.palette.primary.main,
                                        },
                                    },
                                    "& .MuiListItemIcon-root": {
                                        minWidth: 36,
                                    },
                                }}
                            >
                                {menus.length ? (
                                    menus.map((child, i) => (
                                        <Box key={child.key || i}>
                                            {child}
                                            {i < menus.length - 1 && (
                                                <Box
                                                    sx={{
                                                        height: 1,
                                                        bgcolor: theme.palette.divider,
                                                        opacity: 0.2,
                                                        my: 0.25,
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    ))
                                ) : (
                                    <Typography
                                        variant="body2"
                                        sx={{ color: theme.palette.text.secondary, textAlign: "center", p: 1 }}
                                    >
                                        Sin opciones
                                    </Typography>
                                )}
                            </List>
                        </Paper>
                    </Box>
                </Transitions>
            )}
        </Popper>
    );
}

FloatingSubmenu.propTypes = {
    open: PropTypes.bool,
    anchorEl: PropTypes.any,
    onClose: PropTypes.func,
    menus: PropTypes.array,
};
