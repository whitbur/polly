import React from 'react'
import { Box, Typography } from '@material-ui/core';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { selectResponseById, upsertResponse } from '../../features/responsesSlice';

const getRenderChoice = (question, choices) => (provided, snapshot, rubric) => (
    <Box {...provided.draggableProps} 
            {...provided.dragHandleProps} 
            ref={provided.innerRef}
            border="1px solid white"
            padding={1}
            marginTop={(question.maxChoices && rubric.source.index === question.maxChoices) ? "50px" : 1}
            fontWeight={(question.maxChoices && rubric.source.index < question.maxChoices) ? "bold" : "normal"}
            style={{backgroundColor: "#424242", ...provided.draggableProps.style}}>
        {choices[rubric.source.index]}
    </Box>
)

const RankedChoiceQuestion = function({ question }) {
    const dispatch = useDispatch()
    const response = useSelector(selectResponseById(question.id)) || {id: question.id, order: question.choices.slice(0, question.maxChoices || -1)}
    const chosenOrder = response.order.concat(question.choices.filter(c => response.order.indexOf(c) === -1))

    const onDragEnd = result => {
        if (!result.destination) {
            return
        }

        const oldOrder = chosenOrder || question.choices
        const newOrder = [...oldOrder]
        const [removed] = newOrder.splice(result.source.index, 1)
        newOrder.splice(result.destination.index, 0, removed)


        dispatch(upsertResponse({id: question.id, order: newOrder.slice(0, question.maxChoices || -1)}))
    }

    const renderChoice = getRenderChoice(question, chosenOrder)

    return <Box>
        <Typography variant="body1">{question.text}</Typography>
        <Box marginX={5} marginTop={2}>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={question.id.toString()} renderClone={renderChoice}>
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {chosenOrder.map((choice, index) => (
                                <Draggable key={choice} draggableId={choice} index={index}>
                                    {renderChoice}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </Box>
    </Box>
}

export default RankedChoiceQuestion