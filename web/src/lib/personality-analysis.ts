// Comprehensive Big Five Personality Analysis Utility
// Based on established psychological research and the OCEAN model

export interface PersonalityProfile {
  name: string;
  scores: {
    [domain: string]: {
      [facet: string]: number;
    };
  };
}

export interface DomainAnalysis {
  level: 'low' | 'moderate' | 'high';
  score: number;
  description: string;
  strengths: string[];
  challenges: string[];
  careerSuggestions: string[];
  developmentAreas: string[];
}

export interface IndividualAnalysis {
  name: string;
  domains: {
    [domain: string]: DomainAnalysis;
  };
  overallProfile: string;
  keyStrengths: string[];
  areasToWatch: string[];
  idealCareers: string[];
  workingStyle: string;
  communicationStyle: string;
  stressManagement: string[];
}

export interface CompatibilityScore {
  score: number; // 0-100, higher is better
  level: 'low' | 'moderate' | 'high';
  description: string;
}

export interface RelationshipDynamics {
  person1: string;
  person2: string;
  compatibilityScore: CompatibilityScore;
  strengths: string[];
  challenges: string[];
  workingTogether: string[];
  communicationTips: string[];
  conflictAreas: string[];
}

// Domain scoring thresholds
const DOMAIN_THRESHOLDS = {
  low: 8,
  high: 14
};

// Domain descriptions and analysis
const DOMAIN_PROFILES = {
  'Agreeableness': {
    low: {
      description: 'Competitive, skeptical, and challenging. Values honesty over harmony.',
      strengths: ['Critical thinking', 'Negotiation skills', 'Objective decision-making', 'Leadership potential'],
      challenges: ['May seem unsympathetic', 'Can be overly critical', 'Difficulty in team harmony'],
      careers: ['Lawyer', 'Critic', 'Scientist', 'Military Officer', 'Judge', 'Researcher', 'Analyst'],
      development: ['Practice empathy', 'Listen to others\' perspectives', 'Consider team morale']
    },
    moderate: {
      description: 'Balanced between cooperation and competition. Adaptable in social situations.',
      strengths: ['Diplomatic', 'Balanced perspective', 'Adaptable leadership', 'Fair-minded'],
      challenges: ['May be indecisive', 'Could avoid necessary confrontation'],
      careers: ['Manager', 'Consultant', 'Teacher', 'Mediator', 'Project Manager', 'Sales Professional'],
      development: ['Develop assertiveness when needed', 'Clear boundary setting']
    },
    high: {
      description: 'Cooperative, trusting, and helpful. Natural team player and peacemaker.',
      strengths: ['Team collaboration', 'Conflict resolution', 'Empathy', 'Customer service'],
      challenges: ['May be taken advantage of', 'Difficulty saying no', 'Avoids necessary conflict'],
      careers: ['Counselor', 'Social Worker', 'Teacher', 'Nurse', 'HR Professional', 'Therapist'],
      development: ['Practice assertiveness', 'Set healthy boundaries', 'Develop negotiation skills']
    }
  },
  'Conscientiousness': {
    low: {
      description: 'Flexible, spontaneous, and adaptable. Prefers freedom over structure.',
      strengths: ['Adaptability', 'Creativity', 'Spontaneity', 'Innovation'],
      challenges: ['Time management', 'Following through', 'Organization'],
      careers: ['Artist', 'Entrepreneur', 'Freelancer', 'Creative Director', 'Journalist', 'Actor'],
      development: ['Develop planning skills', 'Use organizational tools', 'Set achievable goals']
    },
    moderate: {
      description: 'Balanced between structure and flexibility. Goal-oriented but adaptable.',
      strengths: ['Balanced approach', 'Goal achievement', 'Flexible planning', 'Practical decisions'],
      challenges: ['May procrastinate on uninteresting tasks', 'Inconsistent organization'],
      careers: ['Project Manager', 'Marketing Professional', 'Designer', 'Consultant', 'Coordinator'],
      development: ['Strengthen follow-through', 'Improve time management systems']
    },
    high: {
      description: 'Organized, reliable, and goal-oriented. Excellent follow-through and self-discipline.',
      strengths: ['Organization', 'Reliability', 'Goal achievement', 'Time management', 'Quality work'],
      challenges: ['May be inflexible', 'Perfectionist tendencies', 'Difficulty with change'],
      careers: ['Accountant', 'Engineer', 'Project Manager', 'Surgeon', 'Administrator', 'Quality Assurance'],
      development: ['Practice flexibility', 'Delegate when appropriate', 'Accept "good enough"']
    }
  },
  'Extraversion': {
    low: {
      description: 'Reserved, independent, and thoughtful. Prefers depth over breadth in relationships.',
      strengths: ['Deep thinking', 'Independent work', 'Careful decision-making', 'One-on-one relationships'],
      challenges: ['Networking', 'Public speaking', 'Team leadership'],
      careers: ['Researcher', 'Writer', 'Programmer', 'Librarian', 'Analyst', 'Accountant', 'Technician'],
      development: ['Practice public speaking', 'Develop networking skills', 'Share ideas more openly']
    },
    moderate: {
      description: 'Ambivert - comfortable in both social and solitary situations. Adaptable energy levels.',
      strengths: ['Social flexibility', 'Balanced communication', 'Versatile leadership', 'Adaptability'],
      challenges: ['May be seen as inconsistent', 'Energy management'],
      careers: ['Manager', 'Teacher', 'Consultant', 'Customer Service', 'Coordinator', 'Trainer'],
      development: ['Recognize energy patterns', 'Communicate preferences clearly']
    },
    high: {
      description: 'Outgoing, energetic, and sociable. Natural networker and team energizer.',
      strengths: ['Leadership', 'Networking', 'Team motivation', 'Public speaking', 'Energy'],
      challenges: ['May dominate conversations', 'Needs social stimulation', 'Impulsive decisions'],
      careers: ['Sales', 'Marketing', 'Public Relations', 'Teacher', 'Politician', 'Event Coordinator'],
      development: ['Practice listening', 'Allow others to contribute', 'Develop patience']
    }
  },
  'Neuroticism': {
    low: {
      description: 'Emotionally stable, calm, and resilient. Handles stress well and stays composed.',
      strengths: ['Stress tolerance', 'Emotional stability', 'Crisis management', 'Optimism'],
      challenges: ['May underestimate emotional needs', 'Could seem insensitive to others\' stress'],
      careers: ['Emergency Responder', 'Surgeon', 'Air Traffic Controller', 'Crisis Manager', 'Military'],
      development: ['Recognize others\' emotional needs', 'Develop emotional intelligence']
    },
    moderate: {
      description: 'Generally stable but responsive to stress. Normal emotional reactions to challenges.',
      strengths: ['Balanced emotional responses', 'Empathy', 'Realistic assessment', 'Motivation'],
      challenges: ['Stress in high-pressure situations', 'Occasional anxiety'],
      careers: ['Manager', 'Teacher', 'Healthcare Professional', 'Counselor', 'Administrator'],
      development: ['Stress management techniques', 'Build resilience strategies']
    },
    high: {
      description: 'Emotionally sensitive and reactive. Experiences stress and emotions intensely.',
      strengths: ['Emotional intelligence', 'Empathy', 'Motivation', 'Attention to problems'],
      challenges: ['Stress management', 'Emotional overwhelm', 'Decision-making under pressure'],
      careers: ['Artist', 'Writer', 'Therapist', 'Creative Professional', 'Social Worker'],
      development: ['Stress management', 'Mindfulness practices', 'Emotional regulation techniques']
    }
  },
  'Openness To Experience': {
    low: {
      description: 'Practical, conventional, and focused on proven methods. Values tradition and stability.',
      strengths: ['Practical skills', 'Attention to detail', 'Reliability', 'Implementation'],
      challenges: ['Adapting to change', 'Creative problem-solving', 'Innovation'],
      careers: ['Accountant', 'Banker', 'Administrator', 'Technician', 'Inspector', 'Traditional roles'],
      development: ['Embrace small changes', 'Explore new perspectives', 'Value diverse viewpoints']
    },
    moderate: {
      description: 'Balanced between tradition and innovation. Open to new ideas when practical.',
      strengths: ['Balanced perspective', 'Practical innovation', 'Selective openness', 'Implementation'],
      challenges: ['May resist radical change', 'Selective creativity'],
      careers: ['Manager', 'Engineer', 'Teacher', 'Business Analyst', 'Coordinator'],
      development: ['Explore creative outlets', 'Challenge assumptions regularly']
    },
    high: {
      description: 'Creative, curious, and open to new experiences. Natural innovator and explorer.',
      strengths: ['Creativity', 'Innovation', 'Learning', 'Adaptability', 'Vision'],
      challenges: ['May lack focus', 'Practical implementation', 'Following conventions'],
      careers: ['Artist', 'Researcher', 'Designer', 'Consultant', 'Entrepreneur', 'Academic'],
      development: ['Focus on implementation', 'Develop practical skills', 'Complete projects']
    }
  }
};

export function getScoreLevel(score: number): 'low' | 'moderate' | 'high' {
  if (score <= DOMAIN_THRESHOLDS.low) return 'low';
  if (score >= DOMAIN_THRESHOLDS.high) return 'high';
  return 'moderate';
}

export function analyzeDomain(domain: string, score: number): DomainAnalysis {
  const level = getScoreLevel(score);
  const profile = DOMAIN_PROFILES[domain as keyof typeof DOMAIN_PROFILES];
  const levelData = profile[level];

  return {
    level,
    score,
    description: levelData.description,
    strengths: levelData.strengths,
    challenges: levelData.challenges,
    careerSuggestions: levelData.careers,
    developmentAreas: levelData.development
  };
}

export function generateIndividualAnalysis(profile: PersonalityProfile): IndividualAnalysis {
  const domains: { [domain: string]: DomainAnalysis } = {};
  const allStrengths: string[] = [];
  const allChallenges: string[] = [];
  const allCareers: string[] = [];

  // Calculate average scores for each domain
  Object.entries(profile.scores).forEach(([domain, facets]) => {
    const facetScores = Object.values(facets);
    const averageScore = facetScores.reduce((sum, score) => sum + score, 0) / facetScores.length;
    
    const analysis = analyzeDomain(domain, averageScore);
    domains[domain] = analysis;
    
    allStrengths.push(...analysis.strengths);
    allChallenges.push(...analysis.challenges);
    allCareers.push(...analysis.careerSuggestions);
  });

  // Generate overall insights
  const highDomains = Object.entries(domains)
    .filter(([_, analysis]) => analysis.level === 'high')
    .map(([domain, _]) => domain);

  const lowDomains = Object.entries(domains)
    .filter(([_, analysis]) => analysis.level === 'low')
    .map(([domain, _]) => domain);

  // Generate working style
  let workingStyle = '';
  if (domains['Conscientiousness']?.level === 'high') {
    workingStyle += 'Structured and organized. ';
  }
  if (domains['Extraversion']?.level === 'high') {
    workingStyle += 'Collaborative and energetic. ';
  } else if (domains['Extraversion']?.level === 'low') {
    workingStyle += 'Independent and focused. ';
  }
  if (domains['Openness To Experience']?.level === 'high') {
    workingStyle += 'Creative and innovative. ';
  }

  // Generate communication style
  let communicationStyle = '';
  if (domains['Extraversion']?.level === 'high') {
    communicationStyle = 'Direct, enthusiastic, and engaging. Prefers face-to-face interaction.';
  } else if (domains['Extraversion']?.level === 'low') {
    communicationStyle = 'Thoughtful, careful, and prefers written communication or small groups.';
  } else {
    communicationStyle = 'Adaptable communication style, comfortable in various settings.';
  }

  if (domains['Agreeableness']?.level === 'high') {
    communicationStyle += ' Diplomatic and harmony-focused.';
  } else if (domains['Agreeableness']?.level === 'low') {
    communicationStyle += ' Direct and challenging when necessary.';
  }

  return {
    name: profile.name,
    domains,
    overallProfile: generateOverallProfile(domains),
    keyStrengths: Array.from(new Set(allStrengths)).slice(0, 6),
    areasToWatch: Array.from(new Set(allChallenges)).slice(0, 4),
    idealCareers: Array.from(new Set(allCareers)).slice(0, 8),
    workingStyle: workingStyle.trim(),
    communicationStyle,
    stressManagement: generateStressManagement(domains)
  };
}

function generateOverallProfile(domains: { [domain: string]: DomainAnalysis }): string {
  const traits = [];
  
  if (domains['Extraversion']?.level === 'high') traits.push('outgoing and energetic');
  else if (domains['Extraversion']?.level === 'low') traits.push('reserved and thoughtful');
  
  if (domains['Agreeableness']?.level === 'high') traits.push('cooperative and trusting');
  else if (domains['Agreeableness']?.level === 'low') traits.push('competitive and skeptical');
  
  if (domains['Conscientiousness']?.level === 'high') traits.push('organized and disciplined');
  else if (domains['Conscientiousness']?.level === 'low') traits.push('flexible and spontaneous');
  
  if (domains['Neuroticism']?.level === 'high') traits.push('emotionally sensitive');
  else if (domains['Neuroticism']?.level === 'low') traits.push('emotionally stable');
  
  if (domains['Openness To Experience']?.level === 'high') traits.push('creative and curious');
  else if (domains['Openness To Experience']?.level === 'low') traits.push('practical and conventional');

  return `A ${traits.join(', ')} individual who brings unique strengths to any team or role.`;
}

function generateStressManagement(domains: { [domain: string]: DomainAnalysis }): string[] {
  const tips = [];
  
  if (domains['Neuroticism']?.level === 'high') {
    tips.push('Practice mindfulness and relaxation techniques');
    tips.push('Develop emotional regulation strategies');
    tips.push('Create predictable routines when possible');
  }
  
  if (domains['Conscientiousness']?.level === 'low') {
    tips.push('Use external organization tools and reminders');
    tips.push('Break large tasks into smaller, manageable steps');
  }
  
  if (domains['Extraversion']?.level === 'high') {
    tips.push('Ensure regular social interaction for energy');
    tips.push('Process stress through discussion with others');
  } else if (domains['Extraversion']?.level === 'low') {
    tips.push('Schedule regular quiet time for reflection');
    tips.push('Avoid over-scheduling social activities');
  }

  return tips.length > 0 ? tips : ['Maintain work-life balance', 'Regular exercise and healthy habits'];
}

export function calculateCompatibility(person1: PersonalityProfile, person2: PersonalityProfile): RelationshipDynamics {
  // Calculate compatibility score based on personality research
  let compatibilityScore = 50; // Base score
  
  const person1Averages: { [domain: string]: number } = {};
  const person2Averages: { [domain: string]: number } = {};
  
  // Calculate domain averages
  Object.entries(person1.scores).forEach(([domain, facets]) => {
    const facetScores = Object.values(facets);
    person1Averages[domain] = facetScores.reduce((sum, score) => sum + score, 0) / facetScores.length;
  });
  
  Object.entries(person2.scores).forEach(([domain, facets]) => {
    const facetScores = Object.values(facets);
    person2Averages[domain] = facetScores.reduce((sum, score) => sum + score, 0) / facetScores.length;
  });

  const strengths: string[] = [];
  const challenges: string[] = [];
  const workingTogether: string[] = [];
  const communicationTips: string[] = [];
  const conflictAreas: string[] = [];

  // Analyze each domain combination
  Object.keys(person1Averages).forEach(domain => {
    const score1 = person1Averages[domain];
    const score2 = person2Averages[domain];
    const diff = Math.abs(score1 - score2);
    
    // Similarity bonus (moderate differences are often good)
    if (diff < 3) {
      compatibilityScore += 5;
    } else if (diff > 8) {
      compatibilityScore -= 3;
    }
    
    // Domain-specific analysis
    analyzeDomainCompatibility(domain, score1, score2, strengths, challenges, workingTogether, communicationTips, conflictAreas);
  });

  // Ensure score is within bounds
  compatibilityScore = Math.max(0, Math.min(100, compatibilityScore));
  
  const level: 'low' | 'moderate' | 'high' = 
    compatibilityScore >= 75 ? 'high' : 
    compatibilityScore >= 50 ? 'moderate' : 'low';

  const description = getCompatibilityDescription(level, compatibilityScore);

  return {
    person1: person1.name,
    person2: person2.name,
    compatibilityScore: {
      score: compatibilityScore,
      level,
      description
    },
    strengths: strengths.slice(0, 4),
    challenges: challenges.slice(0, 3),
    workingTogether: workingTogether.slice(0, 4),
    communicationTips: communicationTips.slice(0, 3),
    conflictAreas: conflictAreas.slice(0, 3)
  };
}

function analyzeDomainCompatibility(
  domain: string, 
  score1: number, 
  score2: number, 
  strengths: string[], 
  challenges: string[], 
  workingTogether: string[], 
  communicationTips: string[], 
  conflictAreas: string[]
) {
  const level1 = getScoreLevel(score1);
  const level2 = getScoreLevel(score2);
  
  switch (domain) {
    case 'Extraversion':
      if (level1 === level2) {
        if (level1 === 'high') {
          strengths.push('Both energetic and socially motivated');
          workingTogether.push('Excel in collaborative, high-energy environments');
        } else if (level1 === 'low') {
          strengths.push('Both value depth and thoughtful communication');
          workingTogether.push('Work well in quiet, focused environments');
        }
      } else {
        challenges.push('Different social energy needs');
        communicationTips.push('Respect each other\'s social preferences');
        if ((level1 === 'high' && level2 === 'low') || (level1 === 'low' && level2 === 'high')) {
          workingTogether.push('Complement each other in social and analytical tasks');
        }
      }
      break;
      
    case 'Agreeableness':
      if (level1 === 'high' && level2 === 'high') {
        strengths.push('Both value harmony and cooperation');
        workingTogether.push('Create supportive, collaborative environments');
        challenges.push('May avoid necessary confrontation');
      } else if (level1 === 'low' && level2 === 'low') {
        strengths.push('Both comfortable with direct communication');
        workingTogether.push('Excel in competitive or challenging environments');
        conflictAreas.push('May escalate disagreements quickly');
      } else {
        workingTogether.push('Balance between harmony and necessary challenge');
        communicationTips.push('Find middle ground between directness and diplomacy');
      }
      break;
      
    case 'Conscientiousness':
      if (level1 === level2) {
        if (level1 === 'high') {
          strengths.push('Both organized and goal-oriented');
          workingTogether.push('Excel in structured, deadline-driven projects');
        } else if (level1 === 'low') {
          strengths.push('Both flexible and adaptable');
          workingTogether.push('Thrive in creative, flexible environments');
          challenges.push('May struggle with organization and deadlines');
        }
      } else {
        workingTogether.push('Balance structure with flexibility');
        if ((level1 === 'high' && level2 === 'low') || (level1 === 'low' && level2 === 'high')) {
          communicationTips.push('Respect different approaches to organization');
          conflictAreas.push('Different standards for structure and planning');
        }
      }
      break;
      
    case 'Neuroticism':
      if (level1 === 'low' && level2 === 'high') {
        strengths.push('Emotional stability complements sensitivity');
        workingTogether.push('One provides calm support, other brings emotional awareness');
        communicationTips.push('Be patient with different stress responses');
      } else if (level1 === 'high' && level2 === 'low') {
        strengths.push('Sensitivity complements emotional stability');
        workingTogether.push('Emotional awareness balanced with calm perspective');
      } else if (level1 === 'high' && level2 === 'high') {
        challenges.push('Both may be sensitive to stress');
        communicationTips.push('Practice stress management together');
      }
      break;
      
    case 'Openness To Experience':
      if (level1 === level2) {
        if (level1 === 'high') {
          strengths.push('Both creative and open to new ideas');
          workingTogether.push('Excel in innovative, creative projects');
        } else if (level1 === 'low') {
          strengths.push('Both value practical, proven approaches');
          workingTogether.push('Focus on reliable, established methods');
        }
      } else {
        workingTogether.push('Balance innovation with practical implementation');
        communicationTips.push('Appreciate different approaches to change and creativity');
      }
      break;
  }
}

function getCompatibilityDescription(level: 'low' | 'moderate' | 'high', score: number): string {
  switch (level) {
    case 'high':
      return `Excellent compatibility (${score}%). Your personalities complement each other very well, with natural understanding and shared approaches to many situations.`;
    case 'moderate':
      return `Good compatibility (${score}%). You have a solid foundation for working together, with some differences that can be managed through understanding and communication.`;
    case 'low':
      return `Challenging compatibility (${score}%). Significant personality differences require extra effort, understanding, and communication to work together effectively.`;
  }
}