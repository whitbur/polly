import { Box, Typography } from '@material-ui/core';
import React from 'react';

const RankedChoicesResult = ({ question, responses }) => {
    if (responses === undefined) {
        return <div>Loading...</div>
    }
    
    const choiceScores = {}
    const points = question.points || [...Array((question.maxChoices || question.choices)+1).keys()].reverse()
    question.choices.forEach(choice => { choiceScores[choice] = 0 })
    responses.forEach(response => {
        (response.order || []).forEach((choice, index) => {
            if (question.maxChoices === null || index < question.maxChoices) {
                choiceScores[choice] = (choiceScores[choice] || 0) + points[index]
            }
        })
    });
    const choices = Object.keys(choiceScores)
    choices.sort((a, b) => choiceScores[b] - choiceScores[a])
    
    return <Box>
        <Typography variant="body1">{question.text}</Typography>
        <Box marginX={5} marginTop={2}>
            {choices.map((choice, index) => <Typography key={index} component="div">
                {choiceScores[choice]} - {choice}
            </Typography>)}
        </Box>
    </Box>
}

export default RankedChoicesResult