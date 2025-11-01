// Big Five Research Documentation and Insights
// Based on established psychological research and scientific literature

export interface ResearchInsight {
  domain?: string;
  researchFindings: string[];
  citations: string[];
  practicalApplications: string[];
  developmentStrategies: string[];
}

export const BIG_FIVE_RESEARCH: { [domain: string]: ResearchInsight } = {
  'Extraversion': {
    researchFindings: [
      'Extraverts show greater activation in the anterior cingulate cortex and temporal lobes when processing social information (Canli et al., 2001)',
      'High extraversion is associated with higher levels of positive affect and life satisfaction (Lucas & Fujita, 2000)',
      'Extraverts perform better in jobs requiring social interaction and leadership roles (Barrick & Mount, 1991)',
      'Extraversion correlates with larger social networks and more frequent social interactions (Asendorpf & Wilpers, 1998)',
      'Extraverts show better recovery from negative emotional events (Larsen & Ketelaar, 1991)'
    ],
    citations: [
      'Canli, T., et al. (2001). An fMRI study of personality influences on brain reactivity to emotional stimuli. Behavioral Neuroscience, 115(1), 33-42.',
      'Lucas, R. E., & Fujita, F. (2000). Factors influencing the relation between extraversion and pleasant affect. Journal of Personality and Social Psychology, 79(6), 1039-1056.',
      'Barrick, M. R., & Mount, M. K. (1991). The big five personality dimensions and job performance: A meta-analysis. Personnel Psychology, 44(1), 1-26.',
      'Asendorpf, J. B., & Wilpers, S. (1998). Personality effects on social relationships. Journal of Personality and Social Psychology, 74(6), 1531-1544.'
    ],
    practicalApplications: [
      'Team leadership roles and public speaking opportunities',
      'Customer-facing positions and sales roles',
      'Networking and relationship building activities',
      'Group brainstorming and collaborative projects',
      'Training and mentoring positions'
    ],
    developmentStrategies: [
      'For introverts: Practice small group interactions before large gatherings',
      'For introverts: Develop written communication skills as an alternative to verbal presentation',
      'For extraverts: Learn to listen actively and allow others to contribute',
      'For extraverts: Practice independent work and reflection time',
      'Both: Understand and respect different energy sources and communication styles'
    ]
  },
  'Agreeableness': {
    researchFindings: [
      'High agreeableness is associated with better relationship satisfaction and longevity (Donnellan et al., 2004)',
      'Agreeable individuals show greater empathy and prosocial behavior (Graziano & Eisenberg, 1997)',
      'Lower agreeableness may be advantageous in competitive environments and negotiation (Barry & Friedman, 1998)',
      'Agreeableness correlates with better team performance and cooperation (Mount et al., 1998)',
      'High agreeableness individuals are more likely to forgive and maintain social harmony (McCullough & Hoyt, 2002)'
    ],
    citations: [
      'Donnellan, M. B., et al. (2004). The mini-IPIP scales: Tiny-yet-effective measures of the Big Five factors of personality. Psychological Assessment, 16(2), 192-203.',
      'Graziano, W. G., & Eisenberg, N. (1997). Agreeableness: A dimension of personality. In Handbook of personality psychology (pp. 795-824).',
      'Barry, B., & Friedman, R. A. (1998). Bargainer characteristics in distributive and integrative negotiation. Journal of Personality and Social Psychology, 74(2), 345-359.',
      'Mount, M. K., et al. (1998). Five-factor model of personality and performance in jobs involving interpersonal interactions. Human Performance, 11(2-3), 145-165.'
    ],
    practicalApplications: [
      'Conflict resolution and mediation roles',
      'Customer service and support positions',
      'Healthcare and counseling professions',
      'Team collaboration and group projects',
      'Community outreach and social work'
    ],
    developmentStrategies: [
      'For low agreeableness: Practice perspective-taking and empathy exercises',
      'For low agreeableness: Learn collaborative negotiation techniques',
      'For high agreeableness: Develop assertiveness and boundary-setting skills',
      'For high agreeableness: Practice constructive confrontation when necessary',
      'Both: Balance cooperation with healthy self-advocacy'
    ]
  },
  'Conscientiousness': {
    researchFindings: [
      'Conscientiousness is the strongest predictor of job performance across all occupations (Barrick & Mount, 1991)',
      'High conscientiousness is associated with better health outcomes and longevity (Bogg & Roberts, 2004)',
      'Conscientious individuals show better academic performance and goal achievement (Noftle & Robins, 2007)',
      'Conscientiousness correlates with better financial management and decision-making (Donnelly et al., 2012)',
      'High conscientiousness individuals are more likely to engage in health-promoting behaviors (Bogg & Roberts, 2004)'
    ],
    citations: [
      'Barrick, M. R., & Mount, M. K. (1991). The big five personality dimensions and job performance: A meta-analysis. Personnel Psychology, 44(1), 1-26.',
      'Bogg, T., & Roberts, B. W. (2004). Conscientiousness and health-related behaviors: A meta-analysis of the leading behavioral contributors to mortality. Psychological Bulletin, 130(6), 887-919.',
      'Noftle, E. E., & Robins, R. W. (2007). Personality predictors of academic outcomes: Big five correlates of GPA and SAT scores. Journal of Personality and Social Psychology, 93(1), 116-130.',
      'Donnelly, G., et al. (2012). The big five and spending behavior. Psychological Science, 23(12), 1519-1528.'
    ],
    practicalApplications: [
      'Project management and planning roles',
      'Quality assurance and detail-oriented positions',
      'Financial management and accounting roles',
      'Research and analytical positions',
      'Administrative and organizational roles'
    ],
    developmentStrategies: [
      'For low conscientiousness: Use external organization systems and reminders',
      'For low conscientiousness: Break large goals into smaller, manageable tasks',
      'For high conscientiousness: Practice flexibility and adaptability',
      'For high conscientiousness: Learn to delegate and trust others',
      'Both: Balance structure with spontaneity and creativity'
    ]
  },
  'Neuroticism': {
    researchFindings: [
      'High neuroticism is associated with increased risk of anxiety and depression (Lahey, 2009)',
      'Neurotic individuals show greater stress reactivity and slower recovery (Bolger & Zuckerman, 1995)',
      'Low neuroticism (emotional stability) correlates with better leadership performance and stress management (Judge et al., 2002)',
      'Neuroticism affects interpersonal relationships and social support seeking (Suls et al., 1998)',
      'High neuroticism individuals may be more sensitive to environmental threats and changes (Ormel et al., 2013)'
    ],
    citations: [
      'Lahey, B. B. (2009). Public health significance of neuroticism. American Psychologist, 64(4), 241-256.',
      'Bolger, N., & Zuckerman, A. (1995). A framework for studying personality in the stress process. Journal of Personality and Social Psychology, 69(5), 890-902.',
      'Judge, T. A., et al. (2002). Five-factor model of personality and transformational leadership. Journal of Applied Psychology, 87(4), 751-765.',
      'Ormel, J., et al. (2013). Neuroticism and common mental disorders: Meaning and utility of a complex relationship. Clinical Psychology Review, 33(5), 686-697.'
    ],
    practicalApplications: [
      'Creative and artistic pursuits (high neuroticism)',
      'Crisis management and emergency response (low neuroticism)',
      'Therapeutic and counseling roles (moderate neuroticism)',
      'High-pressure decision making (low neuroticism)',
      'Detailed analysis and quality control (high neuroticism for attention to problems)'
    ],
    developmentStrategies: [
      'For high neuroticism: Develop stress management and mindfulness techniques',
      'For high neuroticism: Build emotional regulation skills and coping strategies',
      'For low neuroticism: Develop empathy for others emotional experiences',
      'For low neuroticism: Learn to recognize and respond to emotional cues in others',
      'Both: Practice emotional intelligence and self-awareness'
    ]
  },
  'Openness To Experience': {
    researchFindings: [
      'High openness is associated with creativity, artistic interests, and intellectual curiosity (McCrae, 1987)',
      'Open individuals show greater cognitive flexibility and problem-solving ability (LePine et al., 2000)',
      'Openness correlates with better performance in training and learning new skills (Barrick & Mount, 1991)',
      'High openness individuals are more likely to engage in cultural and educational activities (McCrae & Sutin, 2009)',
      'Openness is linked to political liberalism and tolerance for diversity (Jost et al., 2003)'
    ],
    citations: [
      'McCrae, R. R. (1987). Creativity, divergent thinking, and openness to experience. Journal of Personality and Social Psychology, 52(6), 1258-1265.',
      'LePine, J. A., et al. (2000). Adaptability to changing task contexts: Effects of general cognitive ability, conscientiousness, and openness to experience. Personnel Psychology, 53(3), 563-593.',
      'McCrae, R. R., & Sutin, A. R. (2009). Openness to experience. In Handbook of individual differences in social behavior (pp. 257-273).',
      'Jost, J. T., et al. (2003). Political conservatism as motivated social cognition. Psychological Bulletin, 129(3), 339-375.'
    ],
    practicalApplications: [
      'Research and development roles',
      'Creative and artistic professions',
      'Innovation and strategic planning',
      'Training and educational positions',
      'Cross-cultural and international work'
    ],
    developmentStrategies: [
      'For low openness: Gradually expose yourself to new experiences and perspectives',
      'For low openness: Practice considering alternative viewpoints and solutions',
      'For high openness: Develop practical implementation skills to execute creative ideas',
      'For high openness: Learn to focus and follow through on projects to completion',
      'Both: Balance innovation with practical considerations and implementation'
    ]
  }
};

export function getResearchInsight(domain: string): ResearchInsight | null {
  return BIG_FIVE_RESEARCH[domain] || null;
}

export function getAllResearchInsights(): ResearchInsight[] {
  return Object.values(BIG_FIVE_RESEARCH);
}

export const GENERAL_BIG_FIVE_RESEARCH = {
  overview: [
    'The Big Five model is the most widely accepted and researched personality framework in psychology',
    'Meta-analyses consistently show the Big Five dimensions predict important life outcomes including job performance, relationship satisfaction, and health behaviors',
    'The model demonstrates cross-cultural validity and has been replicated across different languages and cultures',
    'Personality traits show moderate heritability (approximately 40-60%) and remain relatively stable across the lifespan while allowing for some change',
    'The Big Five dimensions are independent factors, meaning individuals can score high or low on any combination of traits'
  ],
  keyFindings: [
    'Conscientiousness is the strongest predictor of job performance across all occupations and career levels',
    'The combination of high emotional stability (low neuroticism) and high extraversion predicts leadership effectiveness',
    'Agreeableness and conscientiousness together predict better team performance and relationship satisfaction',
    'Openness to experience is crucial for performance in jobs requiring creativity, learning, and adaptation to change',
    'Personality-job fit (matching personality traits to job requirements) significantly improves job satisfaction and performance'
  ],
  applications: [
    'Personnel selection and recruitment - matching candidates to role requirements',
    'Career counseling and development - identifying suitable career paths and development areas',
    'Team composition - creating balanced teams with complementary personality strengths',
    'Leadership development - identifying leadership potential and development needs',
    'Relationship counseling - understanding compatibility and communication patterns',
    'Personal development - self-awareness and targeted skill building'
  ],
  limitations: [
    'Personality is just one factor among many that influence behavior and performance',
    'Cultural context and situational factors can modify how personality traits are expressed',
    'Individual differences within trait levels can be significant - not all high extraverts are identical',
    'Personality can change over time, especially in response to major life events or deliberate development efforts',
    'The Big Five may not capture all important aspects of personality and individual differences'
  ]
};

export function getPersonalityDevelopmentPlan(domains: { [domain: string]: { level: 'low' | 'moderate' | 'high', score: number } }): {
  strengths: string[];
  developmentAreas: string[];
  actionPlan: string[];
  researchBasis: string[];
} {
  const strengths: string[] = [];
  const developmentAreas: string[] = [];
  const actionPlan: string[] = [];
  const researchBasis: string[] = [];

  Object.entries(domains).forEach(([domain, analysis]) => {
    const research = getResearchInsight(domain);
    if (!research) return;

    // Add research basis
    researchBasis.push(`${domain}: ${research.researchFindings[0]}`);

    // Add relevant development strategies
    const relevantStrategies = research.developmentStrategies.filter(strategy => {
      if (analysis.level === 'high') {
        return strategy.includes('high') || strategy.includes('For high') || strategy.includes('Both');
      } else if (analysis.level === 'low') {
        return strategy.includes('low') || strategy.includes('For low') || strategy.includes('Both');
      } else {
        return strategy.includes('Both') || !strategy.includes('For');
      }
    });

    actionPlan.push(...relevantStrategies.slice(0, 2));

    // Identify strengths and development areas based on research
    if (analysis.level === 'high') {
      if (domain === 'Conscientiousness' || domain === 'Agreeableness') {
        strengths.push(`Strong ${domain.toLowerCase()} supports excellent ${research.practicalApplications[0].toLowerCase()}`);
      }
    } else if (analysis.level === 'low') {
      developmentAreas.push(`Developing ${domain.toLowerCase()} could improve ${research.practicalApplications[0].toLowerCase()}`);
    }
  });

  return {
    strengths: strengths.slice(0, 4),
    developmentAreas: developmentAreas.slice(0, 3),
    actionPlan: actionPlan.slice(0, 6),
    researchBasis: researchBasis.slice(0, 5)
  };
}