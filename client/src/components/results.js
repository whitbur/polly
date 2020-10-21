import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Backdrop, Box, CircularProgress, Container } from '@material-ui/core'
import { selectQuestionIds } from '../features/questionsSlice'
import { useSelector } from 'react-redux'
import yaml from 'js-yaml'

import CenterPaper from './center_paper'

// TODO: Actually write Result
const Result = () => <p>Coming soon...</p>

const Results = () => {
    const { pollId } = useParams()
    const [admin, setAdmin] = useState(null)

    const questionIds = useSelector(selectQuestionIds)

    useEffect(() => {
     fetch('/api/admin_auth')
        .then(r => r.json())
        .then(r => {
            setAdmin(r.admin)
            if (r.admin) {
                fetch(`/api/poll/${pollId}`)
                    .then(r => r.json())
                    .then(r => {
                        // TODO: Load poll into questionsSlice
                        console.log(yaml.safeDump(r))
                    })
                fetch(`/api/poll/${pollId}/results`)
                    .then(r => r.json())
                    .then(r => {
                        // TODO: Load results into responsesSlice
                        console.log(yaml.safeDump(r))
                    })
            }
        })
    }, [pollId])

    if (admin === null) {
        return <Backdrop open={true}><CircularProgress /></Backdrop>
    } else if (admin === false) {
        return <CenterPaper>Sorry, you can't do this.</CenterPaper>
    }

    return <Container>
        {questionIds.map(questionId => <Box key={questionId} mt="15px"><Result questionId={questionId} /></Box>)}
    </Container>
}

export default Results