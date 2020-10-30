import React from 'react';
import { Box, Typography } from '@material-ui/core';

/*
 * This Result display can be used when the Question has a `choices` attribute, and the responses
 * each have either `choice` or `choices` attributes.
 */
const ChoicesResult = ({ question, responses }) => {
    if (responses === undefined) {
        return <div>Loading...</div>
    }
    
    const choiceCounts = {}
    question.choices.forEach(choice => { choiceCounts[choice] = 0 })
    responses.forEach(response => {
        (response.choices || []).concat(response.choice || []).forEach(choice => {
            choiceCounts[choice] = (choiceCounts[choice] || 0) + 1
        })
    });
    const choices = Object.keys(choiceCounts)
    choices.sort((a, b) => choiceCounts[b] - choiceCounts[a])
    
    return <Box>
        <Typography variant="body1">{question.text}</Typography>
        <Box marginX={5} marginTop={2}>
            {choices.map((choice, index) => <Typography key={index} component="div">
                {choiceCounts[choice]} - {choice}
            </Typography>)}
        </Box>
    </Box>
}

export default ChoicesResult