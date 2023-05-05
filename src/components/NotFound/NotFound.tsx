import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'

const NotFound = () => {
  const navigate = useNavigate()
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '90vh',
      }}
    >
      <Box>
        <Typography sx={{ color: 'red' }}>Wrong URL !</Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          Home
        </Button>
      </Box>
    </Box>
  )
}

export default NotFound