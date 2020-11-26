import { Box, Card, CardContent } from '@material-ui/core'
import React from 'react'
import { useSelector } from 'react-redux'
import { selectQuestionById } from '../../features/questionsSlice'
import { selectResponseById } from '../../features/responsesSlice'
import ChooseManyQuestion from './choose_many_question'
import ChooseOneQuestion from './choose_one_question'
import LargeTextQuestion from './large_text_question'
import RankedChoiceQuestion from './ranked_choice_question'
import TextDisplayQuestion from './text_display_question'

const Question = ({questionId, submitAttempted}) => {
    const question = useSelector(selectQuestionById(questionId))
    const response = useSelector(selectResponseById(question.id))
    const valid = (response || !question.required || !submitAttempted) && (!response || !response.invalid)

    const QuestionComponent = {
        text_display: TextDisplayQuestion,
        ranked_choice: RankedChoiceQuestion,
        choose_many: ChooseManyQuestion,
        choose_one: ChooseOneQuestion,
        large_text: LargeTextQuestion
    }[question.type]
    
    return (
        <Card>
            <Box boxShadow={valid ? "" : "inset 0px 0px 10px 5px red"} position="relative">
                {question.required && <Box position="absolute" right="10px" top="5px" color="red" fontSize="2em">*</Box>}
                <CardContent>
                    <QuestionComponent question={question}/>
                </CardContent>
            </Box>
        </Card>
    )
}

export default Question