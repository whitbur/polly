import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Save as SaveIcon } from '@material-ui/icons'
import { Backdrop, Box, Button, CircularProgress, Container, Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab';
import AceEditor from 'react-ace'
import yaml from 'js-yaml'

import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/theme-twilight";
import CenterPaper from './center_paper'

const UpsertPoll = () => {
    const { pollId } = useParams()
    const [admin, setAdmin] = useState(null)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [pollYaml, setPollYaml] = useState("")

    const handleSave = () => {
        const poll = yaml.safeLoad(pollYaml)
        fetch(`/api/poll/${pollId}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(poll)
        })
        .then(r => setSnackbarOpen(true))
    }

    useEffect(() => {
     fetch('/api/admin_auth')
        .then(r => r.json())
        .then(r => {
            setAdmin(r.admin)
            if (r.admin) {
                fetch(`/api/poll/${pollId}`)
                    .then(r => r.json())
                    .then(r => {
                        setPollYaml(yaml.safeDump(r))
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
        <Box display="flex" flexDirection="column" height="100vh">
            <AceEditor 
                name="poll-json"
                mode="yaml"
                theme="twilight"
                width="100%"
                showPrintMargin={false}
                value={pollYaml}
                onChange={newValue => setPollYaml(newValue)}
                enableBasicAutocompletion={true}
                enableLiveAutocompletion={true} 
                style={{marginTop: "15px", flex: "1 0"}} />
            <Box display="flex" justifyContent="flex-end" my="15px" flex="0 1">
                <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleSave}>Submit</Button>
            </Box>
        </Box>
        <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={() => setSnackbarOpen(false)}>
            <Alert severity="success">Successfully saved poll.</Alert>
        </Snackbar>
    </Container>
}

export default UpsertPoll