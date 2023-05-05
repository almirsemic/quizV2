export interface Quiz {
    id?: number | string
    name: string
    questions: Question[]
  }
  
  export interface Question {
    id: number | string
    question: string
    answer: string
  }