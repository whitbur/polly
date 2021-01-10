import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Backdrop, Box, CircularProgress, Container } from '@material-ui/core'
import { fetchPoll, selectPoll, selectQuestionIds } from '../features/questionsSlice'
import { useDispatch, useSelector } from 'react-redux'

import Result from './results/result'
import Unauthorized from './unauthorized'

const Results = ({ setPalette }) => {
    const { pollId } = useParams()
    const dispatch = useDispatch()

    const [admin, setAdmin] = useState(null)
    const [responsesByQuestionId, setResponsesByQuestionId] = useState({})
    const poll = useSelector(selectPoll)
    const questionIds = useSelector(selectQuestionIds)

    useEffect(() => {
     fetch('/api/admin_auth')
        .then(r => r.json())
        .then(r => {
            setAdmin(r.admin)
            if (r.admin) {
                dispatch(fetchPoll(pollId))
                fetch(`/api/poll/${pollId}/votes`)
                    .then(r => r.json())
                    .then(r => {
                        const newResponsesByQuestionId = {}
                        Object.keys(r).forEach(voteId => {
                            r[voteId].responses.forEach(response => {
                                newResponsesByQuestionId[response.id] = (newResponsesByQuestionId[response.id] || []).concat(response)
                            })
                        })
                        setResponsesByQuestionId(newResponsesByQuestionId)
                    })
            }
        })
    }, [pollId, dispatch])

    useEffect(() => {
        if (poll) {
            setPalette(poll.palette)
        }
    }, [poll, setPalette])

    if (admin === null) {
        return <Backdrop open={true}><CircularProgress /></Backdrop>
    } else if (admin === false) {
        return <Unauthorized/>
    }

    return <Container maxWidth="sm">
        {questionIds.map(questionId => <Box key={questionId} mt="15px"><Result questionId={questionId} responses={responsesByQuestionId[questionId]} /></Box>)}
        <Box mb="50px"></Box>
    </Container>
}

export default Results