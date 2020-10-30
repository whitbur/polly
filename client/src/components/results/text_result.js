import React from 'react';
import { Box, Typography } from '@material-ui/core';

const TextResult = ({ question, responses }) => {
    if (responses === undefined) {
        return <div>Loading...</div>
    }

    const choices = responses.map(r => r.choice)
    choices.sort((a, b) => a.localeCompare(b))
    
    return <Box>
        <Typography variant="body1">{question.text}</Typography>
        <Box marginX={5} marginTop={2}>
            {choices.map((choice, index) => <Box key={index} border="1px solid white" padding={1} mb="10px">
                <Typography style={{whiteSpace:"pre-line"}}>{choice}</Typography>
            </Box>)}
        </Box>
    </Box>
}

export default TextResult