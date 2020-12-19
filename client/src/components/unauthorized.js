import React from 'react'
import { TextField, Typography } from '@material-ui/core'
import { useState } from 'react'
import CenterPaper from './center_paper'

const Unauthorized = () => {
    const [showPasswordBox, setShowPasswordBox] = useState(false)
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState("")

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            setLoading(true)
            fetch('/api/set_pass', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({password: password})
            })
            .then(res => window.location.reload())
        }
    }

    return <CenterPaper>
        <Typography onClick={() => setShowPasswordBox(true)}>Sorry, you can't do this.</Typography>
        {showPasswordBox && !loading && <TextField value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown} type="password" autoFocus/>}
    </CenterPaper>
}

export default Unauthorized