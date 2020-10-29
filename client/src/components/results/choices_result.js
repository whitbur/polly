import { Box } from '@material-ui/core';
import React from 'react';

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
        {choices.map((choice, index) => <div key={index}>
            {choiceCounts[choice]} - {choice}
        </div>)}
    </Box>
}

export default ChoicesResult