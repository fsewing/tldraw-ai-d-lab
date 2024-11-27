import {
	DefaultToolbar,
	DefaultToolbarContent,
	TLComponents,
	TLUiOverrides,
	TldrawUiMenuItem,
	useIsToolSelected,
	useTools,
} from 'tldraw'

export const uiOverrides: TLUiOverrides = {
	tools(editor, tools) {
		// Create a tool item in the ui's context.
		tools.customiframe = {
			id: 'customiframe',
			icon: 'color',
			label: 'customiframe',
			kbd: 'i',
			onSelect: () => {
				editor.setCurrentTool('customiframe')
			},
		}
		return tools
	},
}
/*
const components: Required<TLUiComponents> = {
	ContextMenu: null,
	ActionsMenu: null,
	HelpMenu: null,
	ZoomMenu: null,
	MainMenu: null,
	Minimap: null,
	StylePanel: null,
	PageMenu: null,
	NavigationPanel: null,
	Toolbar: null,
	KeyboardShortcutsDialog: null,
	QuickActions: null,
	HelperButtons: null,
	DebugPanel: null,
	DebugMenu: null,
	SharePanel: null,
	MenuPanel: null,
	TopPanel: null,
	CursorChatBubble: null,
}
*/
export const components: TLComponents = {
	Toolbar: (props) => {
		const tools = useTools()
		const isIFrameSelected = useIsToolSelected(tools['customiframe'])
		return (
			<DefaultToolbar {...props}>
				<TldrawUiMenuItem {...tools['customiframe']} isSelected={isIFrameSelected} />
				<DefaultToolbarContent />
			</DefaultToolbar>
		)
	},
}