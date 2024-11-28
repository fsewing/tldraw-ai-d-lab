import {
	DefaultToolbar,
	DefaultToolbarContent,
	TLComponents,
	TLUiOverrides,
	TldrawUiMenuItem,
	useIsToolSelected,
	useTools,
} from "tldraw";
import { DeepLinkToolbarComponent } from "./DeepLinkToolbar";

export const uiOverrides: TLUiOverrides = {
	tools(editor, tools) {
		// Create a tool item in the ui's context.
		tools.customiframe = {
			id: "customiframe",
			icon: "color",
			label: "customiframe",
			kbd: "i",
			onSelect: () => {
				editor.setCurrentTool("customiframe");
			},
		};
		tools.youtubevideo = {
			id: "youtubevideo",
			icon: "color",
			label: "youtubevideo",
			kbd: "i",
			onSelect: () => {
				editor.setCurrentTool("youtubevideo");
			},
		};
		tools.deeplink = {
			id: "deeplink",
			icon: "color",
			label: "deeplink",
			kbd: "i",
			onSelect: () => {
				editor.setCurrentTool("deeplink");
			},
		};
		return tools;
	},
};
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
	InFrontOfTheCanvas: DeepLinkToolbarComponent,
	Toolbar: (props) => {
		const tools = useTools();
		const isIFrameSelected = useIsToolSelected(tools["customiframe"]);
		const isYoutubeVideoToolSelected = useIsToolSelected(
			tools["youtubevideo"]
		);
		const isDeepLinkToolSelected = useIsToolSelected(tools["deeplink"]);

		return (
			<DefaultToolbar {...props}>
				<TldrawUiMenuItem
					{...tools["customiframe"]}
					isSelected={isIFrameSelected}
				/>
				<TldrawUiMenuItem
					{...tools["youtubevideo"]}
					isSelected={isYoutubeVideoToolSelected}
				/>
				<TldrawUiMenuItem
					{...tools["deeplink"]}
					isSelected={isDeepLinkToolSelected}
				/>
				<DefaultToolbarContent />
			</DefaultToolbar>
		);
	},
};
