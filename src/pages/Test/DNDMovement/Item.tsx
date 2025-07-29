import { useDrag } from 'react-dnd';

const Item = ({ item, index }) => {
    const [{ isDragging }, drag] = useDrag({
        item: { type: 'item', id: item.id, index },
        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    });

    return (
        <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
            {item.content}
        </div>
    );

};

export default Item;