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

const renderQuestion = (question, responses, setResponse, admin) => {
  const QuestionComponent = {
    ranked_choice: RankedChoiceQuestion,
    choose_many: ChooseManyQuestion,
    choose_one: ChooseOneQuestion
  }[question.type]

  return (
    <QuestionCard key={question.id}>
      <CardContent>
        <QuestionComponent 
            question={question} 
            response={responses[question.id]} 
            setResponse={setResponse(question.id)}
            admin={admin}/>
      </CardContent>
    </QuestionCard>
  )
}

const Poll = ({ create }) => {
  const { voteId } = useParams()
  const history = useHistory()
  const [poll, setPoll] = useState()
  const [responses, setResponses] = useState({})
  const [admin, setAdmin] = useState(false)

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
        .then(r => {
          const newResponses = {}
          r.poll.questions.forEach(q => newResponses[q.id] = {})
          setResponses(newResponses)
          setPoll(r.poll)
        })
  }, [voteId])

  useEffect(() => {
    fetch('/api/admin_auth')
        .then(r => r.json())
        .then(r => { setAdmin(r.admin) })
  }, [])

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

    {poll.questions.map(question => renderQuestion(question, responses, setResponse, admin))}

    {admin && <QuestionCard>
      <CardContent>
        <Button variant="contained" color="primary">Add Question</Button>
      </CardContent>
    </QuestionCard>}

    <Box textAlign="right" mt="15px" mb="50px">
      <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={saveResponses}>Save</Button>
    </Box>

  </Container>
}

export default Poll