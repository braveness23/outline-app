import LoadedImage from "@/components/image/LoadedImage";
import { getDictionary } from "../dictionaries";
import InputField from "@/components/Field";
import DetailsForm from "@/components/details/DetailsForm";

export default async function Details() {
  const dictionary = await getDictionary("en");

  return (
    <main className="flex min-h-full flex-col items-center justify-between p-4">
      <div className="z-10 w-full max-w-5xl items-center justify-between mt-2">
        <h1 className="text-center p-2">Details</h1>
        <DetailsForm dictionary={dictionary}></DetailsForm>
        <LoadedImage></LoadedImage>
      </div>
    </main>
  );
}
