import React, { useEffect, useState } from 'react'
import { Backdrop, Box, Button, Card, CardContent, CircularProgress, Container, Snackbar } from '@material-ui/core'
import { Send as SendIcon } from '@material-ui/icons'
import { Alert } from '@material-ui/lab'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectPoll, selectQuestionById, selectQuestionIds } from '../features/questionsSlice'
import { fetchVote, selectResponseById, submitResponses } from '../features/responsesSlice'

import Question from './questions/question'
import TextDisplayQuestion from './questions/text_display_question'

const Poll = ({ setPalette }) => {
    const { voteId } = useParams()
    const history = useHistory()
    const dispatch = useDispatch()
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [submitAttempted, setSubmitAttempted] = useState(false)

    const poll = useSelector(selectPoll)
    const questionIds = useSelector(selectQuestionIds)
    const allQuestionsSatisfied = useSelector(state => {
        return questionIds.every(qId => {
            const required = selectQuestionById(qId)(state).required
            const response = selectResponseById(qId)(state)
            return (!required || response) && (!response || !response.invalid)
        })
    })

    const handleSave = () => {
        setSubmitAttempted(true)
        if (allQuestionsSatisfied) {
            dispatch(submitResponses(voteId))
            .then(() => history.push('/thanks'))
            .catch(e => console.log(e)) //TODO: Bug, this doesn't catch a failed thunk.
        } else {
            setSnackbarOpen(true)
        }
    }

    useEffect(() => {
     dispatch(fetchVote(voteId))
    }, [dispatch, voteId])

    useEffect(() => {
        if (poll) {
            setPalette(poll.palette)
        }
    }, [poll, setPalette])

    if (poll === null) {
        return <Backdrop open={true}><CircularProgress /></Backdrop>
    }

    return <Container maxWidth="sm">
        {(poll.title || poll.text) && (
        <Card style={{marginTop: "15px"}}>
            <CardContent>
                <TextDisplayQuestion question={poll}/>
            </CardContent>
        </Card>)}

        {questionIds.map(questionId => <Box key={questionId} mt="15px"><Question questionId={questionId} submitAttempted={submitAttempted}/></Box>)}

        <Box display="flex" justifyContent="flex-end" mt="15px" mb="50px">
            <Button variant="contained" color={allQuestionsSatisfied ? "secondary" : "default"} startIcon={<SendIcon />} onClick={handleSave}>Submit</Button>
        </Box>
        <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={() => setSnackbarOpen(false)}>
            <Alert severity="error" onClose={() => setSnackbarOpen(false)}>
                Double check your responses, looks like something's wrong.
            </Alert>
        </Snackbar>
    </Container>
}

export default Poll