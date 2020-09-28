import React, { useEffect, useState } from 'react'
import { Backdrop, Box, Button, Card, CardContent, CircularProgress, Container, Typography, withStyles } from '@material-ui/core'
import { Save as SaveIcon } from '@material-ui/icons';
import { useHistory, useParams } from 'react-router-dom'
import RankedChoiceQuestion from './ranked_choice_question';
import ChooseManyQuestion from './choose_many_question';
import ChooseOneQuestion from './choose_one_question';

const QuestionCard = withStyles({
  root: {
    marginTop: "15px"
  }
})(Card);

const Poll = props => {
  const { voteId } = useParams()
  const history = useHistory()
  const [poll, setPoll] = useState()
  const [responses, setResponses] = useState({})

  const setResponse = questionId => {
    return response => {
      setResponses({...responses, [questionId]: response})
    }
  }

  const saveResponses = () => {
    fetch(`/api/vote/${voteId}`, {
      method: 'POST', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({responses: responses})
    })
    .then(() => history.push('/thanks'))
  }

  useEffect(() => {
    fetch(`/api/vote/${voteId}`)
        .then(r => r.json())
        .then(r => { setPoll(r.poll) })
  }, [voteId])

  if (poll === undefined) {
    return <Backdrop open={true}><CircularProgress /></Backdrop>
  }

  return <Container maxWidth="sm">
    <QuestionCard>
      <CardContent>
        <Typography style={{textAlign:"center"}} variant="h4">{poll.title}</Typography>
        {poll.subtitle && <p>{poll.subtitle}</p>}
      </CardContent>
    </QuestionCard>

    {poll.questions.map(question => (
      <QuestionCard key={question.id}>
        <CardContent>
          {question.type === "ranked_choice" && <RankedChoiceQuestion question={question} response={responses[question.id]} setResponse={setResponse(question.id)}/>}
          {question.type === "choose_many" && <ChooseManyQuestion question={question} response={responses[question.id]} setResponse={setResponse(question.id)}/>}
          {question.type === "choose_one" && <ChooseOneQuestion question={question} response={responses[question.id]} setResponse={setResponse(question.id)}/>}
        </CardContent>
      </QuestionCard>
    ))}

    <Box textAlign="right" mt="15px">
      <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={saveResponses}>Save</Button>
    </Box>

  </Container>
}

export default Poll