import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// fake data generator
const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k + offset}`,
        content: `item ${k + offset}`
    }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    const [anotherRemove] = destClone.splice(droppableDestination.index, 1, removed);
    sourceClone.splice(droppableSource.index, 0, anotherRemove);
    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    width: 300,
    height: 300,
    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    display: 'flex',
    padding: grid,
    width: '100%'
});
const totalList = [{ id: `item1`, content: `item 1` }, { id: `item2`, content: `item 2` }, { id: `item3`, content: `item 3` },
{ id: `item4`, content: `item 4` }, { id: `item5`, content: `item 5` }, { id: `item6`, content: `item 6` },
{ id: `item7`, content: `item 7` }, { id: `item8`, content: `item 8` }, { id: `item9`, content: `item 9` }, { id: `item0`, content: `item 0` },

{ id: `item1`, content: `item 1` }, { id: `item2`, content: `item 2` }, { id: `item3`, content: `item 3` },
{ id: `item4`, content: `item 4` }, { id: `item5`, content: `item 5` }, { id: `item6`, content: `item 6` },
{ id: `item7`, content: `item 7` }, { id: `item8`, content: `item 8` }, { id: `item9`, content: `item 9` }, { id: `item0`, content: `item 0` },

{ id: `item1`, content: `item 1` }, { id: `item2`, content: `item 2` }, { id: `item3`, content: `item 3` },
{ id: `item4`, content: `item 4` }, { id: `item5`, content: `item 5` }, { id: `item6`, content: `item 6` },
{ id: `item7`, content: `item 7` }, { id: `item8`, content: `item 8` }, { id: `item9`, content: `item 9` }, { id: `item0`, content: `item 0` },

{ id: `item1`, content: `item 1` }, { id: `item2`, content: `item 2` }, { id: `item3`, content: `item 3` },
{ id: `item4`, content: `item 4` }, { id: `item5`, content: `item 5` }, { id: `item6`, content: `item 6` },
{ id: `item7`, content: `item 7` }, { id: `item8`, content: `item 8` }, { id: `item9`, content: `item 9` }, { id: `item0`, content: `item 0` },

{ id: `item1`, content: `item 1` }, { id: `item2`, content: `item 2` }, { id: `item3`, content: `item 3` },
{ id: `item4`, content: `item 4` }, { id: `item5`, content: `item 5` }, { id: `item6`, content: `item 6` },
{ id: `item7`, content: `item 7` }, { id: `item8`, content: `item 8` }, { id: `item9`, content: `item 9` }, { id: `item0`, content: `item 0` },

{ id: `item1`, content: `item 1` }, { id: `item2`, content: `item 2` }, { id: `item3`, content: `item 3` },
{ id: `item4`, content: `item 4` }, { id: `item5`, content: `item 5` }, { id: `item6`, content: `item 6` },
{ id: `item7`, content: `item 7` }, { id: `item8`, content: `item 8` }, { id: `item9`, content: `item 9` }, { id: `item0`, content: `item 0` },
]

class App extends Component {
    state = {
        items: getItems(5),
        selected: getItems(5, 10)
    };

    /**
     * A semi-generic way to handle multiple lists. Matches
     * the IDs of the droppable container to the names of the
     * source arrays stored in the state.
     */
    id2List = {
        droppable: 'items',
        droppable2: 'selected'
    };

    getList = id => this.state[this.id2List[id]];

    onDragEnd = result => {
        const { source, destination } = result;
        console.log(source, destination, result)
        // dropped outside the list
        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                this.getList(source.droppableId),
                source.index,
                destination.index
            );

            let state = { items };
            // for (let key in this.id2List) {
            //     if(source.droppableId===key){
            //         console.log(this.id2List[key])
            //         // state={this.id2List[key]:items}
            //     }
            // }
            console.log(items)
            if (source.droppableId === 'droppable2') {
                state = { selected: items };
            }

            this.setState(state);
        } else {
            const result = move(
                this.getList(source.droppableId),
                this.getList(destination.droppableId),
                source,
                destination
            );

            this.setState({
                items: result.droppable,
                selected: result.droppable2
            });
        }
    };

    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable" direction='horizontal'>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}>
                            {this.state.items.map((item, index) => (
                                <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={getItemStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style
                                            )}>
                                            {item.content}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
                <Droppable droppableId="droppable2" direction='horizontal'>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}>
                            {this.state.selected.map((item, index) => (
                                <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={getItemStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style
                                            )}>
                                            {item.content}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    }
}

export default App;




// import React, { Component, useState } from "react";
// import ReactDOM from "react-dom";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// // fake data generator
// const getItems = count =>
//     Array.from({ length: count }, (v, k) => k).map(k => ({
//         id: `item-${k}`,
//         content: `item ${k}`
//     }));
//     const getItems1 = count =>
//     Array.from({ length: count }, (v, k) => k).map(k => ({
//         id: `item-${k+10}`,
//         content: `item ${k+10}`
//     }));
// // a little function to help us with reordering the result
// const reorder = (list, startIndex, endIndex) => {
//     console.log(list,startIndex,endIndex)
//     const result = Array.from(list);
//     const [removed] = result.splice(startIndex, 1);
//     result.splice(endIndex, 0, removed);

//     return result;
// };

// const grid = 8;

// const getItemStyle = (isDragging, draggableStyle) => ({
//     // some basic styles to make the items look a bit nicer
//     userSelect: 'none',
//     padding: grid * 2,
//     margin: `0 ${grid}px 0 0`,
//     width: 300,
//     height: 300,
//     // change background colour if dragging
//     background: isDragging ? 'lightgreen' : 'grey',

//     // styles we need to apply on draggables
//     ...draggableStyle,
// });

// const getListStyle = isDraggingOver => ({
//     background: isDraggingOver ? 'lightblue' : 'lightgrey',
//     display: 'flex',
//     padding: grid,
//     overflow: 'auto',
//     width: '100%'
// });

// const App = () => {

//     const [items, setItems] = useState(getItems(4));
//     const [items1, setItems1] = useState(getItems1(4))

//     const onDragEnd = (result) => {
//         console.log(result);
//         // dropped outside the list
//         if (!result.destination) {
//             return;
//         }

//         const newItems = reorder(
//             items,
//             result.source.index,
//             result.destination.index
//         );

//         setItems(newItems);
//     }

//     // Normally you would want to split things out into separate components.
//     // But in this example everything is just done in one place for simplicity

//     return (
//         <DragDropContext onDragEnd={onDragEnd}>
//             <Droppable droppableId="droppable" direction="horizontal">
//                 {(provided, snapshot) => (
//                     <div
//                         ref={provided.innerRef}
//                         style={getListStyle(snapshot.isDraggingOver)}
//                         {...provided.droppableProps}
//                     >
//                         {items.map((item, index) => (
//                             <Draggable key={item.id} draggableId={item.id} index={index}>
//                                 {(provided, snapshot) => (
//                                     <div
//                                         ref={provided.innerRef}
//                                         {...provided.draggableProps}
//                                         {...provided.dragHandleProps}
//                                         style={getItemStyle(
//                                             snapshot.isDragging,
//                                             provided.draggableProps.style
//                                         )}
//                                     >
//                                         {item.content}
//                                     </div>
//                                 )}
//                             </Draggable>
//                         ))}
//                         {provided.placeholder}
//                     </div>
//                 )}
//             </Droppable>
//             <Droppable droppableId="droppable1" direction="horizontal">
//                 {(provided, snapshot) => (
//                     <div
//                         ref={provided.innerRef}
//                         style={getListStyle(snapshot.isDraggingOver)}
//                         {...provided.droppableProps}
//                     >
//                         {items1.map((item, index) => (
//                             <Draggable key={item.id} draggableId={item.id} index={index}>
//                                 {(provided, snapshot) => (
//                                     <div
//                                         ref={provided.innerRef}
//                                         {...provided.draggableProps}
//                                         {...provided.dragHandleProps}
//                                         style={getItemStyle(
//                                             snapshot.isDragging,
//                                             provided.draggableProps.style
//                                         )}
//                                     >
//                                         {item.content}
//                                     </div>
//                                 )}
//                             </Draggable>
//                         ))}
//                         {provided.placeholder}
//                     </div>
//                 )}
//             </Droppable>
//         </DragDropContext>
//     );

// }
// export default App;
// Put the thing into the DOM!
// ReactDOM.render(<App />, document.getElementById("root"));





// import React, { useState } from 'react';
// import DragDropContext from 'react-beautiful-dnd'
// import DroppableContent from './DroppableContent'
// interface Props {
// }
// const App: React.FC<Props> = (props) => {
//     const getItems = (count:number) =>
//         Array.from({ length: count }, (v, k) => k).map(k => ({
//             id: `item-${k}`,
//             content: `item ${k}`
//         }));
//     const [items, setItem] = useState(getItems(10));
//     const reorder = (list, startIndex, endIndex) => {
//         const result = Array.from(list);
//         const [removed] = result.splice(startIndex, 1);
//         result.splice(endIndex, 0, removed);

//         return result;
//     };
//     const onDragEnd = (result) => {
//         // dropped outside the list
//         if (!result.destination) {
//             return;
//         }

//         const items = reorder(
//             items,
//             result.source.index,
//             result.destination.index
//         );

//         setItem(items);
//     }
//     return (
//         <DragDropContext onDragEnd={onDragEnd}>
//             <DroppableContent items={items}></DroppableContent>
//         </DragDropContext>
//     )
// };
// export default App;