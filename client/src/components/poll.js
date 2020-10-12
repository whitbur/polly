import React, { useEffect, useState } from 'react'
import { Backdrop, Box, Button, CircularProgress, Container } from '@material-ui/core'
import { Save as SaveIcon } from '@material-ui/icons'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDataForVote, selectPoll, selectQuestionIds } from '../features/questionsSlice'
import { submitResponses } from '../features/responsesSlice'

import Question from './question'

const Poll = () => {
  const { voteId } = useParams()
  const history = useHistory()
  const dispatch = useDispatch()

  const poll = useSelector(selectPoll)
  const questionIds = useSelector(selectQuestionIds)

  const [admin, setAdmin] = useState(false)

  const handleSave = () => {
    // fetch(`/api/vote/${voteId}`, {
    //   method: 'POST', 
    //   headers: {'Content-Type': 'application/json'},
    //   body: JSON.stringify({responses: responses})
    // })
    // .then(() => history.push('/thanks'))'
    dispatch(submitResponses(voteId)).then(() => history.push('/thanks'))
    
  }

  useEffect(() => {
    dispatch(fetchDataForVote(voteId))
    fetch('/api/admin_auth')
        .then(r => r.json())
        .then(r => { setAdmin(r.admin) })
  }, [dispatch, voteId])

  if (poll === null) {
    return <Backdrop open={true}><CircularProgress /></Backdrop>
  }

  return <Container maxWidth="sm">
    {questionIds.map(questionId => <Box key={questionId} mt="15px"><Question questionId={questionId} admin={admin} /></Box>)}

    <Box textAlign="right" mt="15px" mb="50px">
      {admin && <Button variant="contained" color="primary">Add Question</Button>}
      <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleSave}>Save</Button>
    </Box>

  </Container>
}

export default Poll