import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react";
import {
	BaseBoxShapeTool,
	BaseBoxShapeUtil,
	HTMLContainer,
	T,
	TLBaseShape,
	stopEventPropagation,
	useDefaultColorTheme,
	TLDefaultColorStyle,
	TLDefaultSizeStyle,
	DefaultColorStyle,
	DefaultSizeStyle,
} from "tldraw";
// import "../css/DeepLink.css";

type CustomStickyNoteShape = TLBaseShape<
	"customnote",
	{ h: number; w: number; text: string; color: TLDefaultColorStyle }
>;

export function isValidUrl(url: string) {
	try {
		new URL(url);
		return true;
	} catch (err) {
		return false;
	}
}

export class CustomStickyNoteUtil extends BaseBoxShapeUtil<CustomStickyNoteShape> {
	static override type = "customnote" as const;
	static override props = {
		h: T.positiveNumber,
		w: T.positiveNumber,
		text: T.string,
		color: DefaultColorStyle,
	};

	override getDefaultProps() {
		return {
			h: 100,
			w: 100,
			text: "",
			color: DefaultColorStyle.defaultValue,
		} ;
	}
	override canEdit() {
		return true;
	}
	override canResize() {
		return false;
	}
	override hideRotateHandle() {
		return true;
	}
	override isAspectRatioLocked() {
		return false;
	}

	override component(shape: CustomStickyNoteShape) {
		const isEditing = this.editor.getEditingShapeId() === shape.id;
		const theme = useDefaultColorTheme();
		const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
			const { value } = event.currentTarget;

			this.editor.updateShape<CustomStickyNoteShape>({
				id: shape.id,
				type: "customnote",
				props: { text: value },
			});
		};

		return (
			<HTMLContainer
				id={shape.id}
				style={{
					backgroundColor: theme[shape.props.color].solid,
					color: "black",
					pointerEvents: "all",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					gap: 8,
					borderRadius: "4px",
					fontSize: "10px",
				}}
				className="customnote"
				onPointerDown={isEditing ? stopEventPropagation : undefined}
				onMouseLeave={(e) => {
					stopEventPropagation(e);
				}}
			>
				{isEditing ? (
					<div className="">
						<textarea
							style={{
								border: "none",
								outline: "none",
								maxWidth: "100px",
								maxHeight: "100px",
								overflow: "hidden",
								width: "100%",
								fontSize: "10px",
							}}
							type="text"
							name="stickNote"
							className=""
							placeholder=""
							value={shape.props.text}
							onChange={handleChange}
						/>
					</div>
				) : (
					<p>{shape.props.text}</p>
				)}
			</HTMLContainer>
		);
	}

	override indicator(shape: CustomStickyNoteShape) {
		return <rect width={shape.props.w} height={shape.props.h} />;
	}
}

export class CustomStickyNoteShapeTool extends BaseBoxShapeTool {
	static override id = "customnote";
	override shapeType = "customnote";
}


