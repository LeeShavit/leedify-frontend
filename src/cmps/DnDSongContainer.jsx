import React from 'react'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'

export function DraggableSongContainer({ onDragEnd, children }) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='songs-list'>
        {(provided) => (
          <div className='station-table-body' ref={provided.innerRef} {...provided.droppableProps}>
            {children}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
