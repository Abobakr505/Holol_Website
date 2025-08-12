
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { FileCheck, Shield, AlertTriangle } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            السياسات والشروط
          </h1>
          <p className="text-xl text-gray-600">
            تحكم هذه الشروط استخدامك لمنصة مساحة الحلول
          </p>
        </div>
        
        <Card className="bg-white shadow-lg rounded-xl border-0 overflow-hidden mb-8">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-green-400"></div>
          <CardContent className="p-8">
            <div className="flex items-center mb-6 border-b pb-4">
              <FileCheck className="h-8 w-8 text-blue-600 ml-4" />
              <h2 className="text-2xl font-bold text-gray-800">شروط الاستخدام</h2>
            </div>
            
            <div className="space-y-4 text-right">
              <p className="text-gray-700 leading-relaxed">
                مرحبًا بك في منصة "مساحة الحلول". باستخدامك لهذه المنصة، فإنك توافق على الالتزام بالشروط والأحكام المذكورة أدناه.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-gray-700 leading-relaxed font-medium mb-2">
                  1. المحتوى المناسب
                </p>
                <p className="text-gray-600">
                  تلتزم بعدم نشر محتوى غير لائق أو مسيء أو يحرض على الكراهية. نحن نحتفظ بالحق في إزالة أي محتوى مخالف دون إشعار.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-gray-700 leading-relaxed font-medium mb-2">
                  2. المشورة الشخصية
                </p>
                <p className="text-gray-600">
                  تقر بأن المعلومات المقدمة من المستخدمين الآخرين هي آراء شخصية وليست نصائح احترافية. لا تعتبر المنصة بديلاً عن المشورة المتخصصة.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-gray-700 leading-relaxed font-medium mb-2">
                  3. احترام الخصوصية
                </p>
                <p className="text-gray-600">
                  تحترم خصوصية الآخرين وتلتزم بعدم محاولة التعرف على هويات المستخدمين أو مشاركة معلومات قد تكشف عن هوياتهم.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-lg rounded-xl border-0 overflow-hidden mb-8">
          <div className="h-2 bg-gradient-to-r from-green-400 to-blue-500"></div>
          <CardContent className="p-8">
            <div className="flex items-center mb-6 border-b pb-4">
              <Shield className="h-8 w-8 text-green-600 ml-4" />
              <h2 className="text-2xl font-bold text-gray-800">سياسة الخصوصية</h2>
            </div>
            
            <div className="space-y-4 text-right">
              <p className="text-gray-700 leading-relaxed">
                نحن نحترم خصوصيتك ونلتزم بحماية بياناتك. كل المشاركات على منصة "مساحة الحلول" مجهولة الهوية.
              </p>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <p className="text-gray-700 leading-relaxed font-medium mb-2">
                  1. جمع البيانات
                </p>
                <p className="text-gray-600">
                  لا نجمع أي معلومات شخصية يمكن أن تحدد هويتك. نحن نهتم فقط بتوفير تجربة آمنة ومفيدة لجميع المستخدمين.
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <p className="text-gray-700 leading-relaxed font-medium mb-2">
                  2. إخفاء الهوية
                </p>
                <p className="text-gray-600">
                  تعتمد المنصة على إخفاء هوية المستخدمين لتوفير مساحة آمنة للمشاركة. لا نطلب أي معلومات تعريفية عند المشاركة.
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <p className="text-gray-700 leading-relaxed font-medium mb-2">
                  3. حماية المحتوى
                </p>
                <p className="text-gray-600">
                  نحتفظ بالحق في إزالة أي محتوى ينتهك شروط الاستخدام أو قد يكشف عن معلومات شخصية لأي مستخدم.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-lg rounded-xl border-0 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-amber-500 to-red-400"></div>
          <CardContent className="p-8">
            <div className="flex items-center mb-6 border-b pb-4">
              <AlertTriangle className="h-8 w-8 text-amber-600 ml-4" />
              <h2 className="text-2xl font-bold text-gray-800">سياسة الإبلاغ</h2>
            </div>
            
            <div className="space-y-4 text-right">
              <p className="text-gray-700 leading-relaxed">
                يمكن للمستخدمين الإبلاغ عن أي محتوى غير لائق أو مسيء من خلال الضغط على زر "إبلاغ" المتوفر لكل مشكلة وتعليق.
              </p>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <p className="text-gray-700 leading-relaxed font-medium mb-2">
                  1. مراجعة البلاغات
                </p>
                <p className="text-gray-600">
                  سيتم مراجعة جميع البلاغات من قبل فريق الإدارة، ونعدكم بالتعامل معها بجدية وسرعة لضمان بيئة آمنة للجميع.
                </p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <p className="text-gray-700 leading-relaxed font-medium mb-2">
                  2. الإجراءات التصحيحية
                </p>
                <p className="text-gray-600">
                  قد يتم حذف المحتوى المخالف دون إشعار مسبق إذا تبين أنه ينتهك شروط الاستخدام أو قد يسبب ضررًا لأي شخص.
                </p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <p className="text-gray-700 leading-relaxed font-medium mb-2">
                  3. مساهمة المجتمع
                </p>
                <p className="text-gray-600">
                  نقدر مساعدتكم في الحفاظ على بيئة آمنة وداعمة لجميع المستخدمين من خلال الإبلاغ عن أي محتوى غير مناسب تلاحظونه.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Terms;
