'use client';

import { useState, useRef } from 'react';
import { Button } from '@nextui-org/button';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Progress } from '@nextui-org/progress';
import { Chip } from '@nextui-org/chip';
import { Divider } from '@nextui-org/divider';
import { Tabs, Tab } from '@nextui-org/tabs';
import { Alert } from '@/components/alert';
import { BarChartCompare } from '@/components/bar-chart-generic';
import { UploadIcon } from '@/components/icons';
import { generateIndividualAnalysis, calculateCompatibility, type PersonalityProfile, type IndividualAnalysis, type RelationshipDynamics } from '@/lib/personality-analysis';
import { getResearchInsight, GENERAL_BIG_FIVE_RESEARCH, getPersonalityDevelopmentPlan } from '@/lib/research-insights';

type PersonalityData = {
  name: string;
  scores: { [domain: string]: { [facet: string]: number } };
};

type ChartSeries = {
  name: string;
  data: number[];
};

interface CSVData {
  filename: string;
  category: string;
  data: { [person: string]: { [subcategory: string]: number } };
}

const CSVUploaderEnhanced: React.FC = () => {
  const [csvFiles, setCsvFiles] = useState<CSVData[]>([]);
  const [data, setData] = useState<PersonalityData[]>([]);
  const [analyses, setAnalyses] = useState<IndividualAnalysis[]>([]);
  const [compatibilities, setCompatibilities] = useState<RelationshipDynamics[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [selectedComparison, setSelectedComparison] = useState<RelationshipDynamics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCSV = (text: string, filename: string): CSVData => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) {
      throw new Error(`${filename}: CSV must have at least a header and one data row`);
    }

    const headers = lines[0].split(',').map(h => h.trim());
    if (headers[0].toLowerCase() !== 'category') {
      throw new Error(`${filename}: First column must be "category"`);
    }

    // Extract category name from filename (remove .csv extension)
    const category = filename.replace(/\.csv$/i, '');
    const personNames = headers.slice(1); // All columns after 'category'
    const data: { [person: string]: { [subcategory: string]: number } } = {};

    // Initialize person data
    personNames.forEach(name => {
      data[name] = {};
    });

    // Parse each row (subcategory)
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length !== headers.length) {
        throw new Error(`${filename}: Row ${i + 1} has ${values.length} columns, expected ${headers.length}`);
      }

      const subcategory = values[0];
      
      for (let j = 1; j < values.length; j++) {
        const score = parseFloat(values[j]);
        if (isNaN(score)) {
          throw new Error(`${filename}: Invalid score "${values[j]}" for ${personNames[j-1]} in ${subcategory}`);
        }
        data[personNames[j-1]][subcategory] = score;
      }
    }

    return { filename, category, data };
  };

  const combineCSVData = (csvFiles: CSVData[]): PersonalityData[] => {
    if (csvFiles.length === 0) return [];

    // Get all unique person names
    const allPersonNames = new Set<string>();
    csvFiles.forEach(csv => {
      Object.keys(csv.data).forEach(name => allPersonNames.add(name));
    });

    // Create PersonData for each person
    const people: PersonalityData[] = [];
    
    allPersonNames.forEach(personName => {
      const person: PersonalityData = {
        name: personName,
        scores: {}
      };

      csvFiles.forEach(csv => {
        if (csv.data[personName]) {
          person.scores[csv.category] = csv.data[personName];
        }
      });

      people.push(person);
    });

    return people;
  };

  const generateAnalyses = (personalityData: PersonalityData[]) => {
    const newAnalyses = personalityData.map(person => {
      const profile: PersonalityProfile = {
        name: person.name,
        scores: person.scores
      };
      return generateIndividualAnalysis(profile);
    });
    setAnalyses(newAnalyses);

    // Generate compatibility analyses for all pairs
    const newCompatibilities: RelationshipDynamics[] = [];
    for (let i = 0; i < personalityData.length; i++) {
      for (let j = i + 1; j < personalityData.length; j++) {
        const profile1: PersonalityProfile = {
          name: personalityData[i].name,
          scores: personalityData[i].scores
        };
        const profile2: PersonalityProfile = {
          name: personalityData[j].name,
          scores: personalityData[j].scores
        };
        const compatibility = calculateCompatibility(profile1, profile2);
        newCompatibilities.push(compatibility);
      }
    }
    setCompatibilities(newCompatibilities);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Validate all files are CSV
    const fileArray = Array.from(files);
    for (let file of fileArray) {
      if (!file.name.toLowerCase().endsWith('.csv')) {
        setError(`Please select only CSV files. "${file.name}" is not a CSV file.`);
        return;
      }
    }

    setIsLoading(true);
    setError('');
    
    try {
      const parsedFiles: CSVData[] = [];
      
      for (let file of fileArray) {
        const text = await file.text();
        const parsedData = parseCSV(text, file.name);
        parsedFiles.push(parsedData);
      }
      
      setCsvFiles(parsedFiles);
      const combinedData = combineCSVData(parsedFiles);
      setData(combinedData);
      
      // Generate personality analyses
      generateAnalyses(combinedData);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV files');
      setCsvFiles([]);
      setData([]);
      setAnalyses([]);
      setCompatibilities([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Get all subcategories from all CSV files in organized order
  const categoryLabels: string[] = [];
  const subcategoryMapping: Array<{category: string, subcategory: string}> = [];
  
  csvFiles.forEach(csv => {
    // Get the subcategories from the first person's data (they should all have the same structure)
    const firstPersonData = Object.values(csv.data)[0];
    if (firstPersonData) {
      Object.keys(firstPersonData).forEach(subcategory => {
        categoryLabels.push(`${subcategory}`); // Short labels for chart
        subcategoryMapping.push({category: csv.category, subcategory});
      });
    }
  });
  
  const chartSeries: ChartSeries[] = data.map(person => ({
    name: person.name,
    data: subcategoryMapping.map(({category, subcategory}) => {
      if (person.scores[category] && person.scores[category][subcategory] !== undefined) {
        return person.scores[category][subcategory];
      }
      return 0;
    })
  }));

  const getScoreLevelColor = (level: 'low' | 'moderate' | 'high') => {
    switch (level) {
      case 'high': return 'success';
      case 'moderate': return 'warning';
      case 'low': return 'default';
    }
  };

  const selectedAnalysis = selectedPerson ? analyses.find(a => a.name === selectedPerson) : null;

  return (
    <div className='space-y-6'>
      <Card>
        <CardHeader>
          <h3 className='text-lg font-semibold'>Upload CSV Files</h3>
          <p className='text-sm text-default-600'>
            Upload multiple CSV files with personality categories. Each file should follow the format: 
            category column + person columns with scores.
          </p>
        </CardHeader>
        <CardBody className='space-y-4'>
          <div className='flex gap-4 items-center'>
            <input
              ref={fileInputRef}
              type='file'
              accept='.csv'
              multiple
              onChange={handleFileUpload}
              className='hidden'
            />
            <Button
              color='primary'
              startContent={<UploadIcon />}
              onPress={() => fileInputRef.current?.click()}
              isLoading={isLoading}
            >
              {isLoading ? 'Processing...' : 'Choose CSV Files'}
            </Button>
          </div>

          {isLoading && (
            <Progress
              size='sm'
              isIndeterminate
              aria-label='Processing CSV file...'
              className='max-w-md'
            />
          )}

          {error && (
            <Alert title='Error processing CSV'>
              {error}
            </Alert>
          )}

          {data.length > 0 && (
            <div className='bg-success-50 text-success-800 p-4 rounded-lg'>
              <div className='font-semibold'>CSV files processed successfully!</div>
              <div className='mt-1'>
                Found {data.length} people across {csvFiles.length} personality categories with detailed analysis.
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {data.length > 0 && (
        <Tabs aria-label="Personality Analysis Options" defaultSelectedKey="overview">
          <Tab key="overview" title="Overview">
            <Card>
              <CardHeader>
                <h3 className='text-lg font-semibold'>Personality Comparison</h3>
              </CardHeader>
              <CardBody className='space-y-6'>
                <div className='space-y-4'>
                  {/* Chart */}
                  <div className='h-96'>
                    <BarChartCompare
                      max={20}
                      categories={categoryLabels}
                      series={chartSeries}
                    />
                  </div>

                  {/* Data Table */}
                  <div className='overflow-x-auto'>
                    <table className='w-full border-collapse'>
                      <thead>
                        <tr className='border-b border-divider'>
                          <th className='text-left p-2 font-medium'>Name</th>
                          {csvFiles.map(csv => (
                            <th key={csv.category} colSpan={Object.keys(Object.values(csv.data)[0] || {}).length} 
                                className='text-center p-2 font-medium border-l border-divider'>
                              {csv.category}
                            </th>
                          ))}
                        </tr>
                        <tr className='border-b border-divider bg-default-50'>
                          <th className='text-left p-2 font-medium text-sm'></th>
                          {csvFiles.map(csv => {
                            const firstPersonData = Object.values(csv.data)[0];
                            return firstPersonData ? Object.keys(firstPersonData).map(subcategory => (
                              <th key={`${csv.category}-${subcategory}`} className='text-center p-1 font-normal text-xs'>
                                {subcategory}
                              </th>
                            )) : null;
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((person, index) => (
                          <tr key={index} className='border-b border-divider hover:bg-default-50'>
                            <td className='p-2 font-medium'>{person.name}</td>
                            {csvFiles.map(csv => {
                              const categoryData = person.scores[csv.category];
                              const firstPersonData = Object.values(csv.data)[0];
                              return firstPersonData ? Object.keys(firstPersonData).map(subcategory => (
                                <td key={`${person.name}-${csv.category}-${subcategory}`} className='p-1 text-center text-sm'>
                                  {categoryData && categoryData[subcategory] !== undefined ? categoryData[subcategory] : '-'}
                                </td>
                              )) : null;
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Tab>

          <Tab key="individual" title="Individual Analysis">
            <div className='space-y-4'>
              {/* Person selector */}
              <Card>
                <CardBody>
                  <div className='flex flex-wrap gap-2'>
                    <span className='text-sm font-medium text-default-600'>Select person:</span>
                    {data.map(person => (
                      <Chip
                        key={person.name}
                        variant={selectedPerson === person.name ? 'solid' : 'bordered'}
                        color={selectedPerson === person.name ? 'primary' : 'default'}
                        className='cursor-pointer'
                        onClick={() => setSelectedPerson(person.name)}
                      >
                        {person.name}
                      </Chip>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Individual Analysis Display */}
              {selectedAnalysis && (
                <div className='space-y-4'>
                  {/* Overall Profile */}
                  <Card>
                    <CardHeader>
                      <h3 className='text-lg font-semibold'>{selectedAnalysis.name} - Personality Profile</h3>
                    </CardHeader>
                    <CardBody className='space-y-4'>
                      <p className='text-default-700'>{selectedAnalysis.overallProfile}</p>
                      
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                          <h4 className='font-medium mb-2'>Working Style</h4>
                          <p className='text-sm text-default-600'>{selectedAnalysis.workingStyle}</p>
                        </div>
                        <div>
                          <h4 className='font-medium mb-2'>Communication Style</h4>
                          <p className='text-sm text-default-600'>{selectedAnalysis.communicationStyle}</p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Domain Analysis */}
                  <Card>
                    <CardHeader>
                      <h3 className='text-lg font-semibold'>Big Five Domains</h3>
                    </CardHeader>
                    <CardBody className='space-y-4'>
                      {Object.entries(selectedAnalysis.domains).map(([domain, analysis]) => (
                        <div key={domain} className='border border-divider rounded-lg p-4'>
                          <div className='flex items-center gap-2 mb-2'>
                            <h4 className='font-medium'>{domain}</h4>
                            <Chip 
                              size='sm' 
                              color={getScoreLevelColor(analysis.level)}
                              variant='flat'
                            >
                              {analysis.level} ({Math.round(analysis.score)})
                            </Chip>
                          </div>
                          <p className='text-sm text-default-600 mb-3'>{analysis.description}</p>
                          
                          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                            <div>
                              <h5 className='font-medium text-success-600 mb-1'>Strengths</h5>
                              <ul className='list-disc list-inside space-y-1'>
                                {analysis.strengths.map((strength, idx) => (
                                  <li key={idx} className='text-default-600'>{strength}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className='font-medium text-warning-600 mb-1'>Areas to Watch</h5>
                              <ul className='list-disc list-inside space-y-1'>
                                {analysis.challenges.map((challenge, idx) => (
                                  <li key={idx} className='text-default-600'>{challenge}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardBody>
                  </Card>

                  {/* Key Insights */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <Card>
                      <CardHeader>
                        <h3 className='text-lg font-semibold text-success-600'>Key Strengths</h3>
                      </CardHeader>
                      <CardBody>
                        <ul className='space-y-2'>
                          {selectedAnalysis.keyStrengths.map((strength, idx) => (
                            <li key={idx} className='flex items-center gap-2'>
                              <div className='w-2 h-2 rounded-full bg-success-500'></div>
                              <span className='text-sm'>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </CardBody>
                    </Card>

                    <Card>
                      <CardHeader>
                        <h3 className='text-lg font-semibold text-warning-600'>Areas to Watch</h3>
                      </CardHeader>
                      <CardBody>
                        <ul className='space-y-2'>
                          {selectedAnalysis.areasToWatch.map((area, idx) => (
                            <li key={idx} className='flex items-center gap-2'>
                              <div className='w-2 h-2 rounded-full bg-warning-500'></div>
                              <span className='text-sm'>{area}</span>
                            </li>
                          ))}
                        </ul>
                      </CardBody>
                    </Card>
                  </div>

                  {/* Career Suggestions */}
                  <Card>
                    <CardHeader>
                      <h3 className='text-lg font-semibold text-primary-600'>Ideal Career Paths</h3>
                    </CardHeader>
                    <CardBody>
                      <div className='flex flex-wrap gap-2'>
                        {selectedAnalysis.idealCareers.map((career, idx) => (
                          <Chip key={idx} color='primary' variant='flat'>
                            {career}
                          </Chip>
                        ))}
                      </div>
                    </CardBody>
                  </Card>

                  {/* Stress Management */}
                  <Card>
                    <CardHeader>
                      <h3 className='text-lg font-semibold text-secondary-600'>Stress Management Tips</h3>
                    </CardHeader>
                    <CardBody>
                      <ul className='space-y-2'>
                        {selectedAnalysis.stressManagement.map((tip, idx) => (
                          <li key={idx} className='flex items-center gap-2'>
                            <div className='w-2 h-2 rounded-full bg-secondary-500'></div>
                            <span className='text-sm'>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardBody>
                  </Card>
                </div>
              )}

              {!selectedPerson && data.length > 0 && (
                <Card>
                  <CardBody className='text-center py-8'>
                    <p className='text-default-500'>Please select a person above to view their detailed personality analysis.</p>
                  </CardBody>
                </Card>
              )}
            </div>
          </Tab>

          <Tab key="compatibility" title="Compatibility Analysis">
            <div className='space-y-4'>
              {compatibilities.length > 0 && (
                <>
                  {/* Compatibility Matrix Overview */}
                  <Card>
                    <CardHeader>
                      <h3 className='text-lg font-semibold'>Compatibility Matrix</h3>
                      <p className='text-sm text-default-600'>Click on any relationship to view detailed analysis</p>
                    </CardHeader>
                    <CardBody>
                      <div className='grid gap-2'>
                        {compatibilities.map((comp, idx) => (
                          <div 
                            key={idx}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedComparison === comp 
                                ? 'border-primary bg-primary-50' 
                                : 'border-divider hover:bg-default-50'
                            }`}
                            onClick={() => setSelectedComparison(comp)}
                          >
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center gap-3'>
                                <span className='font-medium'>{comp.person1}</span>
                                <span className='text-default-400'>↔</span>
                                <span className='font-medium'>{comp.person2}</span>
                              </div>
                              <div className='flex items-center gap-2'>
                                <Chip 
                                  color={
                                    comp.compatibilityScore.level === 'high' ? 'success' :
                                    comp.compatibilityScore.level === 'moderate' ? 'warning' : 'danger'
                                  }
                                  variant='flat'
                                  size='sm'
                                >
                                  {comp.compatibilityScore.score}%
                                </Chip>
                                <span className='text-sm text-default-600 capitalize'>
                                  {comp.compatibilityScore.level}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardBody>
                  </Card>

                  {/* Detailed Compatibility Analysis */}
                  {selectedComparison && (
                    <div className='space-y-4'>
                      <Card>
                        <CardHeader>
                          <h3 className='text-lg font-semibold'>
                            {selectedComparison.person1} ↔ {selectedComparison.person2}
                          </h3>
                          <div className='flex items-center gap-2'>
                            <Chip 
                              color={
                                selectedComparison.compatibilityScore.level === 'high' ? 'success' :
                                selectedComparison.compatibilityScore.level === 'moderate' ? 'warning' : 'danger'
                              }
                              variant='solid'
                            >
                              {selectedComparison.compatibilityScore.score}% Compatibility
                            </Chip>
                          </div>
                        </CardHeader>
                        <CardBody>
                          <p className='text-default-700 mb-4'>
                            {selectedComparison.compatibilityScore.description}
                          </p>
                        </CardBody>
                      </Card>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {/* Relationship Strengths */}
                        <Card>
                          <CardHeader>
                            <h4 className='font-semibold text-success-600'>Relationship Strengths</h4>
                          </CardHeader>
                          <CardBody>
                            <ul className='space-y-2'>
                              {selectedComparison.strengths.map((strength, idx) => (
                                <li key={idx} className='flex items-center gap-2'>
                                  <div className='w-2 h-2 rounded-full bg-success-500'></div>
                                  <span className='text-sm'>{strength}</span>
                                </li>
                              ))}
                            </ul>
                          </CardBody>
                        </Card>

                        {/* Relationship Challenges */}
                        <Card>
                          <CardHeader>
                            <h4 className='font-semibold text-warning-600'>Potential Challenges</h4>
                          </CardHeader>
                          <CardBody>
                            <ul className='space-y-2'>
                              {selectedComparison.challenges.map((challenge, idx) => (
                                <li key={idx} className='flex items-center gap-2'>
                                  <div className='w-2 h-2 rounded-full bg-warning-500'></div>
                                  <span className='text-sm'>{challenge}</span>
                                </li>
                              ))}
                            </ul>
                          </CardBody>
                        </Card>
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {/* Working Together */}
                        <Card>
                          <CardHeader>
                            <h4 className='font-semibold text-primary-600'>Working Together</h4>
                          </CardHeader>
                          <CardBody>
                            <ul className='space-y-2'>
                              {selectedComparison.workingTogether.map((tip, idx) => (
                                <li key={idx} className='flex items-center gap-2'>
                                  <div className='w-2 h-2 rounded-full bg-primary-500'></div>
                                  <span className='text-sm'>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </CardBody>
                        </Card>

                        {/* Communication Tips */}
                        <Card>
                          <CardHeader>
                            <h4 className='font-semibold text-secondary-600'>Communication Tips</h4>
                          </CardHeader>
                          <CardBody>
                            <ul className='space-y-2'>
                              {selectedComparison.communicationTips.map((tip, idx) => (
                                <li key={idx} className='flex items-center gap-2'>
                                  <div className='w-2 h-2 rounded-full bg-secondary-500'></div>
                                  <span className='text-sm'>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </CardBody>
                        </Card>
                      </div>

                      {/* Conflict Areas */}
                      {selectedComparison.conflictAreas.length > 0 && (
                        <Card>
                          <CardHeader>
                            <h4 className='font-semibold text-danger-600'>Areas to Watch for Conflict</h4>
                          </CardHeader>
                          <CardBody>
                            <ul className='space-y-2'>
                              {selectedComparison.conflictAreas.map((area, idx) => (
                                <li key={idx} className='flex items-center gap-2'>
                                  <div className='w-2 h-2 rounded-full bg-danger-500'></div>
                                  <span className='text-sm'>{area}</span>
                                </li>
                              ))}
                            </ul>
                          </CardBody>
                        </Card>
                      )}
                    </div>
                  )}

                  {!selectedComparison && (
                    <Card>
                      <CardBody className='text-center py-8'>
                        <p className='text-default-500'>
                          Select a relationship pair above to view detailed compatibility analysis.
                        </p>
                      </CardBody>
                    </Card>
                  )}
                </>
              )}

              {compatibilities.length === 0 && data.length > 0 && (
                <Card>
                  <CardBody className='text-center py-8'>
                    <p className='text-default-500'>
                      Upload at least 2 people to see compatibility analysis.
                    </p>
                  </CardBody>
                </Card>
              )}
            </div>
          </Tab>

          <Tab key="research" title="Research Insights">
            <div className='space-y-6'>
              {/* Big Five Overview */}
              <Card>
                <CardHeader>
                  <h3 className='text-lg font-semibold'>Big Five Personality Research</h3>
                  <p className='text-sm text-default-600'>Evidence-based insights from psychological research</p>
                </CardHeader>
                <CardBody className='space-y-4'>
                  <div>
                    <h4 className='font-medium mb-2'>Research Overview</h4>
                    <ul className='space-y-2'>
                      {GENERAL_BIG_FIVE_RESEARCH.overview.map((finding, idx) => (
                        <li key={idx} className='flex items-start gap-2'>
                          <div className='w-2 h-2 rounded-full bg-primary-500 mt-2 flex-shrink-0'></div>
                          <span className='text-sm text-default-700'>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Divider />

                  <div>
                    <h4 className='font-medium mb-2'>Key Research Findings</h4>
                    <ul className='space-y-2'>
                      {GENERAL_BIG_FIVE_RESEARCH.keyFindings.map((finding, idx) => (
                        <li key={idx} className='flex items-start gap-2'>
                          <div className='w-2 h-2 rounded-full bg-success-500 mt-2 flex-shrink-0'></div>
                          <span className='text-sm text-default-700'>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Divider />

                  <div>
                    <h4 className='font-medium mb-2'>Practical Applications</h4>
                    <ul className='space-y-2'>
                      {GENERAL_BIG_FIVE_RESEARCH.applications.map((application, idx) => (
                        <li key={idx} className='flex items-start gap-2'>
                          <div className='w-2 h-2 rounded-full bg-secondary-500 mt-2 flex-shrink-0'></div>
                          <span className='text-sm text-default-700'>{application}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Divider />

                  <div>
                    <h4 className='font-medium mb-2'>Research Limitations</h4>
                    <ul className='space-y-2'>
                      {GENERAL_BIG_FIVE_RESEARCH.limitations.map((limitation, idx) => (
                        <li key={idx} className='flex items-start gap-2'>
                          <div className='w-2 h-2 rounded-full bg-warning-500 mt-2 flex-shrink-0'></div>
                          <span className='text-sm text-default-700'>{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardBody>
              </Card>

              {/* Domain-Specific Research */}
              {data.length > 0 && (
                <div className='space-y-4'>
                  <h3 className='text-lg font-semibold'>Domain-Specific Research Insights</h3>
                  {Object.keys(data[0].scores).map(domain => {
                    const research = getResearchInsight(domain);
                    if (!research) return null;

                    return (
                      <Card key={domain}>
                        <CardHeader>
                          <h4 className='font-semibold text-primary-600'>{domain}</h4>
                        </CardHeader>
                        <CardBody className='space-y-4'>
                          <div>
                            <h5 className='font-medium mb-2'>Research Findings</h5>
                            <ul className='space-y-1'>
                              {research.researchFindings.slice(0, 3).map((finding, idx) => (
                                <li key={idx} className='text-sm text-default-700'>
                                  • {finding}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h5 className='font-medium mb-2'>Practical Applications</h5>
                            <div className='flex flex-wrap gap-1'>
                              {research.practicalApplications.slice(0, 4).map((app, idx) => (
                                <Chip key={idx} size='sm' variant='flat' color='primary'>
                                  {app}
                                </Chip>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h5 className='font-medium mb-2'>Development Strategies</h5>
                            <ul className='space-y-1'>
                              {research.developmentStrategies.slice(0, 2).map((strategy, idx) => (
                                <li key={idx} className='text-sm text-default-700'>
                                  • {strategy}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <details className='mt-3'>
                            <summary className='cursor-pointer text-sm font-medium text-default-600 hover:text-default-800'>
                              View Research Citations
                            </summary>
                            <div className='mt-2 space-y-1'>
                              {research.citations.slice(0, 3).map((citation, idx) => (
                                <p key={idx} className='text-xs text-default-500 italic'>
                                  {citation}
                                </p>
                              ))}
                            </div>
                          </details>
                        </CardBody>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* Personalized Development Plan */}
              {selectedPerson && selectedAnalysis && (
                <Card>
                  <CardHeader>
                    <h3 className='text-lg font-semibold'>Research-Based Development Plan for {selectedPerson}</h3>
                    <p className='text-sm text-default-600'>Personalized recommendations based on psychological research</p>
                  </CardHeader>
                  <CardBody className='space-y-4'>
                    {(() => {
                      const domains = Object.fromEntries(
                        Object.entries(selectedAnalysis.domains).map(([domain, analysis]) => [
                          domain, 
                          { level: analysis.level, score: analysis.score }
                        ])
                      );
                      const plan = getPersonalityDevelopmentPlan(domains);
                      
                      return (
                        <>
                          <div>
                            <h4 className='font-medium text-success-600 mb-2'>Research-Backed Strengths</h4>
                            <ul className='space-y-1'>
                              {plan.strengths.map((strength, idx) => (
                                <li key={idx} className='text-sm text-default-700'>• {strength}</li>
                              ))}
                            </ul>
                          </div>

                          {plan.developmentAreas.length > 0 && (
                            <div>
                              <h4 className='font-medium text-warning-600 mb-2'>Development Opportunities</h4>
                              <ul className='space-y-1'>
                                {plan.developmentAreas.map((area, idx) => (
                                  <li key={idx} className='text-sm text-default-700'>• {area}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div>
                            <h4 className='font-medium text-primary-600 mb-2'>Evidence-Based Action Plan</h4>
                            <ul className='space-y-1'>
                              {plan.actionPlan.map((action, idx) => (
                                <li key={idx} className='text-sm text-default-700'>• {action}</li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className='font-medium text-secondary-600 mb-2'>Research Foundation</h4>
                            <ul className='space-y-1'>
                              {plan.researchBasis.map((basis, idx) => (
                                <li key={idx} className='text-xs text-default-600 italic'>• {basis}</li>
                              ))}
                            </ul>
                          </div>
                        </>
                      );
                    })()}
                  </CardBody>
                </Card>
              )}

              {!selectedPerson && data.length > 0 && (
                <Card>
                  <CardBody className='text-center py-8'>
                    <p className='text-default-500'>
                      Select a person in the Individual Analysis tab to see their personalized research-based development plan.
                    </p>
                  </CardBody>
                </Card>
              )}
            </div>
          </Tab>
        </Tabs>
      )}
    </div>
  );
};

export default CSVUploaderEnhanced;