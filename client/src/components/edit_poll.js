import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Save as SaveIcon, CheckBox as CheckBoxIcon } from '@material-ui/icons'
import { Backdrop, Box, Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab';
import AceEditor from 'react-ace'
import yaml from 'js-yaml'

import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/theme-twilight";
import CenterPaper from './center_paper'

const EditPoll = () => {
    const { pollId } = useParams()
    const [admin, setAdmin] = useState(null)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [voteIds, setVoteIds] = useState([])
    const [showVoteIds, setShowVoteIds] = useState(false)
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
                fetch(`/api/poll/${pollId}/voteIds`)
                    .then(r => r.json())
                    .then(r => setVoteIds(r))
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
            <Box display="flex" justifyContent="space-between" my="15px" flex="0 1">
                <Box><Button variant="contained" color="primary" startIcon={<CheckBoxIcon />} onClick={() => setShowVoteIds(true)}>Vote Ids</Button></Box>
                <Box><Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleSave}>Save Changes</Button></Box>
            </Box>
        </Box>
        <Dialog open={showVoteIds} scroll="paper" onClose={() => setShowVoteIds(false)}>
            <DialogContent>
                <Box minWidth="200px">{voteIds.map(voteId => <div>{voteId}</div>)}</Box>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary">Copy</Button>
            </DialogActions>
        </Dialog>
        <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={() => setSnackbarOpen(false)}>
            <Alert severity="success">Successfully saved poll.</Alert>
        </Snackbar>
    </Container>
}

export default EditPoll