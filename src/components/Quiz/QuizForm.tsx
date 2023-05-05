//import useFetchQuizzes from '../CustomHook/useFetchQuizzes'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import DeleteIcon from '@mui/icons-material/Delete'
import { useState } from 'react'
import axios from 'axios'
import { Question, Quiz } from '../../Types/types'
import { useDispatch, useSelector } from 'react-redux'
import { setQuiz } from '../../Redux/quizzesSlice'
import { RootState } from '../../Redux/store'
import { setQuestion } from '../../Redux/questionsSlice'

interface Props {
  handleQuiz: () => void
  quizId: number | string | undefined
}
  const QuizForm: React.FC<Props> = (props: Props) => {

   /*

  customHook can't be used conditionally, that's why I commented.
  customHook is used directly in a component or in another customHook


  // process.env.REACT_APP_API_AVAILABLE !== 'false'
  // const fetchQuiz: any = useFetchQuizzes(props.quizId, props.quizId)

  
  */
  const randomQuestionsFromState: Question[] = useSelector((state: RootState) => state.questions)
  const fetchQuiz: Quiz | undefined = useSelector((state: RootState) => {
    return state.quizzes.find((quiz) => quiz.id === props.quizId)
  })
  const dispatch = useDispatch()
  const [quiz, setQuizz] = useState<any>(
    fetchQuiz
      ? fetchQuiz
      : {
          name: '',
          questions: [{ id: 1, question: '', answer: '' }],
        },
  )
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
  function addQuestion() {
    const newQuestion: Question = {
      id: new Date().getTime().toString(36),
      question: '',
      answer: '',
    }
    setQuizz({ ...quiz, questions: [...quiz.questions, newQuestion] })
  }

  function removeQuestion(index: number) {
    const newQuestions = [...quiz.questions]
    newQuestions.splice(index, 1)
    setQuizz({ ...quiz, questions: newQuestions })
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuizz({ ...quiz, name: e.target.value })
  }

  function handleQuestionChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
  ) {
    const newQuestions = quiz.questions.map((question: Question, i: number) => {
      if (i === index) {
        return { ...question, question: e.target.value };
      }
      return question;
    });
    setQuizz({ ...quiz, questions: newQuestions });
  }
  
  function handleAnswerChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
  ) {
    const newQuestions = quiz.questions.map((question: Question, i: number) => {
      if (i === index) {
        return { ...question, answer: e.target.value };
      }
      return question;
    });
    setQuizz({ ...quiz, questions: newQuestions });
  }
  
  

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
  
    if (process.env.REACT_APP_API_AVAILABLE !== 'false') {
      try {
        const source = axios.CancelToken.source();
        const response = !quiz.id
          ? await axios.post<Quiz>('/quizzes', quiz, { cancelToken: source.token })
          : await axios.put<Quiz>(`/quizzes/${quiz.id}`, { cancelToken: source.token });
  
        if (response?.status === 200) props.handleQuiz();
      } catch (error: any) {
        if (axios.isCancel(error)) console.warn('Request canceled:', error.message);
        else {
          setErrorMessage(error.response.data.error);
          console.warn(error);
        }
      }
    } else {
      dispatch(setQuiz({ type: !quiz.id ? 'CREATE' : 'UPDATE', quiz }));
      if (!quiz.id) dispatch(setQuestion(quiz.questions));
      props.handleQuiz();
    }
  }
  

  async function randomQuestions(): Promise<void> {
    let allQuestions: Question[] = [];
  
    if (process.env.REACT_APP_API_AVAILABLE !== 'false') {
      try {
        const response = await axios.get<Question[]>('/questions');
        allQuestions = response.data;
      } catch (error) {
        console.error(error);
      }
    }
  
    const randomQuestion = allQuestions.length > 0
      ? allQuestions[Math.floor(Math.random() * allQuestions.length)]
      : randomQuestionsFromState[Math.floor(Math.random() * randomQuestionsFromState.length)];
  
    setQuizz({
      ...quiz,
      questions: [
        ...quiz.questions,
        {
          id: new Date().getTime().toString(36),
          question: randomQuestion.question,
          answer: randomQuestion.answer,
        },
      ],
    });
  }
  
  return (
    <div>
      <Modal
        open={true}
        sx={{ minWidth: 300 }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            minWidth: 280,
            height: '65%',
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {quiz.id ? 'Update quiz' : 'Create a new quiz'}{' '}
            <Button variant="outlined" onClick={() => props.handleQuiz()}>
              x
            </Button>
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box sx={{ height: '200px', overflowY: 'auto' }}>
              <TextField
                id="outlined-basic"
                label="Quiz Name"
                variant="outlined"
                sx={{ my: 1 }}
                value={quiz.name}
                required
                onChange={handleNameChange}
              />
              {quiz.questions.map((question: Question, index: number) => (
                <Box key={question.id}>
                  <Box sx={{ my: 2 }}>
                    <TextField
                      id="outlined-basic"
                      label={`Question ${index + 1}`}
                      variant="outlined"
                      required
                      value={question.question}
                      onChange={(e) => handleQuestionChange(e, index)}
                    />
                    <TextField
                      id="filled-basic"
                      label={`Answer ${index + 1}`}
                      variant="filled"
                      required
                      value={question.answer}
                      onChange={(e) => handleAnswerChange(e, index)}
                    />
                    {quiz.questions.length > 1 ? (
                      <Button
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                        onClick={() => removeQuestion(index)}
                      >
                        Delete
                      </Button>
                    ) : null}
                  </Box>
                </Box>
              ))}
            </Box>
            {errorMessage ? (
              <Typography variant="body1" sx={{ color: 'red' }}>
                {errorMessage}!
              </Typography>
            ) : null}
            <Button
              sx={{ width: '100%', my: 1 }}
              variant="outlined"
              onClick={() => addQuestion()}
            >
              Add question
            </Button>
            <br />
            <Button
              sx={{ width: '100%', my: 1 }}
              variant="outlined"
              onClick={() => randomQuestions()}
            >
              Add random question
            </Button>
            <br />
            <Button
              sx={{ width: '100%', my: 1 }}
              variant="contained"
              color="success"
              type="submit"
            >
              Submit Quiz
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  )
}

export default QuizForm
