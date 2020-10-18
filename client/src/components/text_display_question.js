import React from 'react'
import { Box, Typography } from '@material-ui/core'

const TextDisplayQuestion = ({question, admin}) => <Box>
    {question.title && <Typography style={{textAlign:"center"}} variant="h4">{question.title}</Typography>}
    {question.text && <p>{question.text}</p>}
</Box>

export default TextDisplayQuestion