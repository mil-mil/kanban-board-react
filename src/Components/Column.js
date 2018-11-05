import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Card from './Card';
import uuidv4 from 'uuid';

class Column extends React.Component {
    render(){
        return (
            <div className="col-4">
                <h4 className="column-header">
                    {this.props.name}
                    {this.props.capacity ? ' (' + this.props.capacity + ')' : ''}
                </h4>

                <form id="column-capacity" className="form-inline" onSubmit={(event) => this.props.handleSetCapacity(this.props.id, event.target.elements.namedItem('capacity').value, event)}>
                    <div className="input-group mb-3">
                        <input type="number" className="form-control input-sm capacity-input" name="capacity" placeholder="Set the maximum capacity" aria-label="Recipient's username" aria-describedby="button-addon2" />
                        <div className="input-group-append">
                            <button className="btn btn-seondary btn-sm" type="submit">Save</button>
                        </div>
                    </div>
                </form>

                <Droppable droppableId={this.props.id} type="CARD" isDropDisabled={this.props.capacity !== null && this.props.cards.length >= this.props.capacity}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={{ backgroundColor: snapshot.isDraggingOver ? '#bfbfbf' : '#d9d9d9',  }}
                            className="h-100 card-list"
                            {...provided.droppableProps}
                        >

                            {this.props.cards.map((card, index) => (
                                <Card
                                    key={card.id}
                                    id={index}
                                    content={card.content}
                                    handleRemoveCard={this.props.handleRemoveCard}
                                    cardId={card.id}
                                    columnId={this.props.id}
                                />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>

                <form className="form-inline" onSubmit={(event) => this.props.handleAddNewCard(uuidv4(), event.target.elements.namedItem('content').value, this.props.id, event)}>
                    <div className="input-group mb-3">
                        <input type="text" className="form-control" name="content" placeholder=". . ." aria-label="Recipient's username" aria-describedby="button-addon2" />
                            <div className="input-group-append">
                                <button className="btn btn-success" type="submit" id="button-addon2">Add new</button>
                            </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default Column;