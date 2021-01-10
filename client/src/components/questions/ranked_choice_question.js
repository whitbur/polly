import React from 'react'
import { Box, Typography } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useDispatch, useSelector } from 'react-redux'
import { selectResponseById, upsertResponse } from '../../features/responsesSlice'

const RankedChoiceQuestion = function({ question }) {
    const dispatch = useDispatch()
    const theme = useTheme()
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

    return <Box>
        <Typography variant="body1">{question.text}</Typography>
        <Box marginX={5} marginTop={2}>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={question.id.toString()}>
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {chosenOrder.map((choice, index) => (
                                <Draggable key={choice} draggableId={choice} index={index}>
                                    {(provided) => (
                                        <Box {...provided.draggableProps} 
                                                {...provided.dragHandleProps} 
                                                ref={provided.innerRef}
                                                border="1px solid white"
                                                padding={1}
                                                marginTop={(question.maxChoices && index === question.maxChoices) ? "50px" : 1}
                                                fontWeight={(question.maxChoices && index < question.maxChoices) ? "bold" : "normal"}
                                                style={{backgroundColor: theme.palette.background.paper, ...provided.draggableProps.style}}>
                                            {choice}
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
    </Box>
}

export default RankedChoiceQuestion