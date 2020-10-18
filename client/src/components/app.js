import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { createMuiTheme } from '@material-ui/core/styles'
import { Box, CssBaseline, Paper, ThemeProvider, Typography } from '@material-ui/core';
import Poll from './poll';
import { Provider } from 'react-redux';
import store from '../store';

const darkTheme = createMuiTheme({
    palette: {
        type: 'dark',
    },
})

const CenterPaper = props => <Box position="fixed" display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
    <Paper style={{maxWidth: "600px", padding: "30px"}}>
        {props.children}
    </Paper>
</Box>

export default function() {
    return <ThemeProvider theme={darkTheme}>
        <Provider store={store}>
            <CssBaseline />
            <Router>
                <Switch>
                    <Route path="/vote/:voteId"> <Poll /> </Route>
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