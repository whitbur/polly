import React, { useEffect } from 'react'
import { Backdrop, Box, Button, CircularProgress, Container } from '@material-ui/core'
import { Send as SendIcon } from '@material-ui/icons'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectPoll, selectQuestionIds } from '../features/questionsSlice'
import { fetchVote, submitResponses } from '../features/responsesSlice'

import Question from './question'

const Poll = () => {
    const { voteId } = useParams()
    const history = useHistory()
    const dispatch = useDispatch()

    const poll = useSelector(selectPoll)
    const questionIds = useSelector(selectQuestionIds)

    const handleSave = () => {
        dispatch(submitResponses(voteId)).then(() => history.push('/thanks'))
    }

    useEffect(() => {
     dispatch(fetchVote(voteId))
    //  fetch('/api/admin_auth')
    //     .then(r => r.json())
    //     .then(r => { setAdmin(r.admin) })
    }, [dispatch, voteId])

    if (poll === null) {
        return <Backdrop open={true}><CircularProgress /></Backdrop>
    }

    const editing = false // TODO: Inline editing

    return <Container maxWidth="sm">
        {questionIds.map(questionId => <Box key={questionId} mt="15px"><Question questionId={questionId} editing={editing} /></Box>)}

        <Box display="flex" justifyContent="flex-end" mt="15px" mb="50px">
            {editing && <Button variant="contained" color="primary" style={{marginRight:"15px"}}>Add Question</Button>}
            {editing && <Button variant="contained" color="primary" style={{marginRight:"15px"}}>Save Changes</Button>}
            <Button variant="contained" color="primary" startIcon={<SendIcon />} onClick={handleSave}>Submit</Button>
        </Box>
    </Container>
}

export default Poll