import React from 'react'
import { useSelector } from 'react-redux'
import { Card, CardContent } from '@material-ui/core'

import { selectQuestionById } from '../../features/questionsSlice'
import TextDisplayQuestion from '../questions/text_display_question'
import ChoicesResult from './choices_result'
import TextResult from './text_result'
import RankedChoicesResult from './ranked_choices_result'

// TODO: Actually write Result
const Result = ({ questionId, responses }) => {
    const question = useSelector(selectQuestionById(questionId))

    const ResultComponent = {
        text_display: TextDisplayQuestion,
        ranked_choice: RankedChoicesResult,
        choose_many: ChoicesResult,
        choose_one: ChoicesResult,
        large_text: TextResult
    }[question.type]
    
    return (
        <Card>
            <CardContent>
                <ResultComponent question={question} responses={responses} />
            </CardContent>
        </Card>
    )
}

export default Result