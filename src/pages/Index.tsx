
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ProblemCard } from "@/components/ProblemCard";
import { AddProblemForm } from "@/components/AddProblemForm";
import { Button } from "@/components/ui/button";
import { Plus, Search, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RandomTipButton } from "@/components/RandomTipButton";

export interface Problem {
  id: string;
  title: string;
  description: string;
  created_at: string;
  comments: Comment[];
}

export interface Comment {
  id: string;
  text: string;
  created_at: string;
  is_helpful?: boolean;
}

const fetchProblems = async () => {
  const { data: problems, error } = await supabase
    .from('problems')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching problems:', error);
    throw new Error('فشل في جلب المشكلات');
  }

  const problemsWithComments = await Promise.all(
    problems.map(async (problem) => {
      const { data: comments, error: commentsError } = await supabase
        .from('comments')
        .select('*')
        .eq('problem_id', problem.id)
        .order('created_at', { ascending: true });

      if (commentsError) {
        console.error('Error fetching comments:', commentsError);
      }

      return {
        ...problem,
        comments: comments || [],
        // تنسيق التاريخ بطريقة مناسبة للغة العربية
        timestamp: new Intl.RelativeTimeFormat('ar', { numeric: 'auto' }).format(
          -Math.round((Date.now() - new Date(problem.created_at).getTime()) / (1000 * 60 * 60)),
          'hour'
        ).replace(/\d+/, (num) => {
          // تحويل الأرقام للأرقام العربية
          return num.replace(/[0-9]/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
        })
      };
    })
  );

  return problemsWithComments;
};

const Index = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  // استخدام React Query لجلب البيانات
  const {
    data: problems = [],
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['problems'],
    queryFn: fetchProblems,
  });

  // إضافة مشكلة جديدة
  const addProblemMutation = useMutation({
    mutationFn: async ({ title, description }: { title: string; description: string }) => {
      const { data, error } = await supabase
        .from('problems')
        .insert([{ title, description }])
        .select();

      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] });
      toast.success("تمت إضافة المشكلة بنجاح");
      setShowAddForm(false);
    },
    onError: (error) => {
      console.error("خطأ في إضافة المشكلة:", error);
      toast.error("فشل في إضافة المشكلة");
    }
  });

  // إضافة تعليق
  const addCommentMutation = useMutation({
    mutationFn: async ({ problemId, text }: { problemId: string; text: string }) => {
      const { data, error } = await supabase
        .from('comments')
        .insert([{ problem_id: problemId, text }])
        .select();

      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] });
      toast.success("تم إضافة تعليقك بنجاح");
    },
    onError: (error) => {
      console.error("خطأ في إضافة التعليق:", error);
      toast.error("فشل في إضافة التعليق");
    }
  });

  // تصويت على تعليق
  const voteCommentMutation = useMutation({
    mutationFn: async ({ commentId, isHelpful }: { commentId: string; isHelpful: boolean }) => {
      const { data, error } = await supabase
        .from('comments')
        .update({ is_helpful: isHelpful })
        .eq('id', commentId)
        .select();

      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problems'] });
      toast.success("شكراً لتقييمك");
    },
    onError: (error) => {
      console.error("خطأ في تقييم التعليق:", error);
      toast.error("فشل في تقييم التعليق");
    }
  });

  const addProblem = (title: string, description: string) => {
    addProblemMutation.mutate({ title, description });
  };

  const addComment = (problemId: string, commentText: string) => {
    addCommentMutation.mutate({ problemId, text: commentText });
  };

  const voteComment = (problemId: string, commentId: string, isHelpful: boolean) => {
    voteCommentMutation.mutate({ commentId, isHelpful });
  };

  const reportProblem = (problemId: string) => {
    console.log(`تم الإبلاغ عن المشكلة رقم: ${problemId}`);
    toast.success("تم إرسال البلاغ بنجاح، سيتم مراجعته قريباً");
    // هنا يمكن إضافة منطق لإرسال البلاغ للخادم
  };

  const reportComment = (problemId: string, commentId: string) => {
    console.log(`تم الإبلاغ عن التعليق رقم: ${commentId} في المشكلة رقم: ${problemId}`);
    toast.success("تم إرسال البلاغ بنجاح، سيتم مراجعته قريباً");
    // هنا يمكن إضافة منطق لإرسال البلاغ للخادم
  };

  const filteredProblems = problems.filter(problem =>
    problem.title.includes(searchTerm) || problem.description.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      <div className="mb-6 flex justify-end ">
        <RandomTipButton />
      </div>
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
            شارك مشكلتك بأمان
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
              واحصل على الدعم
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            مساحة آمنة ومجهولة لمشاركة المشاكل والحصول على المساعدة من المجتمع
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3 text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 w-full sm:w-auto"
            >
              <Plus className="ml-2 h-5 w-5" />
              أضف مشكلة جديدة
            </Button>
            
            <Button 
              onClick={() => refetch()}
              className="bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 px-8 py-3 text-lg rounded-full shadow-md w-full sm:w-auto"
              disabled={isLoading}
            >
              <RefreshCw className={`ml-2 h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              تحديث القائمة
            </Button>
          </div>
          
          <div className="relative max-w-xl mx-auto mb-8">
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-500" />
            <Input 
              type="text" 
              placeholder="ابحث عن مشكلة..." 
              className="pr-10 text-right rounded-full border-gray-200 focus:border-blue-400 bg-white/80 backdrop-blur-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {showAddForm && (
          <div className="mb-8 animate-fade-in">
            <AddProblemForm 
              onSubmit={addProblem}
              onCancel={() => setShowAddForm(false)}
              isSubmitting={addProblemMutation.isPending}
            />
          </div>
        )}

        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-16 animate-pulse">
              <div className="h-24 w-24 rounded-full bg-gradient-to-r from-blue-300 to-green-300 mx-auto mb-6"></div>
              <div className="h-8 bg-gray-200 rounded-lg max-w-md mx-auto mb-4"></div>
              <div className="h-4 bg-gray-100 rounded-lg max-w-sm mx-auto"></div>
            </div>
          ) : isError ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">😢</div>
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">
                حدث خطأ في جلب البيانات
              </h3>
              <Button onClick={() => refetch()} className="mt-4">
                <RefreshCw className="ml-2 h-4 w-4" />
                حاول مرة أخرى
              </Button>
            </div>
          ) : filteredProblems.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <div className="text-6xl mb-4 animate-float">💭</div>
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">
                {searchTerm ? "لا توجد نتائج مطابقة" : "لا توجد مشاكل مشاركة حتى الآن"}
              </h3>
              <p className="text-gray-500">
                {searchTerm ? "حاول استخدام كلمات مفتاحية مختلفة" : "كن أول من يشارك مشكلة للحصول على المساعدة"}
              </p>
            </div>
          ) : (
            filteredProblems.map((problem, index) => (
              <div 
                key={problem.id} 
                className="transition-all duration-300 animate-fade-in" 
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProblemCard
                  problem={problem}
                  onAddComment={addComment}
                  onVoteComment={voteComment}
                  onReportProblem={reportProblem}
                  onReportComment={reportComment}
                  isCommentSubmitting={addCommentMutation.isPending}
                />
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
