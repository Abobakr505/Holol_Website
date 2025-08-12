import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  AlertTriangle, 
  MessageSquare, 
  Trash2, 
  X, 
  User
} from "lucide-react";
import { toast } from "sonner";

type Problem = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  comments: Comment[];
}

type Comment = {
  id: string;
  text: string;
  timestamp: string;
  isHelpful?: boolean;
}

type Report = {
  id: string;
  problem_id: string;
  reason: string;
  created_at: string;
}

const ADMIN_EMAIL = "admin@masaha.com";
const ADMIN_PASSWORD = "admin123";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportsLoading, setReportsLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      console.log('Session:', data);
      if (data.session?.user?.email === ADMIN_EMAIL) {
        setIsAuthenticated(true);
        await fetchData();
      }
      setLoading(false);
    };
    checkSession();
  }, []);

  const fetchData = async () => {
    try {
      setReportsLoading(true);
      const { data: problemsData, error: problemsError } = await supabase
        .from('problems')
        .select('*, comments(*)');
      
      if (problemsError) {
        console.error('Problems Fetch Error:', problemsError);
        throw problemsError;
      }
      setProblems((problemsData as Problem[]) || []);

      const { data: reportsData, error: reportsError } = await supabase
        .from('problem_reports')
        .select('id, problem_id, reason, created_at');
      
      if (reportsError) {
        console.error('Reports Fetch Error:', reportsError);
        throw reportsError;
      }
      console.log('Fetched Reports:', reportsData);
      setReports((reportsData as Report[]).sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ) || []);
    } catch (error: any) {
      console.error('Fetch Data Error:', error.message, error);
      toast.error('فشل في جلب البيانات: ' + error.message);
    } finally {
      setReportsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Attempting login with:', { email: email.trim().toLowerCase(), password: password.trim() });
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });

      if (error) {
        console.error('Supabase Auth Error:', {
          status: error.status,
          message: error.message,
          code: error.code,
        });
        throw new Error(`فشل المصادقة: ${error.message}`);
      }

      if (!data.user) {
        throw new Error('لم يتم العثور على المستخدم');
      }

      if (data.user.email !== ADMIN_EMAIL) {
        await supabase.auth.signOut();
        throw new Error('غير مصرح بالدخول');
      }

      setIsAuthenticated(true);
      await fetchData();
      toast.success('مرحبًا بك!');
    } catch (error: any) {
      console.error('Login Error:', error);
      toast.error(error.message || 'فشل في تسجيل الدخول');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    toast.success("تم تسجيل الخروج");
  };

  const handleDeleteProblem = async (problemId: string) => {
    try {
      await supabase.from('comments').delete().eq('problem_id', problemId);
      await supabase.from('problems').delete().eq('id', problemId);
      
      setProblems(prev => prev.filter(p => p.id !== problemId));
      setReports(prev => prev.filter(r => r.problem_id !== problemId));
      
      toast.success("تم الحذف بنجاح");
    } catch (error) {
      console.error('Delete Problem Error:', error);
      toast.error("فشل في الحذف");
    }
  };

  const handleDeleteComment = async (problemId: string, commentId: string) => {
    try {
      await supabase.from('comments').delete().eq('id', commentId);
      
      setProblems(prev =>
        prev.map(p =>
          p.id === problemId
            ? { ...p, comments: p.comments.filter(c => c.id !== commentId) }
            : p
        )
      );
      // No need to filter reports here as comment_reports is handled separately
      toast.success("تم حذف التعليق بنجاح");
    } catch (error) {
      console.error('Delete Comment Error:', error);
      toast.error("فشل في حذف التعليق");
    }
  };

  const handleDismissReport = async (reportId: string) => {
    try {
      await supabase.from('problem_reports').delete().eq('id', reportId);
      setReports(prev => prev.filter(r => r.id !== reportId));
      toast.success("تم التجاهل");
    } catch (error) {
      console.error('Dismiss Report Error:', error);
      toast.error("فشل في التجاهل");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <Header />
        <main className="container mx-auto px-4 py-16 max-w-md">
          <Card className="p-6 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex justify-center mb-6">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">
                تسجيل دخول الإدارة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-right">
                    البريد الإلكتروني
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-right"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-right">
                    كلمة المرور
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-right"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  تسجيل الدخول
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="flex items-center gap-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <User size={16} />
            تسجيل الخروج
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">لوحة تحكم الإدارة</h1>
        </div>
        
        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="reports" className="text-lg">
              <AlertTriangle className="h-4 w-4 ml-2" />
              البلاغات
            </TabsTrigger>
            <TabsTrigger value="all" className="text-lg">
              <MessageSquare className="h-4 w-4 ml-2" />
              كل المشاكل
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="reports" className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-right">البلاغات الواردة</h2>
            {reportsLoading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
            ) : reports.length === 0 ? (
              <Alert className="bg-blue-50 border-blue-100">
                <AlertTitle className="text-right font-semibold text-blue-800">لا توجد بلاغات</AlertTitle>
                <AlertDescription className="text-right text-blue-700">
                  لا توجد أي بلاغات جديدة في الوقت الحالي.
                </AlertDescription>
              </Alert>
            ) : (
              reports.map((report) => (
                <Card key={report.id} className="overflow-hidden border-0 shadow-md">
                  <div className="h-1 bg-amber-500" />
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:bg-red-50 px-3" 
                          onClick={() => handleDismissReport(report.id)}
                        >
                          <X className="h-4 w-4 ml-1" />
                          <span>تجاهل</span>
                        </Button>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 space-x-reverse mb-2">
                          <h3 className="font-semibold text-gray-800">
                            بلاغ عن مشكلة
                          </h3>
                        </div>
                        <p className="text-gray-600 mb-2">{report.reason}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>{report.created_at}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="all" className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-right">جميع المشاكل</h2>
            {problems.length === 0 ? (
              <Alert className="bg-blue-50 border-blue-100">
                <AlertTitle className="text-right font-semibold text-blue-800">لا توجد مشاكل</AlertTitle>
                <AlertDescription className="text-right text-blue-700">
                  لا توجد أي مشاكل في الوقت الحالي.
                </AlertDescription>
              </Alert>
            ) : (
              problems.map((problem) => (
                <Card key={problem.id} className="overflow-hidden border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:bg-red-50 px-3" 
                        onClick={() => handleDeleteProblem(problem.id)}
                      >
                        <Trash2 className="h-4 w-4 ml-1" />
                        <span>حذف</span>
                      </Button>
                      <div className="text-right">
                        <h3 className="font-semibold text-gray-800 mb-2">{problem.title}</h3>
                        <p className="text-gray-600 mb-2">{problem.description}</p>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="border-blue-300 text-blue-700">
                            {problem.comments.length} تعليق
                          </Badge>
                          <span className="text-sm text-gray-500">{problem.timestamp}</span>
                        </div>
                        {problem.comments.length > 0 ? (
                          <div className="mt-4">
                            <h4 className="text-lg font-semibold text-gray-700 mb-2 text-right">التعليقات</h4>
                            {problem.comments.map((comment) => (
                              <div key={comment.id} className="border-t pt-2 mt-2 text-right">
                                <div className="flex justify-between items-start">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-red-500 hover:bg-red-50 px-3" 
                                    onClick={() => handleDeleteComment(problem.id, comment.id)}
                                  >
                                    <Trash2 className="h-4 w-4 ml-1" />
                                    <span>حذف</span>
                                  </Button>
                                  <div>
                                    <p className="text-gray-600">{comment.text}</p>
                                    <div className="flex items-center justify-between text-sm text-gray-500 mt-1">
                                      <span>{comment.timestamp}</span>
                                      <Badge variant={comment.isHelpful ? 'default' : 'outline'} className={comment.isHelpful ? 'bg-green-500' : 'border-gray-300'}>
                                        {comment.isHelpful ? 'مفيد' : 'غير مفيد'}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-right">لا توجد تعليقات</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;