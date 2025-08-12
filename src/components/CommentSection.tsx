import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Clock, Users, Flag, ThumbsUp, ThumbsDown, Award } from "lucide-react";
import { Comment } from "@/pages/Index";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { supabase } from '@/lib/supabase';

interface CommentSectionProps {
  comments: Comment[];
  onVoteComment: (commentId: string, isHelpful: boolean) => void;
  onReportComment: (commentId: string) => void;
}

export const CommentSection = ({ comments, onVoteComment, onReportComment }: CommentSectionProps) => {
  const [votedComments, setVotedComments] = useState<Record<string, boolean>>({});
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);

  const reportReasons = [
    "محتوى غير لائق",
    "معلومات مضللة",
    "انتهاك حقوق الملكية",
    "سلوك مسيء",
    "أخرى",
  ];

  const handleVote = (commentId: string, isHelpful: boolean) => {
    if (votedComments[commentId] !== undefined) {
      toast.error("لقد قمت بالتصويت بالفعل على هذا التعليق");
      return;
    }
    
    setVotedComments((prev) => ({
      ...prev,
      [commentId]: isHelpful,
    }));
    
    onVoteComment(commentId, isHelpful);
  };

  const handleReport = async (commentId: string) => {
    setSelectedCommentId(commentId);
    setIsReportModalOpen(true);
  };

  const handleSubmitReport = async () => {
    if (selectedCommentId && selectedReason) {
      const { data, error } = await supabase
        .from('comment_reports')
        .insert([
          { comment_id: selectedCommentId, reason: selectedReason }
        ]);
      if (error) {
        console.error('خطأ في الإبلاغ عن التعليق:', error);
        toast.error("فشل في إرسال الإبلاغ");
      } else {
        onReportComment(selectedCommentId);
        toast.success('تم الإبلاغ عن التعليق بنجاح');
        setIsReportModalOpen(false);
        setSelectedReason("");
        setSelectedCommentId(null);
      }
    }
  };

  // تحويل التاريخ إلى صيغة مناسبة
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      
      if (isNaN(date.getTime())) {
        return dateStr;
      }
      
      if (diffMins < 60) {
        return `منذ ${diffMins} دقيقة`;
      } else if (diffHours < 24) {
        return `منذ ${diffHours} ساعة`;
      } else {
        return date.toLocaleDateString('ar-EG');
      }
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateStr;
    }
  };

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
        <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>لا توجد تعليقات بعد</p>
        <p className="text-sm">كن أول من يقدم المساعدة</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-4 space-y-4">
        <h4 className="font-semibold text-gray-700 text-right flex items-center">
          <Users className="h-4 w-4 ml-2" />
          التعليقات والنصائح:
        </h4>
        
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-50">
          {comments.map((comment) => (
            <Card 
              key={comment.id} 
              className={`
                bg-gradient-to-r ${comment.is_helpful ? 'from-green-50 to-white border-l-green-500' : 'from-blue-50 to-white border-l-blue-300'} 
                border-l-4 p-4 hover:shadow-md transition-all duration-200
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-700 text-right leading-relaxed mb-3 whitespace-pre-wrap">
                    {comment.text}
                  </p>
                  <div className="flex flex-wrap items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500 mt-2">
                      <Clock className="h-3 w-3 ml-1" />
                      <span>{formatDate(comment.created_at)}</span>
                      {comment.is_helpful && (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs mr-2 flex items-center">
                          <Award className="h-3 w-3 ml-1" />
                          نصيحة مفيدة
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 mt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`h-8 px-2 text-xs ${
                          votedComments[comment.id] === true 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'border-green-200 text-green-700 hover:bg-green-50'
                        }`}
                        onClick={() => handleVote(comment.id, true)}
                        disabled={votedComments[comment.id] !== undefined}
                      >
                        <ThumbsUp className="h-3 w-3 ml-1" />
                        أفادني
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`h-8 px-2 text-xs ${
                          votedComments[comment.id] === false 
                            ? 'bg-gray-100 text-gray-700 border-gray-300' 
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => handleVote(comment.id, false)}
                        disabled={votedComments[comment.id] !== undefined}
                      >
                        <ThumbsDown className="h-3 w-3 ml-1" />
                        لم يفدني
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2 text-xs text-red-500 hover:bg-red-50"
                        onClick={() => handleReport(comment.id)}
                      >
                        <Flag className="h-3 w-3 ml-1" />
                        إبلاغ
                      </Button>
                    </div>
                  </div>
                </div>
                <div className={`${comment.is_helpful ? 'bg-green-100' : 'bg-blue-100'} p-2 rounded-full shrink-0 mr-3 transform rotate-12`}>
                  <Users className={`h-4 w-4 ${comment.is_helpful ? 'text-green-600' : 'text-blue-600'}`} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Transition appear show={isReportModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            setIsReportModalOpen(false);
            setSelectedReason("");
            setSelectedCommentId(null);
          }}
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
                    إبلاغ عن التعليق
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
                      onClick={() => {
                        setIsReportModalOpen(false);
                        setSelectedReason("");
                        setSelectedCommentId(null);
                      }}
                      className="text-gray-500 hover:bg-gray-100"
                    >
                      إلغاء
                    </Button>
                    <Button
                      onClick={handleSubmitReport}
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