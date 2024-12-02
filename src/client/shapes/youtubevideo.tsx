import {
	BaseBoxShapeTool,
	BaseBoxShapeUtil,
	HTMLContainer,
	T,
	TLBaseShape,
	stopEventPropagation,
} from "tldraw";
import { parseYouTubeUrl } from "../ts/functions";

type YoutubeVideoShape = TLBaseShape<
	"youtubevideo",
	{ h: number; w: number; text: string }
>;

const DEFAULT_YOUTUBE_URL = "https://www.youtube.com/embed/dQw4w9WgXcQ";

export class YoutubeVideoUtil extends BaseBoxShapeUtil<YoutubeVideoShape> {
	static override type = "youtubevideo" as const;
	static override props = {
		h: T.positiveNumber,
		w: T.positiveNumber,
		text: T.string,
	};

	override getDefaultProps() {
		return {
			h: 200,
			w: 355,
			text: DEFAULT_YOUTUBE_URL,
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
		return true;
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

	override component(shape: YoutubeVideoShape) {
		const isEditing = this.editor.getEditingShapeId() === shape.id;
		const url = parseYouTubeUrl(shape.props.text) || DEFAULT_YOUTUBE_URL;

		return (
			<HTMLContainer
				id={shape.id}
				onPointerDown={isEditing ? stopEventPropagation : undefined}
				onMouseLeave={(e) => {
					stopEventPropagation(e);
				}}
				style={{
					pointerEvents: "all",
					background: "#000",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					gap: 8,
					borderRadius: "5px",
				}}
			>
				{isEditing ? (
					<input
						type="text"
						className="input"
						value={shape.props.text}
						placeholder="Enter a YouTube URL..."
						onChange={(e) => {
							this.editor.updateShape<YoutubeVideoShape>({
								id: shape.id,
								type: "youtubevideo",
								props: {
									text: e.currentTarget.value,
								},
							});
						}}
					/>
				) : (
					<div style={{
						display: "block",
						overflow: "hidden",
						width: "100%",
						height: "100%",
						borderRadius: "4px",
						padding: "5px"
					}}>
					<iframe
						style={{borderRadius:"4px", transform: "scale(0.5)", transformOrigin: "top left"}}
						width="200%"
						height="200%"
						src={url}
						frameBorder="0"
						title="YouTube video player"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						referrerPolicy="strict-origin-when-cross-origin"
						allowFullScreen
					></iframe>
					</div>
				)}
			</HTMLContainer>
		);
	}

	override indicator(shape: YoutubeVideoShape) {
		return <rect width={shape.props.w} height={shape.props.h} />;
	}
}

export class YoutubeVideoShapeTool extends BaseBoxShapeTool {
	static override id = "youtubevideo";
	override shapeType = "youtubevideo";
}
