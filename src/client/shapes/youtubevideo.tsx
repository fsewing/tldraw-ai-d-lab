import { MouseEvent, useEffect, useRef, useState } from 'react'
import {
	BaseBoxShapeTool,
	BaseBoxShapeUtil,
	HTMLContainer,
	T,
	TLBaseShape,
	stopEventPropagation,
} from 'tldraw'

type YoutubeVideoShape = TLBaseShape<'youtubevideo', { h: number, w: number, text: string }>

export class YoutubeVideoUtil extends BaseBoxShapeUtil<YoutubeVideoShape> {
	static override type = 'youtubevideo' as const
	static override props = {
		h: T.positiveNumber,
		w: T.positiveNumber,
		text: T.string,
	}

	override getDefaultProps() {
		return {
			h: 247,
			w: 408,
			text: "",
		}
	}
	override canEdit() {
		return true
	}
	override canResize() {
		return false
	}
	override hideRotateHandle() {
		return true
	}
	override isAspectRatioLocked() {
		return true
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
		
		const isEditing = this.editor.getEditingShapeId() === shape.id	
		const [isRequested, setIsRequested] = useState(false);
		const ref = useRef<HTMLDivElement>(null)
		return (
			<HTMLContainer
				id={shape.id}
				onPointerDown={isEditing ? stopEventPropagation : undefined}
				onMouseLeave={(e) => {
						setIsRequested(false)
						stopEventPropagation(e)
						}}
				style={{
					pointerEvents: 'all',
					background: '#000',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 8,
					borderRadius: '5px',
				}}
			>
				{isEditing ? (
					<input
						type="text"
						placeholder="Enter a youtube iFrame ..."
						onChange={(e) =>
							this.editor.updateShape<YoutubeVideoShape>({
							id: shape.id,
							type: 'youtubevideo',
							props: { text: e.currentTarget.value },
							})
						}					
					/>
				):(
					<iframe width="368" height="207" src={shape.props.text} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
				)
				}
			</HTMLContainer>
		)
	}

	override indicator(shape: YoutubeVideoShape) {
		return <rect width={shape.props.w} height={shape.props.h} />
	}
}

export class YoutubeVideoShapeTool extends BaseBoxShapeTool {
	static override id = 'youtubevideo'
	override shapeType = 'youtubevideo'
}
