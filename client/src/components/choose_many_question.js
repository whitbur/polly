import { Box, Checkbox, CircularProgress, FormControlLabel, FormGroup, Typography } from '@material-ui/core';
import React, { useEffect } from 'react'

const ChooseManyQuestion = function({ question, response, setResponse }) {
  const toggleChoice = choiceId => {
    setResponse({...response, [choiceId]: !response[choiceId]})
  }

  useEffect(() => {
    if (response === undefined) {
      setResponse({})
    }
  })
  
  if (response === undefined) {
    return <CircularProgress />
  }

  return <Box>
    <Typography variant="body1">{question.text}</Typography>
    <Box marginX={5} marginTop={2} >
      <FormGroup>
        {question.choices.map((choice) => (
        <FormControlLabel
          key={choice.id} 
          control={<Checkbox checked={response[choice.id] === true} onChange={() => toggleChoice(choice.id)} />}
          label={choice.text}
        />
        ))}
      </FormGroup>
    </Box>
  </Box>
}

export default ChooseManyQuestion