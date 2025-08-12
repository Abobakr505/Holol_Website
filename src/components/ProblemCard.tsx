import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CommentSection } from "@/components/CommentSection";
import { MessageSquare, Clock, Send, Flag, MessageCircle } from "lucide-react";
import { Problem } from "@/pages/Index";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { supabase } from '@/lib/supabase'; // تأكد من تعديل المسار حسب مشروعك

interface ProblemCardProps {
  problem: Problem;
  onAddComment: (problemId: string, comment: string) => void;
  onVoteComment: (problemId: string, commentId: string, isHelpful: boolean) => void;
  isCommentSubmitting?: boolean;
}

export const ProblemCard = ({
  problem,
  onAddComment,
  onVoteComment,
  isCommentSubmitting = false,
}: ProblemCardProps) => {
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");

  const reportReasons = [
    "محتوى غير لائق",
    "معلومات مضللة",
    "انتهاك حقوق الملكية",
    "سلوك مسيء",
    "أخرى",
  ];

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(problem.id, newComment.trim());
      setNewComment("");
    }
  };

  const handleReportProblem = async () => {
    if (selectedReason) {
      const { data, error } = await supabase
        .from('problem_reports')
        .insert([
          { problem_id: problem.id, reason: selectedReason }
        ]);
      if (error) {
        console.error('خطأ في الإبلاغ عن المشكلة:', error);
      } else {
        console.log('تم الإبلاغ عن المشكلة بنجاح');
        setIsReportModalOpen(false);
        setSelectedReason("");
      }
    }
  };

  const handleReportComment = async (commentId: string) => {
    const { data, error } = await supabase
      .from('comment_reports')
      .insert([
        { problem_id: problem.id, comment_id: commentId }
      ]);
    if (error) {
      console.error('خطأ في الإبلاغ عن التعليق:', error);
    } else {
      console.log('تم الإبلاغ عن التعليق بنجاح');
    }
  };

  // تحويل التاريخ إلى صيغة مناسبة
  const formattedDate = problem.created_at
    ? problem.timestamp ||
      `منذ ${Math.floor(
        (Date.now() - new Date(problem.created_at).getTime()) / (1000 * 60 * 60)
      )} ساعة`
    : "الآن";

  return (
    <>
      <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-xl border-0 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-blue-500 to-green-400"></div>
        <CardHeader className="pb-4 pt-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800 mb-2 leading-relaxed text-right">
                {problem.title}
              </h3>
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:bg-red-50 px-2 py-1 h-8"
                  onClick={() => setIsReportModalOpen(true)}
                >
                  <Flag className="h-3 w-3 ml-1" />
                  <span className="text-xs">إبلاغ</span>
                </Button>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 ml-1" />
                  <span>{formattedDate}</span>
                </div>
              </div>
            </div>
            <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-full shadow-lg rotate-3 transform hover:rotate-6 transition-transform duration-300 mr-3">
              <MessageSquare className="h-5 w-5 text-white" />
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {problem.comments.length}
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-gray-700 leading-relaxed text-right bg-gray-50 p-4 rounded-lg border-r-4 border-blue-200">
            {problem.description}
          </p>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant={showComments ? "secondary" : "ghost"}
                onClick={() => setShowComments(!showComments)}
                className={`text-blue-600 hover:text-blue-700 hover:bg-blue-50 ${
                  showComments ? "bg-blue-50" : ""
                }`}
              >
                <MessageCircle className="h-4 w-4 ml-1" />
                {showComments
                  ? "إخفاء التعليقات"
                  : `${problem.comments.length || "0"} تعليق`}
              </Button>
            </div>

            <div className="flex gap-2 mb-4">
              <Textarea
                placeholder="اكتب تعليقاً مفيداً..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="resize-none text-right border-gray-200 focus:border-blue-500 transition-all rounded-lg"
                rows={2}
              />
              <Button
                onClick={handleAddComment}
                disabled={!newComment.trim() || isCommentSubmitting}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-4 py-2 shrink-0 rounded-lg h-auto"
              >
                {isCommentSubmitting ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            {showComments && (
              <CommentSection
                comments={problem.comments}
                onVoteComment={(commentId, isHelpful) => onVoteComment(problem.id, commentId, isHelpful)}
                onReportComment={handleReportComment}
              />
            )}
          </div>
        </CardContent>
      </Card>

      <Transition appear show={isReportModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsReportModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-right align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    إبلاغ عن المشكلة
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      يرجى اختيار سبب الإبلاغ:
                    </p>
                    <div className="mt-4 space-y-2">
                      {reportReasons.map((reason) => (
                        <div key={reason} className="flex items-center">
                          <input
                            type="radio"
                            id={reason}
                            name="report-reason"
                            value={reason}
                            checked={selectedReason === reason}
                            onChange={(e) => setSelectedReason(e.target.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <label
                            htmlFor={reason}
                            className="mr-2 text-sm text-gray-700"
                          >
                            {reason}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => setIsReportModalOpen(false)}
                      className="text-gray-500 hover:bg-gray-100"
                    >
                      إلغاء
                    </Button>
                    <Button
                      onClick={handleReportProblem}
                      disabled={!selectedReason}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                    >
                      إرسال
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};