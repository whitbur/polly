import React from 'react'
import { Box, Paper } from '@material-ui/core'

const CenterPaper = props => <Box position="fixed" display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
    <Paper style={{maxWidth: "600px", padding: "30px"}}>
        {props.children}
    </Paper>
</Box>

export default CenterPaper