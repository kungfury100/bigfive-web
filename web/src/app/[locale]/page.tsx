import { unstable_setRequestLocale } from 'next-intl/server';
import CSVUploaderEnhanced from '@/components/csv-uploader-enhanced';

interface Props {
  params: { locale: string };
}

export default function Home({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Big Five Personality Analysis
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Upload CSV files to compare personalities and get detailed individual analyses with career suggestions
        </p>
      </div>
      
      <CSVUploaderEnhanced />
    </div>
  );
}
