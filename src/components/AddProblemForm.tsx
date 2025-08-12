import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X, Send, HelpCircle, ShieldCheck } from "lucide-react";

interface AddProblemFormProps {
  onSubmit: (title: string, description: string) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const AddProblemForm = ({ onSubmit, onCancel, isSubmitting = false }: AddProblemFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      onSubmit(title.trim(), description.trim());
      setTitle("");
      setDescription("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all duration-300 scale-100 hover:scale-105">
        <div className="h-1 bg-gradient-to-r from-indigo-500 to-teal-500 rounded-t-2xl"></div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 text-right">شارك مشكلتك</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-sm text-gray-600 flex items-center justify-end mb-6">
          <ShieldCheck className="h-4 w-4 ml-1 text-teal-500" />
          جميع المشاركات مجهولة تماماً
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-right flex items-center text-gray-700 font-medium">
              <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
              عنوان المشكلة
            </Label>
            <Input
              id="title"
              placeholder="اكتب عنواناً مختصراً..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-right border-gray-200 focus:ring-2 focus:ring-indigo-300 rounded-lg"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-right flex items-center text-gray-700 font-medium">
              <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
              تفاصيل المشكلة
            </Label>
            <Textarea
              id="description"
              placeholder="اشرح مشكلتك بالتفصيل..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="text-right border-gray-200 focus:ring-2 focus:ring-indigo-300 rounded-lg"
              required
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              type="submit"
              disabled={!title.trim() || !description.trim() || isSubmitting}
              className="bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-700 hover:to-teal-700 text-white rounded-lg px-6"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div>
              ) : (
                <Send className="h-5 w-5 ml-2" />
              )}
              نشر
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg px-6"
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};