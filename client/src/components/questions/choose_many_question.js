import { Box, Checkbox, FormControlLabel, FormGroup, TextField, Typography } from '@material-ui/core';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectResponseById, upsertResponse } from '../../features/responsesSlice';

const ChooseManyQuestion = function({ question }) {
    const dispatch = useDispatch()
    const response = useSelector(selectResponseById(question.id)) || {id: question.id, choices: []}

    const [otherText, setOtherText] = useState(response.choices.find(c => question.choices.indexOf(c) === -1) || "")
    const [choiceStatus, setChoiceStatus] = useState(() => {
        const state = {}
        question.choices.forEach(choice => state[choice] = response.choices.indexOf(choice) !== -1)
        state['$other'] = response.choices.indexOf(otherText) !== -1
        return state
    })

    const updateResponse = (status, text) => {
        const newChoiceStatus = status || choiceStatus
        const newOtherText = text || otherText
        const newChoices = Object.keys(newChoiceStatus).reduce((r, k) => {
            if (newChoiceStatus[k]) {
                if (k === '$other') {
                    return [...r, newOtherText]
                } else {
                    return [...r, k]
                }
            } else return r
        }, [])

        const responseInvalid = question.numRequired && newChoices.length < question.numRequired
        dispatch(upsertResponse({id: question.id, choices: newChoices, invalid: responseInvalid}))
    }

    const toggleChoice = choice => {
        const oldChoice = choiceStatus[choice] === true
        const newChoiceStatus = {...choiceStatus, [choice]: !oldChoice}
        setChoiceStatus(newChoiceStatus)
        updateResponse(newChoiceStatus)
    }

    const handleChangeOtherText = event => {
        setOtherText(event.target.value)
        updateResponse(null, event.target.value)
    }

    return <Box>
        <Typography variant="body1">{question.text}</Typography>
        <Box marginX={5} marginTop={2} >
            <FormGroup>
                {question.choices.map((choice) => (
                    <FormControlLabel
                        key={choice} 
                        control={<Checkbox checked={choiceStatus[choice]} onChange={() => toggleChoice(choice)} />}
                        label={choice}
                    />
                ))}
                {question.allowOther && <FormControlLabel 
                    key={'$other'} 
                    control={<Checkbox checked={choiceStatus['$other']} onChange={() => toggleChoice('$other')} />} 
                    label={<TextField multiline style={{width: "300px"}} label={question.otherLabel} value={otherText} onChange={handleChangeOtherText} />}
                />}
            </FormGroup>
        </Box>
    </Box>
}

export default ChooseManyQuestion