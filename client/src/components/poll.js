import React, { useEffect, useState } from 'react'
import { Backdrop, Box, Button, Card, CardContent, CircularProgress, Container } from '@material-ui/core'
import { Send as SendIcon } from '@material-ui/icons'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import SwipeableViews from 'react-swipeable-views'
import { selectPoll, selectQuestionIds } from '../features/questionsSlice'
import { fetchVote, submitResponses } from '../features/responsesSlice'

import Question from './questions/question'
import TextDisplayQuestion from './questions/text_display_question'

const Poll = () => {
    const { voteId } = useParams()
    const history = useHistory()
    const dispatch = useDispatch()

    const poll = useSelector(selectPoll)
    const questionIds = useSelector(selectQuestionIds)
    const [questionIndex, setQuestionIndex] = useState(0)

    const handleSave = () => {
        dispatch(submitResponses(voteId))
        .then(() => history.push('/thanks'))
        .catch(e => console.log(e)) //TODO: Bug, this doesn't catch a failed thunk.
    }

    useEffect(() => {
     dispatch(fetchVote(voteId))
    }, [dispatch, voteId])

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

        <SwipeableViews index={questionIndex} onChangeIndex={(event, value) => setQuestionIndex(value)} disabled={true}>
            {questionIds.map((questionId, index) => <Box key={questionId} mt="15px">
                <Question questionId={questionId} />
                <Box display="flex" mt="15px" mb="50px">
                    {index !== 0 && <Button variant="contained" color="primary" onClick={() => setQuestionIndex(index - 1)}>Prev</Button>}
                    {index !== questionIds.length-1
                        ? <Button variant="contained" color="primary" style={{marginLeft:"auto"}} onClick={() => setQuestionIndex(index + 1)}>Next</Button>
                        : <Button variant="contained" color="primary" style={{marginLeft:"auto"}} startIcon={<SendIcon />} onClick={handleSave}>Submit</Button>}
                </Box>
            </Box>)}
        </SwipeableViews>
    </Container>
}

export default Poll