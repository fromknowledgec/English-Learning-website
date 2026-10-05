import ModulePage from '@/components/ModulePage';

export default function IrregularVerbsPage() {
  return (
    <ModulePage
      moduleType="irregularVerbs"
      moduleTitle="不规则动词变化考查"
      dataFile="irregular_verbs_data.json"
    />
  );
}
