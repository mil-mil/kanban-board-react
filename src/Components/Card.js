import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

class Card extends React.Component {
    render(){
        return (
            <div>
                <Draggable draggableId={this.props.cardId} index={this.props.id} type="CARD">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="card"
                        >
                            {this.props.content}
                            <img
                                className="delete-icon"
                                src="remove-icon-png-24.png"
                                alt="Delete the card"
                                onClick={(event) => this.props.handleRemoveCard(this.props.columnId, this.props.cardId)}
                            />
                        </div>
                    )}
                </Draggable>
            </div>
        )
    }
}

export default Card;