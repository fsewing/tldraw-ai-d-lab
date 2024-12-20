import { useSync } from "@tldraw/sync";
import {
	AssetRecordType,
	defaultShapeUtils,
	getHashForString,
	TLAssetStore,
	TLBookmarkAsset,
	TLCameraOptions,
	Tldraw,
	TLUiComponents,
	uniqueId,
} from "tldraw";
import { CostumIFrameShapeTool, CostumIFrameUtil } from "./shapes/customiframe";
import { YoutubeVideoShapeTool, YoutubeVideoUtil } from "./shapes/youtubevideo";
import { DeepLinkShapeTool, DeepLinkUtil } from "./shapes/deeplink";
// import { CustomStickyNoteShapeTool, CustomStickyNoteUtil } from "./shapes/customStickyNote";

import { components, customAssetUrls, uiOverrides} from "./shapes/ui";

import { useEffect, useMemo } from "react";
// import { unfurl } from "../server/unfurl";
// DefaultColorThemePalette.lightMode.black.solid = "rgb(252, 225, 156)"
// DefaultColorThemePalette.lightMode.grey.solid = "rgb(0, 0, 0)"

const permissionMode = "visitor" as "user" | "admin" | "student" | "visitor";
// const user = "user";

const customShapes = [CostumIFrameUtil, YoutubeVideoUtil, DeepLinkUtil,];
const customTools = [
	CostumIFrameShapeTool,
	YoutubeVideoShapeTool,
	DeepLinkShapeTool,
];

// const WORKER_URL = `http://localhost:5858`;
const WORKER_URL = `http://aid-playground.hfg-gmuend.de:5858`
// In this example, the room ID is hard-coded. You can set this however you like though.
// const roomId = "test-room-2";
// const roomId = "digital-lab";
const roomId = "digital-lab-production";


const CAMERA_OPTIONS: Partial<TLCameraOptions> = {
	wheelBehavior: 'zoom',
	zoomSteps: [0.01, 0.01, 0.25, 0.5, 1, 2, 3],
}


function App() {
	// Create a store connected to multiplayer.
	const store = useSync({
		shapeUtils: useMemo(() => [...defaultShapeUtils, ...customShapes], []),

		// We need to know the websocket's URI...
		uri: `${WORKER_URL}/connect/${roomId}`,
		// ...and how to handle static assets like images & videos
		assets: multiplayerAssets,
	});

	useEffect(() => {
		console.log("Geladen");

		function onLoaded() {
			console.log("Loaded");
		}

		window.addEventListener("DOMContentLoaded", onLoaded)

		return () => {
			window.removeEventListener("DOMContentLoaded", onLoaded)
		}
	}, [])

	return (
		<div style={{ position: "fixed", inset: 0 }}>
			<Tldraw
				// we can pass the connected store into the Tldraw component which will handle
				// loading states & enable multiplayer UX like cursors & a presence menu
				store={store}
				shapeUtils={customShapes}
				tools={customTools}
				assetUrls={customAssetUrls}
				overrides={uiOverrides}
				components={components}
				onMount={(editor) => {
					// @ts-expect-error
					window.editor = editor;
					// editor.updateInstanceState({ 
					// 	isReadonly: true 
					// })
					// alert(editor.getIsReadonly)
					// editor.getInstanceState()


					editor.registerExternalAssetHandler('url', unfurlBookmarkUrl);
					editor.setCameraOptions(CAMERA_OPTIONS);

					// Jedes Erstellte Element wird einem User zugeordnet "admin" oder "user"

					editor.sideEffects.registerBeforeCreateHandler('shape', (shape, source) => {
						if (source === 'remote') return shape
						return { ...shape, meta: { createdBy: permissionMode } }
					})


					editor.sideEffects.registerBeforeChangeHandler('shape', (prev, next) => {
						const meta = prev.meta

						if (permissionMode === "admin") return next;

						if (permissionMode === "student" && meta.createdBy === "student") return next;
						
						if (
							next.x !== prev.x ||
							next.y !== prev.y ||
							next.rotation !== prev.rotation ||
							next.props.w !== prev.props.w ||
							next.props.h !== prev.props.h ||
							next.props?.text !== prev.props?.text ||
							next.props?.url !== prev.props?.url ||
							next.props?.description !== prev.props?.description
						) {
							return prev
						}
						return next
					})



					editor.sideEffects.registerBeforeDeleteHandler('shape', (shape, source) => {
						
						if (source === 'remote') return
						if(permissionMode == "user"){
							const meta = shape.meta
							if ( meta.createdBy == "admin") return false
						}
						return 
					})

					// editor.updateInstanceState({ isReadonly: true })
					// editor.setCurrentTool('hand')
					// const defaultProps = editor.getShapeUtil('note').getDefaultProps()
					// editor.getShapeUtil('note').getDefaultProps = () => ({...noteShapeProps})
					// editor.setCamera();
					editor.run(() => {
						editor.setCamera({ x: 0, y: 0, z: 1 })

						// editor.navigateToDeepLink({
						// 	param: 'x',
						// 	url: "http://aid-playground.hfg-gmuend.de:5757/?d=v-1051.-555.2490.1328.FpSlTxKLejyf4jWDhOBG2",
						// });
						// editor.createShape({type: 'note', x: 0, y: 0, props: { text: 'ok' } })
					})
					
				}}

				deepLinks={{
					// log the new search params to the console instead of updating `window.location`
					onChange(url, editor) {
						// Replace the current search params with the new one
						window.history.replaceState(null, "", url.search);
					},
					// set the debounce interval to 100ms instead of 500ms
					debounceMs: 100,
				}}
			/>
		</div>
	);
}

// How does our server handle assets like images and videos?
const multiplayerAssets: TLAssetStore = {
	// to upload an asset, we prefix it with a unique id, POST it to our worker, and return the URL
	async upload(_asset, file) {
		const id = uniqueId();

		const objectName = `${id}-${file.name}`;
		const url = `${WORKER_URL}/uploads/${encodeURIComponent(objectName)}`;

		const response = await fetch(url, {
			method: "PUT",
			body: file,
		});

		if (!response.ok) {
			throw new Error(`Failed to upload asset: ${response.statusText}`);
		}

		return url;
	},
	// to retrieve an asset, we can just use the same URL. you could customize this to add extra
	// auth, or to serve optimized versions / sizes of the asset.
	resolve(asset) {
		return asset.props.src;
	},
};

// How does our server handle bookmark unfurling?
async function unfurlBookmarkUrl({ url }: { url: string }): Promise<TLBookmarkAsset> {
	const asset: TLBookmarkAsset = {
		id: AssetRecordType.createId(getHashForString(url)),
		typeName: 'asset',
		type: 'bookmark',
		meta: {},
		props: {
			src: url,
			description: '',
			image: '',
			favicon: '',
			title: '',
		},
	}
	console.log("Hallo");
	console.log(url);
	console.log(new URL(url));

	try {
		const response = await fetch(`${WORKER_URL}/unfurl_test/${encodeURIComponent(url)}`)

		// const response = await fetch(`${WORKER_URL}/unfurl?url=${encodeURIComponent(url)}`)
		const data = await response.json()

		asset.props.description = data?.description ?? ''
		asset.props.image = data?.image ?? ''
		asset.props.favicon = data?.favicon ?? ''
		asset.props.title = data?.title ?? ''
	} catch (e) {
		console.error(e)
	}

	return asset
}

export default App;
