import React, { useState } from 'react'
import { Box, FormControlLabel, Radio, RadioGroup, TextField, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { selectResponseById, upsertResponse } from '../../features/responsesSlice';

const ChooseOneQuestion = function({ question }) {
    const dispatch = useDispatch()
    const response = useSelector(selectResponseById(question.id)) || {id: question.id, choice: null}

    const [otherText, setOtherText] = useState((response.choice !== null && question.choices.indexOf(response.choice) === -1)? response.choice : "")
    
    const handleChangeOther = function(event) {
        setOtherText(event.target.value)
        dispatch(upsertResponse({id: question.id, choice: event.target.value}))
    }

    return <Box>
        <Typography variant="body1">{question.text}</Typography>
        <Box marginX={5} marginTop={2} >
            <RadioGroup value={response.choice} onChange={event => dispatch(upsertResponse({id: question.id, choice: event.target.value}))}>
                {question.choices.map((choice) => (
                    <FormControlLabel key={choice} control={<Radio />} value={choice} label={choice} />
                ))}
                {question.allowOther && <FormControlLabel key={'other'} control={<Radio />} value={otherText} label={
                    <TextField multiline style={{width: "300px"}} label={question.otherLabel} value={otherText} onChange={handleChangeOther} />} />}
            </RadioGroup>
        </Box>
    </Box>
}

export default ChooseOneQuestion