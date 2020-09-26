import { Box, CircularProgress } from '@material-ui/core';
import React, { useEffect } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const Question = function({ question, response, setResponse }) {
  const onDragEnd = result => {
    if (!result.destination) {
      return
    }

    const newResponse = [...response]
    const [removed] = newResponse.splice(result.source.index, 1)
    newResponse.splice(result.destination.index, 0, removed)

    setResponse(newResponse)
  }

  useEffect(() => {
    if (response === undefined || response.length !== question.choices.length) {
      setResponse(question.choices.map(choice => choice.id))
    }
  })
  
  if (response === undefined || response.length !== question.choices.length) {
    return <CircularProgress />
  }

  const orderedChoices = response.map(choiceId => question.choices.find(choice => choice.id === choiceId))

  return <Box>
    <p>{question.text}</p>
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={question.id.toString()}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {orderedChoices.map((choice, index) => (
              <Draggable key={choice.id} draggableId={choice.id.toString()} index={index}>
                {(provided) => (
                  <Box 
                      {...provided.draggableProps} 
                      {...provided.dragHandleProps} 
                      ref={provided.innerRef}
                      border="1px solid white"
                      padding={1}
                      marginTop={1}
                      style={{backgroundColor: "#424242", ...provided.draggableProps.style}}>
                    <b>{index+1}.</b> {choice.text}
                  </Box>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  </Box>
}

export default Question