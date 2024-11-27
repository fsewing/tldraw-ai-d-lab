import { MouseEvent, useEffect, useRef, useState } from 'react'
import {
	BaseBoxShapeTool,
	BaseBoxShapeUtil,
	HTMLContainer,
	T,
	TLBaseShape,
	stopEventPropagation,
} from 'tldraw'

type CostumIFrameShape = TLBaseShape<'customiframe', { h: number, w: number, text: string }>

export class CostumIFrameUtil extends BaseBoxShapeUtil<CostumIFrameShape> {
	static override type = 'customiframe' as const
	static override props = {
		h: T.positiveNumber,
		w: T.positiveNumber,
		text: T.string,
	}

	override getDefaultProps() {
		return {
			h: 300,
			w: 500,
			text: "https://aid-lab.hfg-gmuend.de/",
		}
	}
	override canEdit() {
		return true
	}
	override component(shape: CostumIFrameShape) {
		
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
				}}
			>
				{isEditing ? (
					<input
						type="text"
						placeholder="Enter a url..."
						onChange={(e) =>
							this.editor.updateShape<CostumIFrameShape>({
							id: shape.id,
							type: 'customiframe',
							props: { text: e.currentTarget.value },
							})
						}					
					/>
				):(<div>
				{isRequested? 
					(<iframe id="custom-iframe" title="custom iFrame" width="660" height="335" src={shape.props.text} />)
				:
					(<button onClick={(e) => {
						setIsRequested(true)
						stopEventPropagation(e)
						}} 
						onPointerDown={(e) => e.stopPropagation()}
						onTouchStart={(e) => e.stopPropagation()}
						onTouchEnd={(e) => e.stopPropagation()}
						>
						load iframe
					</button>)}	
					</div>)
				}
			</HTMLContainer>
		)
	}

	override indicator(shape: CostumIFrameShape) {
		return <rect width={shape.props.w} height={shape.props.h} />
	}
}

export class CostumIFrameShapeTool extends BaseBoxShapeTool {
	static override id = 'customiframe'
	override shapeType = 'customiframe'
}
