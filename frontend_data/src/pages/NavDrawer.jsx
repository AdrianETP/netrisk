import { Drawer, List, ListItem, ListItemText } from "@mui/material";

function NavDrawer({ role }) {
	const drawerItems = {
		admin: ["Dashboard", "Manage Users", "Reports"],
		user: ["Home", "Profile", "Settings"],
	};

	const itemsToDisplay =
		role === "admin" ? drawerItems.admin : drawerItems.user;

	return (
		<Drawer variant="permanent" anchor="left">
			<List>
				{itemsToDisplay.map((item) => (
					<ListItem button key={item}>
						<ListItemText primary={item} />
					</ListItem>
				))}
			</List>
		</Drawer>
	);
}

export default NavDrawer;
