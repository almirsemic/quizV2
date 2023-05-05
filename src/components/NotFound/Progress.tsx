import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

const Progress = () => {
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
      <Box sx={{ mx: 4 }}>
        <CircularProgress />
      </Box>
    </Box>
  )
}

export default Progress