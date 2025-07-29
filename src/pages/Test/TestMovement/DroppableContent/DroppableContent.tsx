import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import DragableContext from '../DragAndList';

interface Props {
    items:any
}
const App: React.FC<Props> = (props) => {
    const{items}=props;
    return (
        <Droppable droppableId="droppable">
            {(provided, snapshot) => (
                <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    // style={getListStyle(snapshot.isDraggingOver)}
                >
                    {items.map((item, index:number) => (
                        <DragableContext item={item} index={index} key={index}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    // style={getItemStyle(
                                    //     snapshot.isDragging,
                                    //     provided.draggableProps.style
                                    // )}
                                >
                                    {item.content}
                                </div>
                            )}
                        </DragableContext>
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    )
};
export default App;