import { MouseEvent, useEffect, useRef, useState } from "react";
import {
	BaseBoxShapeTool,
	BaseBoxShapeUtil,
	HTMLContainer,
	T,
	TLBaseShape,
	stopEventPropagation,
} from "tldraw";

type DeepLinkShape = TLBaseShape<
	"deeplink",
	{ h: number; w: number; deeplinkURL: string, description: string }
>;

export function isValidUrl(url: string) {
	try {
		new URL(url);
		return true;
	} catch (err) {
		return false;
	}
}

export class DeepLinkUtil extends BaseBoxShapeUtil<DeepLinkShape> {
	static override type = "deeplink" as const;
	static override props = {
		h: T.positiveNumber,
		w: T.positiveNumber,
		deeplinkURL: T.string,
		description: T.string,
	};

	override getDefaultProps() {
		return {
			h: 247,
			w: 408,
			deeplinkURL: "",
			description: "",
		};
	}
	override canEdit() {
		return true;
	}
	override canResize() {
		return true;
	}
	override hideRotateHandle() {
		return true;
	}
	override isAspectRatioLocked() {
		return false;
	}

	// override getGeometry() {
	// 	return new Rectangle2d({
	// 		width: 32,
	// 		height: 32,
	// 		x: offsetX,
	// 		y: offsetY,
	// 		isFilled: true,
	// 	})
	// }
	override component(shape: DeepLinkShape) {
		const isEditing = this.editor.getEditingShapeId() === shape.id;
		const [isRequested, setIsRequested] = useState(false);
		const ref = useRef<HTMLButtonElement>(null);

		const [value, setValue] = useState("");

		return (
			<HTMLContainer
				id={shape.id}
				onPointerDown={isEditing ? stopEventPropagation : undefined}
				onMouseLeave={(e) => {
						setIsRequested(false)
						stopEventPropagation(e)
						}}
				style={{
					pointerEvents: "all",
					background: "#000",
					color: "white",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					gap: 8,
					borderRadius: "8px",
					position: "relative",
				}}
			>
				{isEditing ? (
					<div>
					<input
						type="text"
						placeholder="Enter a Deeplink URL ..."
						onChange={(e) =>
							this.editor.updateShape<DeepLinkShape>({
							id: shape.id,
							type: 'deeplink',
							props: { deeplinkURL: e.currentTarget.value },
							})
						}					
					/>
					<input
						type="text"
						placeholder="Enter a Description ..."
						onChange={(e) =>
							this.editor.updateShape<DeepLinkShape>({
							id: shape.id,
							type: 'deeplink',
							props: { description: e.currentTarget.value },
							})
						}					
					/>
					</div>
				):(
				<div>
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
						position: "absolute",
						right: "3px",
						top: "3px",
					}}
					title="Click to navigate to the deep link"
					onClick={(e) => {
						this.editor.navigateToDeepLink({ url: shape.props.deeplinkURL });
						stopEventPropagation(e)
					}}
					onPointerDown={(e) => e.stopPropagation()}
					onTouchStart={(e) => e.stopPropagation()}
					onTouchEnd={(e) => e.stopPropagation()}
					// disabled={!isValidUrl(shape.props.deeplinkURL)}
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
							fillRule="evenodd"
							clipRule="evenodd"
							d="M12.3168 6.27013C12.7197 5.8924 13.3525 5.91281 13.7303 6.31573L21.2303 14.3157C21.5909 14.7004 21.5909 15.299 21.2303 15.6836L13.7303 23.6836C13.3525 24.0865 12.7197 24.1069 12.3168 23.7292C11.9139 23.3515 11.8935 22.7186 12.2712 22.3157L19.13 14.9997L12.2712 7.68361C11.8935 7.2807 11.9139 6.64786 12.3168 6.27013Z"
							fill="white"
						/>
					</svg>
				</button>
				</div>
				)}
			</HTMLContainer>
		);
	}

	override indicator(shape: DeepLinkShape) {
		return <rect width={shape.props.w} height={shape.props.h} />;
	}
}

export class DeepLinkShapeTool extends BaseBoxShapeTool {
	static override id = "deeplink";
	override shapeType = "deeplink";
}
