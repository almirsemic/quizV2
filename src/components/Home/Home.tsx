//import useFetchQuizzes from '../../CustomHook/useFetchQuizzes'
import { useNavigate } from 'react-router-dom'
import { Paper } from '@mui/material'
import { useCallback, useState } from 'react'
import Button from '@mui/material/Button'
import { Quiz } from '../../Types/types'
import axios from 'axios'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import { RootState } from '../../Redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { setQuiz } from '../../Redux/quizzesSlice'
import QuizForm from '../Quiz/QuizForm'
import Progress from '../NotFound/Progress'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  height: 200,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}))

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 280,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}
const Home = () => {

  /*

  customHook can't be used conditionally, that's why I commented.
  customHook is used directly in a component or in another customHook


  // process.env.REACT_APP_API_AVAILABLE !== 'false'
  // const quizzes: any = useFetchQuizzes(undefined, true)

  
  */

  const quizzes: Quiz[] = useSelector((state: RootState) => state.quizzes)
  const [confirmDelete, setConfirmDelete] = useState<[number | string | undefined, boolean]>([0,false])
  const [formModalIsOppen, setFormModalIsOppen] = useState<boolean>(false)
  const [typeForm, setTypeForm] = useState<string | undefined>('')
  const [quizId, setQuizId] = useState<number | string | undefined>(undefined)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleQuiz = useCallback(
    (typeModal?: string, id?: number | string) => {
      setQuizId(id)
      setTypeForm(typeModal)
      setFormModalIsOppen(!formModalIsOppen)
    },
    [setTypeForm, setFormModalIsOppen, formModalIsOppen],
  )

  async function deleteQuiz(id: number | string | undefined): Promise<void> {
    if (process.env.REACT_APP_API_AVAILABLE !== 'false') {
      try {
        const source = axios.CancelToken.source();
        await axios.delete(`/quizzes/${id}`, { cancelToken: source.token });
      } catch (error) {
        if (axios.isCancel(error)) console.log('Request canceled:', error.message);
        else console.warn(error);
      } finally {
        setConfirmDelete([0, false]);
      }
    } else {
      dispatch(setQuiz({ type: "DELETE", id }));
      setConfirmDelete([0, false]);
    }
  }
  return (
    <div>
      {quizzes ? (
        <Paper sx={{ margin: 5 }}>
          <Button variant="outlined" onClick={() => handleQuiz('Create')}>
            New Quiz
          </Button>
          <Box sx={{ width: '100%' }}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              {quizzes?.map((quiz: Quiz) => (
                <Grid item xs={12} key={quiz.id}>
                  <Item>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="contained"
                        color="success"
                        sx={{ mt: 2, mx: 2 }}
                        onClick={() => handleQuiz('Update', quiz.id)}
                      >
                        Update
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        sx={{ mt: 2, mx: 2 }}
                        onClick={() =>
                          setConfirmDelete([quiz.id ? quiz.id : 0, true])
                        }
                      >
                        Delete
                      </Button>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '50%',
                      }}
                    >
                      {quiz.name}
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Button
                        variant="contained"
                        onClick={() => navigate(`/quiz/${quiz.id}`)}
                      >
                        Start Quiz
                      </Button>
                    </Box>
                  </Item>
                </Grid>
              ))}
            </Grid>
          </Box>
          {formModalIsOppen && typeForm && (
            <QuizForm handleQuiz={handleQuiz} quizId={quizId} />
          )}
          <Modal
            open={confirmDelete[1]}
            sx={{ minWidth: 300 }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Are you sure you want to delete?
              </Typography>
              <Button
                sx={{ mx: 2 }}
                variant="outlined"
                color="error"
                onClick={() => deleteQuiz(confirmDelete[0])}
              >
                Yes
              </Button>
              <Button
                sx={{ mx: 2 }}
                variant="contained"
                color="success"
                onClick={() => setConfirmDelete([0, false])}
              >
                No
              </Button>
            </Box>
          </Modal>
        </Paper>
      ) : (
        <Progress />
      )}
    </div>
  )
}

export default Home
