import ModulePage from '@/components/ModulePage';

export default function EdSpellingPage() {
  return (
    <ModulePage
      moduleType="edSpelling"
      moduleTitle="-ed读音及拼写"
      dataFile="ed_spelling_data.json"
    />
  );
}
