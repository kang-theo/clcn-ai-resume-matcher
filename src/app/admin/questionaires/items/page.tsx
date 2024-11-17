import QuestionaireList from "@/components/questionaires";

export default function QuestionaireItemsPage() {
  return (
    <div>
      <QuestionaireList title='' url='/api/admin/questionaires' />
    </div>
  );
}
