import { useSync } from "@tldraw/sync";
import {
	AssetRecordType,
	defaultShapeUtils,
	getHashForString,
	TLAssetStore,
	TLBookmarkAsset,
	Tldraw,
	TLUiComponents,
	uniqueId,
} from "tldraw";
import { CostumIFrameShapeTool, CostumIFrameUtil } from "./shapes/customiframe";
import { YoutubeVideoShapeTool, YoutubeVideoUtil } from "./shapes/youtubevideo";
import { DeepLinkShapeTool, DeepLinkUtil } from "./shapes/deeplink";

import { components, customAssetUrls, uiOverrides } from "./shapes/ui";

import { useMemo } from "react";

const customShapes = [CostumIFrameUtil, YoutubeVideoUtil, DeepLinkUtil];
const customTools = [
	CostumIFrameShapeTool,
	YoutubeVideoShapeTool,
	DeepLinkShapeTool,
];

// const WORKER_URL = `http://localhost:5858`;
const WORKER_URL = `http://aid-playground.hfg-gmuend.de:5858`
// In this example, the room ID is hard-coded. You can set this however you like though.
// const roomId = "test-room-2";
const roomId = "digital-lab";

function App() {
	// Create a store connected to multiplayer.
	const store = useSync({
		shapeUtils: useMemo(() => [...defaultShapeUtils, ...customShapes], []),

		// We need to know the websocket's URI...
		uri: `${WORKER_URL}/connect/${roomId}`,
		// ...and how to handle static assets like images & videos
		assets: multiplayerAssets,
	});

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
					// when the editor is ready, we need to register out bookmark unfurling service
					editor.registerExternalAssetHandler('url', unfurlBookmarkUrl);
					
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
async function unfurlBookmarkUrl({
	url,
}: {
	url: string;
}): Promise<TLBookmarkAsset> {
	const asset: TLBookmarkAsset = {
		id: AssetRecordType.createId(getHashForString(url)),
		typeName: "asset",
		type: "bookmark",
		meta: {},
		props: {
			src: url,
			description: "",
			image: "",
			favicon: "",
			title: "",
		},
	};

	try {
		const response = await fetch(
			`${WORKER_URL}/unfurl?url=${encodeURIComponent(url)}`
		);
		const data = await response.json();

		asset.props.description = data?.description ?? "";
		asset.props.image = data?.image ?? "";
		asset.props.favicon = data?.favicon ?? "";
		asset.props.title = data?.title ?? "";
	} catch (e) {
		console.error(e);
	}

	return asset;
}

export default App;
