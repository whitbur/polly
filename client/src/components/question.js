import { Card, CardContent } from '@material-ui/core'
import React from 'react'
import { useSelector } from 'react-redux'
import { selectQuestionById } from '../features/questionsSlice'
import ChooseManyQuestion from './choose_many_question'
import ChooseOneQuestion from './choose_one_question'
import RankedChoiceQuestion from './ranked_choice_question'
import TextDisplayQuestion from './text_display_question'

const Question = ({questionId, editing}) => {
    const question = useSelector(selectQuestionById(questionId))

    const QuestionComponent = {
        text_display: TextDisplayQuestion,
        ranked_choice: RankedChoiceQuestion,
        choose_many: ChooseManyQuestion,
        choose_one: ChooseOneQuestion
    }[question.type] // TODO: Bug. question is just an ID here, need to refactor.
    
    return (
        <Card>
            <CardContent>
                <QuestionComponent 
                    question={question}
                    editing={editing}/>
            </CardContent>
        </Card>
    )
}

export default Question