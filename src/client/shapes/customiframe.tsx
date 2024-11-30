import { MouseEvent, useEffect, useRef, useState } from "react";
import {
	BaseBoxShapeTool,
	BaseBoxShapeUtil,
	HTMLContainer,
	T,
	TLBaseShape,
	stopEventPropagation,
} from "tldraw";
import "../css/CustomIframe.css";
import { isValidUrl } from "./deeplink";

type CostumIFrameShape = TLBaseShape<
	"customiframe",
	{ h: number; w: number; text: string }
>;

const DEFAULT_URL = "https://aid-lab.hfg-gmuend.de/";

export class CostumIFrameUtil extends BaseBoxShapeUtil<CostumIFrameShape> {
	static override type = "customiframe" as const;
	static override props = {
		h: T.positiveNumber,
		w: T.positiveNumber,
		text: T.string,
	};

	override getDefaultProps() {
		return {
			h: 300,
			w: 500,
			text: "https://aid-lab.hfg-gmuend.de/",
		};
	}
	override canEdit() {
		return true;
	}
	override component(shape: CostumIFrameShape) {
		const isEditing = this.editor.getEditingShapeId() === shape.id;
		const [isRequested, setIsRequested] = useState(false);

		const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
			const { value } = event.currentTarget;

			this.editor.updateShape<CostumIFrameShape>({
				id: shape.id,
				type: "customiframe",
				props: { text: value },
			});
		};

		return (
			<HTMLContainer
				id={shape.id}
				onPointerDown={isEditing ? stopEventPropagation : undefined}
				onMouseLeave={(e) => {
					setIsRequested(false);
					stopEventPropagation(e);
				}}
				style={{
					pointerEvents: "all",
					background: "#000",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					gap: 8,
				}}
			>
				{isEditing ? (
					<input
						type="text"
						className="input"
						value={shape.props.text}
						placeholder="Enter a url..."
						onChange={handleChange}
					/>
				) : (
					<div style={{ width: "100%", height: "100%" }}>
						{isRequested ? (
							<iframe
								id="custom-iframe"
								title="This is a custom iframe"
								width="100%"
								height="100%"
								src={
									isValidUrl(shape.props.text)
										? shape.props.text
										: DEFAULT_URL
								}
							/>
						) : (
							<button
								className="button"
								onClick={(e) => {
									setIsRequested(true);
									stopEventPropagation(e);
								}}
								onPointerDown={(e) => e.stopPropagation()}
								onTouchStart={(e) => e.stopPropagation()}
								onTouchEnd={(e) => e.stopPropagation()}
							>
								Load iframe
							</button>
						)}
					</div>
				)}
			</HTMLContainer>
		);
	}

	override indicator(shape: CostumIFrameShape) {
		return <rect width={shape.props.w} height={shape.props.h} />;
	}
}

export class CostumIFrameShapeTool extends BaseBoxShapeTool {
	static override id = "customiframe";
	override shapeType = "customiframe";
}
