import {
	DefaultToolbar,
	DefaultToolbarContent,
	TLComponents,
	TLUiOverrides,
	TldrawUiMenuItem,
	useIsToolSelected,
	useTools,
	TLUiAssetUrlOverrides,
} from "tldraw";
import { DeepLinkToolbarComponent } from "./DeepLinkToolbar";

export const uiOverrides: TLUiOverrides = {
	tools(editor, tools) {
		// Create a tool item in the ui's context.
		tools.customiframe = {
			id: "customiframe",
			icon: "customiframe",
			label: "iframe",
			kbd: "i",
			onSelect: () => {
				editor.setCurrentTool("customiframe");
			},
		};
		tools.youtubevideo = {
			id: "youtubevideo",
			icon: "youtubevideo",
			label: "YouTube",
			kbd: "y",
			onSelect: () => {
				editor.setCurrentTool("youtubevideo");
			},
		};
		tools.deeplink = {
			id: "deeplink",
			icon: "deeplink",
			label: "Deep Link",
			kbd: "shift+l",
			onSelect: () => {
				editor.setCurrentTool("deeplink");
			},
		};
		return tools;
	},
};

export const components: TLComponents = {
	// ContextMenu: null,
	ActionsMenu: null,
	HelpMenu: null,
	// ZoomMenu: null,
	MainMenu: null,
	// Minimap: null,
	StylePanel: null,
	// PageMenu: null,
	// NavigationPanel: null,
	// Toolbar: null,
	// KeyboardShortcutsDialog: null,
	QuickActions: null,
	HelperButtons: null,
	DebugPanel: null,
	DebugMenu: null,
	// SharePanel: null,
	// MenuPanel: null,
	// TopPanel: null,
	CursorChatBubble: null,

	//InFrontOfTheCanvas: DeepLinkToolbarComponent,
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

export const customAssetUrls: TLUiAssetUrlOverrides = {
	// relative from the file that requests the assets (e.g. App.tsx)
	icons: {
		customiframe: "./assets/icons/customiframe.svg",
		youtubevideo: "./assets/icons/youtubevideo.svg",
		deeplink: "./assets/icons/deeplink.svg",
	},
};
