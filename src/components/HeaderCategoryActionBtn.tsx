import { HeaderAddCategoryDialog } from "./HeaderAddCategoryDialog";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

export default function HeaderCategoryActionBtn({
  data,
  addCategory,
}: {
  data: any;
  addCategory: any;
}) {
  return (
    <section className="mb-5 flex justify-between items-center">
      <div className="space-x-2">
        <HeaderAddCategoryDialog data={data} addCategory={addCategory}>
          <Button>
            <Plus className="w-5 h-5 mr-2" />
            Add Category
          </Button>
        </HeaderAddCategoryDialog>
      </div>
    </section>
  );
}
