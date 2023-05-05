import { useEffect, useState } from 'react'
import axios, { CancelTokenSource } from 'axios'
import { Quiz } from '../Types/types'

const useFetchQuizzes = (id?: number | string, conditionally?: boolean) => {
  const [quizzes, setQuizzes] = useState<null | Quiz[]>(null)

  useEffect(() => {
    const cancelToken: CancelTokenSource = axios.CancelToken.source()
    async function fetchQuizzes(): Promise<void> {
      try {
        const response = await axios.get<Quiz[] | Quiz | any>(
          id ? `/quizzes/${id}` : '/quizzes',
          {
            cancelToken: cancelToken.token,
          },
        )
        if (response.status === 200) {
          setQuizzes(response.data)
        }
      } catch (error: any) {
        if (axios.isCancel(error)) {
          console.warn('Request canceled:', error.message)
        } else {
          console.warn(error)
        }
      }
    }
    if (conditionally) {
      fetchQuizzes()
    }
    return () => {
      cancelToken.cancel('Component unmounted')
    }
  }, [id, conditionally])
  return quizzes
}

export default useFetchQuizzes
