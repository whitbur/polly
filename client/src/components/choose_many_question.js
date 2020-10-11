import { Box, Checkbox, FormControlLabel, FormGroup, Typography } from '@material-ui/core';
import React from 'react'

const ChooseManyQuestion = function({ question, response, setResponse }) {
  const toggleChoice = choice => {
    const oldChoices = response.choices || []
    const idx = oldChoices.indexOf(choice) === -1
    if (idx === -1) {
      setResponse({choices: [...oldChoices, choice]})
    } else {
      setResponse({choices: oldChoices.slice().splice(idx, 1)})
    }
  }

  return <Box>
    <Typography variant="body1">{question.text}</Typography>
    <Box marginX={5} marginTop={2} >
      <FormGroup>
        {question.choices.map((choice) => (
        <FormControlLabel
          key={choice} 
          control={<Checkbox checked={(response.choices || []).find(c => c === choice)} onChange={() => toggleChoice(choice)} />}
          label={choice}
        />
        ))}
      </FormGroup>
    </Box>
  </Box>
}

export default ChooseManyQuestion