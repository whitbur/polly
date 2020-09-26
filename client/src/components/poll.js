import React, { useEffect, useState } from 'react'
import { Backdrop, Card, CardContent, CircularProgress, Container, withStyles } from '@material-ui/core'
import { useParams } from 'react-router-dom'
import Question from './question'

const QuestionCard = withStyles({
  root: {
    marginTop: "15px"
  }
})(Card);

const Poll = () => {
  const { voteId } = useParams()
  const [poll, setPoll] = useState()
  const [responses, setResponses] = useState({})

  const setResponse = questionId => {
    return response => {
      setResponses({...responses, [questionId]: response})
    }
  }

  useEffect(() => {
    // TODO: Fetch here
    setPoll({
      id: 1,
      title: "Book Club Next Subject",
      questions: [
        {
          id: 1,
          type: "ranked_choice",
          text: "Please rank your choices from most desired to least. Only the top four matter.",
          choices: [
            {id: 1, text: "Book one"},
            {id: 2, text: "Book Two or something"},
            {id: 3, text: "Title three - Oh right, authors"},
            {id: 4, text: "Eh, whatever"},
            {id: 5, text: "Actually we need more"},
            {id: 6, text: "... than four choices"},
            {id: 7, text: "Like, six or seven would be fantastic"}
          ]
        }
      ]
    })
  }, [voteId])

  if (poll === undefined) {
    return <Backdrop open={true}><CircularProgress /></Backdrop>
  }

  return <Container maxWidth="sm">
    <QuestionCard>
      <CardContent>
        <h2 style={{textAlign:"center"}}>{poll.title}</h2>
        {poll.subtitle && <p>{poll.subtitle}</p>}
      </CardContent>
    </QuestionCard>

    {poll.questions.map(question => (
      <QuestionCard key={question.id}>
        <CardContent>
          <Question question={question} response={responses[question.id]} setResponse={setResponse(question.id)}/>
        </CardContent>  
      </QuestionCard>
    ))}

  </Container>
}

export default Poll