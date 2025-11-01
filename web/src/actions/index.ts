'use server';

import { connectToDatabase } from '@/db';
import { ObjectId } from 'mongodb';
import { B5Error, DbResult, Feedback } from '@/types';
import calculateScore from '@bigfive-org/score';
import generateResult, {
  getInfo,
  Language,
  Domain
} from '@bigfive-org/results';

const collectionName = process.env.DB_COLLECTION || 'results';
const resultLanguages = getInfo().languages;

export type Report = {
  id: string;
  timestamp: number;
  availableLanguages: Language[];
  language: string;
  results: Domain[];
};

// Mock data for demonstration purposes when DB is not available  
const mockAnswers = [
  { domain: 'E', score: 4, id: 'mock-1' },
  { domain: 'E', score: 3, id: 'mock-2' },
  { domain: 'E', score: 4, id: 'mock-3' },
  { domain: 'E', score: 3, id: 'mock-4' },
  { domain: 'E', score: 4, id: 'mock-5' },
  { domain: 'E', score: 2, id: 'mock-6' },
  { domain: 'E', score: 4, id: 'mock-7' },
  { domain: 'E', score: 3, id: 'mock-8' },
  { domain: 'E', score: 4, id: 'mock-9' },
  { domain: 'E', score: 3, id: 'mock-10' },
  { domain: 'E', score: 4, id: 'mock-11' },
  { domain: 'E', score: 2, id: 'mock-12' },
  { domain: 'E', score: 3, id: 'mock-13' },
  { domain: 'E', score: 4, id: 'mock-14' },
  { domain: 'E', score: 3, id: 'mock-15' },
  { domain: 'E', score: 4, id: 'mock-16' },
  { domain: 'E', score: 3, id: 'mock-17' },
  { domain: 'E', score: 4, id: 'mock-18' },
  { domain: 'E', score: 2, id: 'mock-19' },
  { domain: 'E', score: 4, id: 'mock-20' },
  { domain: 'E', score: 3, id: 'mock-21' },
  { domain: 'E', score: 4, id: 'mock-22' },
  { domain: 'E', score: 3, id: 'mock-23' },
  { domain: 'E', score: 4, id: 'mock-24' },
  { domain: 'A', score: 4, id: 'mock-25' },
  { domain: 'A', score: 3, id: 'mock-26' },
  { domain: 'A', score: 4, id: 'mock-27' },
  { domain: 'A', score: 3, id: 'mock-28' },
  { domain: 'A', score: 4, id: 'mock-29' },
  { domain: 'A', score: 2, id: 'mock-30' },
  { domain: 'A', score: 4, id: 'mock-31' },
  { domain: 'A', score: 3, id: 'mock-32' },
  { domain: 'A', score: 4, id: 'mock-33' },
  { domain: 'A', score: 3, id: 'mock-34' },
  { domain: 'A', score: 4, id: 'mock-35' },
  { domain: 'A', score: 2, id: 'mock-36' },
  { domain: 'A', score: 3, id: 'mock-37' },
  { domain: 'A', score: 4, id: 'mock-38' },
  { domain: 'A', score: 3, id: 'mock-39' },
  { domain: 'A', score: 4, id: 'mock-40' },
  { domain: 'A', score: 3, id: 'mock-41' },
  { domain: 'A', score: 4, id: 'mock-42' },
  { domain: 'A', score: 2, id: 'mock-43' },
  { domain: 'A', score: 4, id: 'mock-44' },
  { domain: 'A', score: 3, id: 'mock-45' },
  { domain: 'A', score: 4, id: 'mock-46' },
  { domain: 'A', score: 3, id: 'mock-47' },
  { domain: 'A', score: 4, id: 'mock-48' },
  { domain: 'C', score: 4, id: 'mock-49' },
  { domain: 'C', score: 3, id: 'mock-50' },
  { domain: 'C', score: 4, id: 'mock-51' },
  { domain: 'C', score: 3, id: 'mock-52' },
  { domain: 'C', score: 4, id: 'mock-53' },
  { domain: 'C', score: 2, id: 'mock-54' },
  { domain: 'C', score: 4, id: 'mock-55' },
  { domain: 'C', score: 3, id: 'mock-56' },
  { domain: 'C', score: 4, id: 'mock-57' },
  { domain: 'C', score: 3, id: 'mock-58' },
  { domain: 'C', score: 4, id: 'mock-59' },
  { domain: 'C', score: 2, id: 'mock-60' },
  { domain: 'C', score: 3, id: 'mock-61' },
  { domain: 'C', score: 4, id: 'mock-62' },
  { domain: 'C', score: 3, id: 'mock-63' },
  { domain: 'C', score: 4, id: 'mock-64' },
  { domain: 'C', score: 3, id: 'mock-65' },
  { domain: 'C', score: 4, id: 'mock-66' },
  { domain: 'C', score: 2, id: 'mock-67' },
  { domain: 'C', score: 4, id: 'mock-68' },
  { domain: 'C', score: 3, id: 'mock-69' },
  { domain: 'C', score: 4, id: 'mock-70' },
  { domain: 'C', score: 3, id: 'mock-71' },
  { domain: 'C', score: 4, id: 'mock-72' },
  { domain: 'N', score: 2, id: 'mock-73' },
  { domain: 'N', score: 1, id: 'mock-74' },
  { domain: 'N', score: 2, id: 'mock-75' },
  { domain: 'N', score: 1, id: 'mock-76' },
  { domain: 'N', score: 2, id: 'mock-77' },
  { domain: 'N', score: 1, id: 'mock-78' },
  { domain: 'N', score: 2, id: 'mock-79' },
  { domain: 'N', score: 1, id: 'mock-80' },
  { domain: 'N', score: 2, id: 'mock-81' },
  { domain: 'N', score: 1, id: 'mock-82' },
  { domain: 'N', score: 2, id: 'mock-83' },
  { domain: 'N', score: 1, id: 'mock-84' },
  { domain: 'N', score: 1, id: 'mock-85' },
  { domain: 'N', score: 2, id: 'mock-86' },
  { domain: 'N', score: 1, id: 'mock-87' },
  { domain: 'N', score: 2, id: 'mock-88' },
  { domain: 'N', score: 1, id: 'mock-89' },
  { domain: 'N', score: 2, id: 'mock-90' },
  { domain: 'N', score: 1, id: 'mock-91' },
  { domain: 'N', score: 2, id: 'mock-92' },
  { domain: 'N', score: 1, id: 'mock-93' },
  { domain: 'N', score: 2, id: 'mock-94' },
  { domain: 'N', score: 1, id: 'mock-95' },
  { domain: 'N', score: 2, id: 'mock-96' },
  { domain: 'O', score: 4, id: 'mock-97' },
  { domain: 'O', score: 3, id: 'mock-98' },
  { domain: 'O', score: 4, id: 'mock-99' },
  { domain: 'O', score: 3, id: 'mock-100' },
  { domain: 'O', score: 4, id: 'mock-101' },
  { domain: 'O', score: 2, id: 'mock-102' },
  { domain: 'O', score: 4, id: 'mock-103' },
  { domain: 'O', score: 3, id: 'mock-104' },
  { domain: 'O', score: 4, id: 'mock-105' },
  { domain: 'O', score: 3, id: 'mock-106' },
  { domain: 'O', score: 4, id: 'mock-107' },
  { domain: 'O', score: 2, id: 'mock-108' },
  { domain: 'O', score: 3, id: 'mock-109' },
  { domain: 'O', score: 4, id: 'mock-110' },
  { domain: 'O', score: 3, id: 'mock-111' },
  { domain: 'O', score: 4, id: 'mock-112' },
  { domain: 'O', score: 3, id: 'mock-113' },
  { domain: 'O', score: 4, id: 'mock-114' },
  { domain: 'O', score: 2, id: 'mock-115' },
  { domain: 'O', score: 4, id: 'mock-116' },
  { domain: 'O', score: 3, id: 'mock-117' },
  { domain: 'O', score: 4, id: 'mock-118' },
  { domain: 'O', score: 3, id: 'mock-119' },
  { domain: 'O', score: 4, id: 'mock-120' }
];

// Generate slightly different mock answers for different personalities
const generateVariedAnswers = (variation: number) => {
  return mockAnswers.map((answer, index) => ({
    ...answer,
    id: `mock-${variation}-${index}`,
    score: Math.max(1, Math.min(5, answer.score + (variation - 2))) // Vary scores slightly
  }));
};

const mockResults = {
  '58a70606a835c400c8b38e84': {
    _id: '58a70606a835c400c8b38e84',
    answers: mockAnswers,
    lang: 'en',
    dateStamp: Date.now()
  },
  '58a70606a835c400c8b38e85': {
    _id: '58a70606a835c400c8b38e85',
    answers: generateVariedAnswers(1),
    lang: 'en',
    dateStamp: Date.now()
  },
  '58a70606a835c400c8b38e86': {
    _id: '58a70606a835c400c8b38e86',
    answers: generateVariedAnswers(3),
    lang: 'en',
    dateStamp: Date.now()
  },
  '58a70606a835c400c8b38e87': {
    _id: '58a70606a835c400c8b38e87',
    answers: generateVariedAnswers(4),
    lang: 'en',
    dateStamp: Date.now()
  },
  '58a70606a835c400c8b38e88': {
    _id: '58a70606a835c400c8b38e88',
    answers: generateVariedAnswers(0),
    lang: 'en',
    dateStamp: Date.now()
  }
};

export async function getTestResult(
  id: string,
  language?: string
): Promise<Report | undefined> {
  'use server';
  
  // Use mock data if no database connection or for mock test IDs
  if (mockResults[id as keyof typeof mockResults] || !process.env.DB_URL) {
    const mockReport = mockResults[id as keyof typeof mockResults] || mockResults['58a70606a835c400c8b38e84'];
    const selectedLanguage = language || mockReport.lang || 'en';
    // Transform the mock answers to match the expected format for calculateScore
    const transformedAnswers = mockReport.answers.map(answer => ({
      domain: answer.domain,
      score: answer.score,
      facet: undefined // Skip facet for simplicity
    }));
    const scores = calculateScore({ answers: transformedAnswers });
    const results = generateResult({ lang: selectedLanguage, scores });
    
    return {
      id: mockReport._id,
      timestamp: mockReport.dateStamp,
      availableLanguages: resultLanguages,
      language: selectedLanguage,
      results
    };
  }

  try {
    const query = { _id: new ObjectId(id) };
    const db = await connectToDatabase();
    const collection = db.collection(collectionName);
    const report = await collection.findOne(query);
    if (!report) {
      console.error(`The test results with id ${id} are not found!`);
      throw new B5Error({
        name: 'NotFoundError',
        message: `The test results with id ${id} is not found in the database!`
      });
    }
    const selectedLanguage =
      language ||
      (!!resultLanguages.find((l) => l.id == report.lang) ? report.lang : 'en');
    const scores = calculateScore({ answers: report.answers });
    const results = generateResult({ lang: selectedLanguage, scores });
    return {
      id: report._id.toString(),
      timestamp: report.dateStamp,
      availableLanguages: resultLanguages,
      language: selectedLanguage,
      results
    };
  } catch (error) {
    if (error instanceof B5Error) {
      throw error;
    }
    throw new Error('Something wrong happend. Failed to get test result!');
  }
}

export async function saveTest(testResult: DbResult) {
  'use server';
  try {
    const db = await connectToDatabase();
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(testResult);
    return { id: result.insertedId.toString() };
  } catch (error) {
    console.error(error);
    throw new B5Error({
      name: 'SavingError',
      message: 'Failed to save test result!'
    });
  }
}

export type FeebackState = {
  message: string;
  type: 'error' | 'success';
};

export async function saveFeedback(
  prevState: FeebackState,
  formData: FormData
): Promise<FeebackState> {
  'use server';
  const feedback: Feedback = {
    name: String(formData.get('name')),
    email: String(formData.get('email')),
    message: String(formData.get('message'))
  };
  try {
    const db = await connectToDatabase();
    const collection = db.collection('feedback');
    await collection.insertOne({ feedback });
    return {
      message: 'Sent successfully!',
      type: 'success'
    };
  } catch (error) {
    return {
      message: 'Error sending feedback!',
      type: 'error'
    };
  }
}
