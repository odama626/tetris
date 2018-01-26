export class Actions {
	public static OPEN_MENU = "HEADER_OPEN_MENU";
	public static TOGGLE_TRAY = 'HEADER_TOGGLE_TRAY';

	public static openMenu(openMenu: string) {
		return {
			type: Actions.OPEN_MENU,
			openMenu
		}
	}

	public static toggleTray() {
		return {
			type: Actions.TOGGLE_TRAY
		}
	}
}

const initialState = {
	openMenu: 'none',
	trayOpen: false,
	hideLinks: false,
	hideMobile: false,
	hideLinksAt: ['/login'],
	hideMobileAt: ['/login']
}

const hide = (list, pathname) => list && list.indexOf(pathname)>0;

export default (state = initialState, action) => {
	switch(action.type) {
		case Actions.OPEN_MENU:
			return {
				...state,
				openMenu: state.openMenu !== action.openMenu? action.openMenu : 'none'
			}
		case Actions.TOGGLE_TRAY:
			return {
				...state,
				trayOpen: !state.trayOpen
			}
	}

	if (action.type.indexOf('@@router') === 0) {
		return {
			...state,
			hideMobile: hide(state.hideMobileAt, action.payload.pathname),
			hideLinks: hide(state.hideLinksAt, action.payload.pathname)
		}
	}

	return state;
}