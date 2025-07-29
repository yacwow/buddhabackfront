import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
interface Props {
}
const App: React.FC<Props> = (props) => {
    const { index, item } = props;
    return <Draggable key={item.id} draggableId={item.id} index={index}>
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
    </Draggable>;
}
export default App;