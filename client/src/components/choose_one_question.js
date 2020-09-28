import { Box, CircularProgress, FormControlLabel, Radio, RadioGroup, Typography } from '@material-ui/core';
import React, { useEffect } from 'react'

const ChooseOneQuestion = function({ question, response, setResponse }) {
  useEffect(() => {
    if (response === undefined) {
      setResponse(question.choices[0].id)
    }
  })
  
  if (response === undefined) {
    return <CircularProgress />
  }

  return <Box>
    <Typography variant="body1">{question.text}</Typography>
    <Box marginX={5} marginTop={2} >
      <RadioGroup value={response} onChange={event => setResponse(parseInt(event.target.value))}>
        {question.choices.map((choice) => (
          <FormControlLabel
            key={choice.id} 
            control={<Radio />}
            value={choice.id}
            label={choice.text}
          />
        ))}
      </RadioGroup>
    </Box>
  </Box>
}

export default ChooseOneQuestion