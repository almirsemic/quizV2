import { useTheme } from '@mui/material/styles'
import MobileStepper from '@mui/material/MobileStepper'
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import { useNavigate, useParams } from 'react-router-dom'
import Button from '@mui/material/Button'
import { useState } from 'react'
import { Paper } from '@mui/material'
import Progress from '../NotFound/Progress'
import { Typography } from '@mui/material'
import { Box } from '@mui/material'
import { Quiz } from '../../Types/types'
import { useSelector } from 'react-redux'
import { RootState } from '../../Redux/store'
//import useFetchQuizzes from '../../CustomHook/useFetchQuizzes'

const QuizSolver = () => {

  
   /*

  customHook can't be used conditionally, that's why I commented.
  customHook is used directly in a component or in another customHook


  // process.env.REACT_APP_API_AVAILABLE !== 'false'
  // const quiz: any = useFetchQuizzes(id, true)

  
  */
 
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [showAnswer, setShowAnswer] = useState<boolean>(false)
  const navigate = useNavigate()
  const theme = useTheme()
  const { id } = useParams()
  const quiz: Quiz | undefined = useSelector((state: RootState) => {
    return state.quizzes.find((quiz: Quiz) => quiz.id === id)
  })
  function handlePrevClick() {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1)
      setShowAnswer(false)
    }
  }
  function handleNextClick() {
    if (quiz) {
      if (currentIndex < quiz.questions.length - 1) {
        setCurrentIndex((prevIndex) => prevIndex + 1)
        setShowAnswer(false)
      }
    }
  }
  function handleAnswerClick() {
    setShowAnswer(!showAnswer)
  }
  return (
    <div>
      {quiz ? (
        <Paper
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            maxWidth: 800,
            width: '90%',
            height: '70%',
            bgcolor: '#86a3d2',
            borderRadius: 5,
            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
            padding: 3,
            margin: '50px auto 0',
            textAlign: 'center',
          }}
        >
          <Button variant="contained" onClick={() => navigate('/')}>
            Home
          </Button>
          <Typography
            variant="h2"
            fontWeight="bold"
            sx={{
              lineHeight: 1.2,
              margin: '20px 0',
              color: '#ccc',
            }}
          >
            {quiz.name}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 2,
              padding: 3,
              width: '75%',
              height: '75%',
              borderRadius: 5,
              bgcolor: '#f8f8f8',
              boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Box
              sx={{
                lineHeight: 1.2,
                color: '#000',
              }}
            >
              <Typography sx={{ color: 'red' }}>
                Question {currentIndex + 1}:
              </Typography>{' '}
              {quiz.questions[currentIndex].question}
            </Box>
            <Box
              sx={{
                lineHeight: 1.2,
                color: '#000',
                display: showAnswer ? 'block' : 'none',
              }}
            >
              <Typography sx={{ color: 'red' }}>
                Answer {currentIndex + 1}:
              </Typography>{' '}
              {quiz.questions[currentIndex].answer}
            </Box>
            <Button
              variant="outlined"
              onClick={() => handleAnswerClick()}
              sx={{
                mt: 2,
              }}
            >
              {showAnswer ? 'Hide Answer' : 'Show Answer'}
            </Button>
          </Box>
          <MobileStepper
            variant="progress"
            steps={quiz.questions.length}
            position="static"
            activeStep={currentIndex}
            sx={{ width: 360, flexGrow: 1, my: 2 }}
            nextButton={
              <Button
                size="small"
                onClick={() => handleNextClick()}
                disabled={currentIndex === quiz.questions.length - 1}
              >
                Next
                {theme.direction === 'rtl' ? (
                  <KeyboardArrowLeft />
                ) : (
                  <KeyboardArrowRight />
                )}
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={() => handlePrevClick()}
                disabled={currentIndex === 0}
              >
                {theme.direction === 'rtl' ? (
                  <KeyboardArrowRight />
                ) : (
                  <KeyboardArrowLeft />
                )}
                Back
              </Button>
            }
          />
        </Paper>
      ) : (
        <Progress />
      )}
    </div>
  )
}

export default QuizSolver