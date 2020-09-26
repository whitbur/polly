import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { createMuiTheme } from '@material-ui/core/styles'
import { Box, CssBaseline, Paper, ThemeProvider } from '@material-ui/core';
import Poll from './poll';

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
})

export default function() {
  return <Router>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Switch>
        <Route path="/vote/:voteId">
          <Poll />
        </Route>
        <Route path="/">
          <Box position="fixed" display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
            <Paper style={{maxWidth: "500px", padding: "30px"}}>
              <h1>Oh, uhhh... Hi.</h1>
              <p>You were supposed to come here with a specific link. Otherwise I don't really know to which poll to send you. Try talking to whomever sent you this link, or starting over somehow.</p>
              <p>Good luck!</p>
            </Paper>
          </Box>
        </Route>
      </Switch>
    </ThemeProvider>
  </Router>
}