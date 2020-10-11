import { Box, FormControlLabel, Radio, RadioGroup, TextField, Typography } from '@material-ui/core';
import React, { useState } from 'react'

// TODO - Bug: When you type into the "other" box, it deselects the radio button.

const ChooseOneQuestion = function({ question, response, setResponse }) {
  const [otherText, setOtherText] = useState("")
  
  const handleChangeOther = function(event) {
    setOtherText(event.target.value)
    setResponse({choice: event.target.value})
  }

  return <Box>
    <Typography variant="body1">{question.text}</Typography>
    <Box marginX={5} marginTop={2} >
      <RadioGroup value={response.choice} onChange={event => setResponse({choice: event.target.value})}>
        {question.choices.map((choice) => (
          <FormControlLabel key={choice} control={<Radio />} value={choice} label={choice} />
        ))}
        {question.allowOther && <FormControlLabel key={'other'} control={<Radio />} value={otherText} label={
          <TextField multiline style={{width: "300px"}} label={question.otherLabel} value={otherText} onChange={handleChangeOther} />} />}
      </RadioGroup>
    </Box>
    <pre>Response: {JSON.stringify(response)}, OtherText: {otherText}</pre>
  </Box>
}

export default ChooseOneQuestion