import ModulePage from '@/components/ModulePage';

export default function SentenceAnalysisPage() {
  return (
    <ModulePage
      moduleType="sentenceAnalysis"
      moduleTitle="句子成分分析"
      dataFile="sentence_analysis_data.json"
    />
  );
}
