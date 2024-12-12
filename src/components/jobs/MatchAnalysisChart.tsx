import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface AnalysisData {
  skill_match_score: number;
  experience_match_score: number;
  education_match_score: number;
  overall_match_score: number;
  matching_skills: string[];
  missing_skills: string[];
  recommendations: string;
  analysis_summary: string;
}

interface MatchAnalysisChartProps {
  data: AnalysisData;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return "bg-green-100 text-green-800 border-green-300";
  if (score >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-300";
  return "bg-red-100 text-red-800 border-red-300";
};

const getScoreLabel = (score: number) => {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  return "Needs Improvement";
};

export function MatchAnalysisChart({ data }: MatchAnalysisChartProps) {
  const chartData = [
    { category: "Skills Match", score: data.skill_match_score },
    { category: "Experience Match", score: data.experience_match_score },
    { category: "Education Match", score: data.education_match_score },
    { category: "Overall Match", score: data.overall_match_score },
  ];

  // Updated base card style - we'll replace 'bg-white rounded-lg p-6 shadow-sm'
  const cardStyle =
    "bg-white rounded-xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300";

  return (
    <div className='space-y-6'>
      {/* Score Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        {[
          { label: "Skills Match", score: data.skill_match_score },
          { label: "Experience Match", score: data.experience_match_score },
          { label: "Education Match", score: data.education_match_score },
          { label: "Overall Match", score: data.overall_match_score },
        ].map((item) => (
          <div
            key={item.label}
            className={`p-4 rounded-lg border ${getScoreColor(
              item.score
            )} transition-all duration-200`}
          >
            <div className='text-sm font-medium'>{item.label}</div>
            <div className='mt-1 flex items-baseline justify-between'>
              <div className='text-2xl font-semibold'>{item.score}%</div>
              <div className='text-sm font-medium'>
                {getScoreLabel(item.score)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Radar Chart - Updated styling */}
      <div className={`${cardStyle} backdrop-blur-sm bg-white/50`}>
        <ResponsiveContainer width='100%' height={400}>
          <RadarChart cx='50%' cy='50%' outerRadius='80%' data={chartData}>
            <PolarGrid stroke='#e5e7eb' />
            <PolarAngleAxis
              dataKey='category'
              tick={{ fill: "#4b5563", fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "#4b5563", fontSize: 12 }}
            />
            <Radar
              name='Match Score'
              dataKey='score'
              stroke='#2563eb'
              fill='#3b82f6'
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Skills Analysis - Updated styling */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Matching Skills */}
        <div className={`${cardStyle} hover:border-green-100`}>
          <div className='flex items-center gap-2 mb-4'>
            <div className='w-3 h-3 rounded-full bg-green-500'></div>
            <h3 className='text-lg font-semibold'>Matching Skills</h3>
          </div>
          {data.matching_skills.length > 0 ? (
            <div className='flex flex-wrap gap-2'>
              {data.matching_skills.map((skill, index) => (
                <span
                  key={index}
                  className='px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm'
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className='text-gray-500 italic'>No matching skills found</p>
          )}
        </div>

        {/* Missing Skills */}
        <div className={`${cardStyle} hover:border-red-100`}>
          <div className='flex items-center gap-2 mb-4'>
            <div className='w-3 h-3 rounded-full bg-red-500'></div>
            <h3 className='text-lg font-semibold'>Missing Skills</h3>
          </div>
          <div className='flex flex-wrap gap-2'>
            {data.missing_skills.map((skill, index) => (
              <span
                key={index}
                className='px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm'
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis Details - Updated styling */}
      <div className='space-y-6'>
        {/* Recommendations */}
        <div className={`${cardStyle} hover:border-blue-100`}>
          <h3 className='text-lg font-semibold mb-3 text-gray-800'>
            Recommendations
          </h3>
          <p className='text-gray-600 leading-relaxed'>
            {data.recommendations}
          </p>
        </div>

        {/* Analysis Summary */}
        <div className={`${cardStyle} hover:border-blue-100`}>
          <h3 className='text-lg font-semibold mb-3 text-gray-800'>
            Analysis Summary
          </h3>
          <p className='text-gray-600 leading-relaxed'>
            {data.analysis_summary}
          </p>
        </div>
      </div>
    </div>
  );
}
