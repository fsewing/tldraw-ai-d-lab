import { DefaultSizeStyle, TldrawUiIcon, track, useEditor } from "tldraw";
import { isValidUrl } from "./deepLink";
import { useRef, useState } from "react";

// [1]
// Source: https://tldraw.dev/examples/ui/context-toolbar
export const DeepLinkToolbarComponent = track(() => {
	const editor = useEditor();
	const ref = useRef<HTMLButtonElement>(null);
	const [value, setValue] = useState("");

	const showToolbar = editor.isIn("select.idle");
	if (!showToolbar) return null;

	const selectionRotatedPageBounds = editor.getSelectionRotatedPageBounds();
	if (!selectionRotatedPageBounds) return null;

	const selectedShapes = editor.getSelectedShapes();
	const isSingleStickyNote =
		selectedShapes.length === 1 && selectedShapes[0].type === "note";
	if (!isSingleStickyNote) return null;

	// [2]
	const size = editor.getSharedStyles().get(DefaultSizeStyle);
	if (!size) return null;
	const currentSize = size.type === "shared" ? size.value : undefined;

	const pageCoordinates = editor.pageToViewport(
		selectionRotatedPageBounds.point
	);

	return (
		<div
			style={{
				position: "absolute",
				pointerEvents: "all",
				top: pageCoordinates.y - 42,
				left: pageCoordinates.x,
				// [3]
				width: selectionRotatedPageBounds.width * editor.getZoomLevel(),
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
			// [4]
			onPointerDown={(e) => e.stopPropagation()}
		>
			<div
				style={{
					borderRadius: 8,
					display: "flex",
					boxShadow:
						"0 0 0 1px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.1)",
					background: "var(--color-panel)",
					width: "fit-content",
					gap: 8,
					alignItems: "center",
					padding: "3px",
				}}
			>
				<label title="dwq">
					<input
						className="deeplink"
						style={{
							border: "none",
							borderRadius: "5px",
							padding: "5px",
							fontSize: "1rem",
							marginRight: 8,
						}}
						type="text"
						name="deep"
						placeholder="URL"
						value={value}
						onInput={(e) => {
							setValue(e.currentTarget.value);
						}}
						onBlur={(_) => {
							ref.current?.focus();
						}}
					/>
				</label>
				<button
					ref={ref}
					className="deeplink"
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						border: "none",
						gap: 8,
						textDecoration: "none",
						color: "white",
						fontSize: "1.25rem",
						borderRadius: "5px",
						background: "rgb(0, 122, 255)",
						cursor: "pointer",
						// outline: "1px solid red",
						padding: "16px",
						position: "relative",
					}}
					title="Click to navigate to the deep link"
					onClick={(e) => {
						editor.navigateToDeepLink({ url: value });
					}}
					disabled={!isValidUrl(value)}
				>
					<svg
						style={{
							position: "absolute",
							left: "50%",
							top: "50%",
							transform: "translate(-50%, -50%)",
						}}
						width="30"
						height="30"
						viewBox="0 0 30 30"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M12.3168 6.27013C12.7197 5.8924 13.3525 5.91281 13.7303 6.31573L21.2303 14.3157C21.5909 14.7004 21.5909 15.299 21.2303 15.6836L13.7303 23.6836C13.3525 24.0865 12.7197 24.1069 12.3168 23.7292C11.9139 23.3515 11.8935 22.7186 12.2712 22.3157L19.13 14.9997L12.2712 7.68361C11.8935 7.2807 11.9139 6.64786 12.3168 6.27013Z"
							fill="white"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
});
