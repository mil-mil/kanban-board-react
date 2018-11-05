import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './Column';

class KanbanBoard extends React.Component {
    constructor(){
        super();

        this.apiUrl = 'http://localhost:8000';

        this.state = {};

        this.handleAddNewCard = this.handleAddNewCard.bind(this);
        this.handleSetCapacity = this.handleSetCapacity.bind(this);
        this.handleRemoveCard = this.handleRemoveCard.bind(this);

        this.onDragEnd = (result) => {
            const { source, destination } = result;

            // dropped outside of the droppable area
            if (!destination){
                return;
            }

            // dropped at the same position and in the same column
            if (source.droppableId === destination.droppableId && source.index === destination.index){
                return;
            }

            // reorder in the same column
            if (source.droppableId === destination.droppableId){

                const columnKey = source.droppableId;

                let columnClone = Object.assign({}, this.state.columns[columnKey]);
                let [removed] = columnClone.cardIds.splice(source.index, 1);
                columnClone.cardIds.splice(destination.index, 0, removed);

                const columnsClone = Object.assign({}, this.state.columns);
                columnsClone[columnKey] = columnClone;

                let apiData = columnClone.cardIds.map((cardId, index) => {
                    return {cardId: cardId, columnId: source.droppableId, position: index}
                });

                // optimistic update
                fetch(this.apiUrl + '/card/reorder', {
                    method: 'POST',
                    body: JSON.stringify(apiData)
                });

                this.setState({
                    columns: columnsClone
                });
            }

            // so it was moved in the other column
            else {
                let sourceColumn = this.state.columns[source.droppableId];
                let destinationColumn = this.state.columns[destination.droppableId];

                let clonedSourceColumn = Object.assign({}, sourceColumn);
                let clonedDestinationColumn = Object.assign({}, destinationColumn);

                let [removed] = clonedSourceColumn.cardIds.splice(source.index, 1);
                clonedDestinationColumn.cardIds.splice(destination.index, 0, removed);

                const columnsClone = Object.assign({}, this.state.columns);
                columnsClone[source.droppableId] = clonedSourceColumn;
                columnsClone[destination.droppableId] = clonedDestinationColumn;

                let apiData = [];

                clonedSourceColumn.cardIds.forEach((cardId, index)=>{
                    apiData.push({cardId: cardId, columnId: source.droppableId, position: index});
                });

                clonedDestinationColumn.cardIds.forEach((cardId, index)=>{
                    apiData.push({cardId: cardId, columnId: destination.droppableId, position: index});
                });

                fetch(this.apiUrl + '/card/reorder', {
                    method: 'POST',
                    body: JSON.stringify(apiData)
                });

                this.setState({
                    columns: columnsClone
                });
            }
        }
    }

    getColumns(){
        const columns = this.state.columns;
        let reactColumns = [];

        for (const key in columns){
            const column = columns[key];
            const cards = column.cardIds.map(cardId => this.state.cards[cardId]);
            reactColumns.push(
                <Column
                    key={column.id}
                    id={column.id}
                    cards={cards}
                    name={column.name}
                    handleAddNewCard={this.handleAddNewCard}
                    handleSetCapacity={this.handleSetCapacity}
                    handleRemoveCard={this.handleRemoveCard}
                    capacity={column.maxCards}
                />
            );
        }

        return reactColumns;
    }

    handleAddNewCard(uuid, content, columnId, event){
        event.preventDefault();
        const cardsClone = Object.assign({}, this.state.cards);
        cardsClone[uuid] = {id: uuid, title: 'proba', content: content};

        const columnsClone = Object.assign({}, this.state.columns);
        columnsClone[columnId].cardIds.unshift(uuid);

        this.setState({columns: columnsClone, cards: cardsClone});

        fetch(this.apiUrl + '/card/new', {
            method: 'POST',
            body: JSON.stringify({cardId:uuid, columnId: columnId, content: content})
        });

        event.target.reset();
    }

    handleSetCapacity(columnId, capacity, event){
        event.preventDefault();
        const clonedColumns = Object.assign({}, this.state.columns);
        clonedColumns[columnId]['maxCards'] = capacity;

        this.setState({
            columns: clonedColumns
        });

        fetch(this.apiUrl + '/column/capacity', {
            method: 'POST',
            body: JSON.stringify({columnId: columnId, capacity: capacity})
        });

        event.target.reset();
    }

    handleRemoveCard(columnId, cardId){
        const cardsClone = Object.assign({}, this.state.cards);
        delete cardsClone[cardId];

        const columnsClone = Object.assign({}, this.state.columns);
        columnsClone[columnId]['cardIds'] = columnsClone[columnId]['cardIds'].filter(card => cardId !== card );

        this.setState({
            columns: columnsClone,
            cards: cardsClone
        });

        fetch(this.apiUrl + '/card/delete', {
            method: 'POST',
            body: JSON.stringify({columnId: columnId, cardId: cardId})
        });
    }

    componentDidMount(){
        // fetch the state from the API
        fetch('http://localhost:8000/get-state')
            .then(response =>
                response.json()
            )
            .then(myJson => {
                this.setState(myJson);
            });
    }

    render() {
        return (
            <DragDropContext
                onDragStart={this.onDragStart}
                onDragUpdate={this.onDragUpdate}
                onDragEnd={this.onDragEnd}
            >
                <div style={{minHeight: '500px'}} className="row">
                    {this.getColumns()}
                </div>
            </DragDropContext>
        );
    }
}

export default KanbanBoard;