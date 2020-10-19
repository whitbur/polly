import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { createMuiTheme } from '@material-ui/core/styles'
import { CssBaseline, ThemeProvider, Typography } from '@material-ui/core'
import { Provider } from 'react-redux'
import Poll from './poll'
import UpsertPoll from './upsert_poll'
import CenterPaper from './center_paper'
import store from '../store'

const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
    },
})

export default function() {
    return <ThemeProvider theme={darkTheme}>
        <Provider store={store}>
            <CssBaseline />
            <Router>
                <Switch>
                    <Route path="/vote/:voteId"> <Poll /> </Route>
                    <Route path="/edit/:pollId"> <UpsertPoll /> </Route>
                    <Route path="/thanks">
                        <CenterPaper>
                            <Typography variant="h4">Thanks!</Typography>
                            <Typography variant="body1" style={{marginTop:"20px"}}>
                                Your response has been recorded. Feel free to take a break <span role="img" aria-label="coffee">☕</span>
                            </Typography>
                        </CenterPaper>
                    </Route>
                    <Route path="/">
                        <CenterPaper>
                            <Typography variant="h4">Oh, uhhh... Hi.</Typography>
                            <Typography variant="body1" style={{marginTop:"20px"}}>
                                You were supposed to come here with a specific link. Otherwise I don't really know to which poll to send you. 
                                Try talking to whomever sent you this link, or starting over somehow.
                            </Typography>
                            <Typography variant="body1" style={{marginTop:"20px"}}>Good luck!</Typography>
                        </CenterPaper>
                    </Route>
                </Switch>
            </Router>
        </Provider>
    </ThemeProvider>
}