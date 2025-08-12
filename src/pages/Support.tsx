
import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LifeBuoy, Mail, Send, Phone, MessageCircleQuestion, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const Support = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // في تطبيق حقيقي، ستقوم بإرسال البيانات إلى الخادم
    console.log({ name, email, message });
    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
    toast.success("تم إرسال طلب الدعم بنجاح");
  };

  const faqs = [
    {
      id: "1",
      question: "هل المنصة مجانية؟",
      answer: "نعم، المنصة مجانية تمامًا ويمكن لأي شخص استخدامها بدون أي تكلفة."
    },
    {
      id: "2",
      question: "كيف يمكنني التأكد من أن هويتي مجهولة؟",
      answer: "نحن لا نجمع أي معلومات شخصية يمكن أن تحدد هويتك. المنصة مصممة لإخفاء هوية جميع المستخدمين تمامًا."
    },
    {
      id: "3",
      question: "هل يمكنني حذف مشكلة قمت بنشرها؟",
      answer: "حاليًا، لا يمكن حذف المشكلات بعد نشرها. نحن نعمل على تطوير هذه الميزة للإصدار القادم."
    },
    {
      id: "4",
      question: "هل يتم مراجعة المحتوى قبل نشره؟",
      answer: "لا، لا تتم مراجعة المحتوى مسبقًا، ولكن يمكن للمستخدمين الإبلاغ عن أي محتوى غير لائق ليتم مراجعته من قبل فريق الإدارة."
    },
    {
      id: "5",
      question: "كيف يمكنني الإبلاغ عن محتوى مسيء؟",
      answer: "يمكنك الضغط على زر 'إبلاغ' الموجود في كل مشكلة أو تعليق للإبلاغ عنه. سيقوم فريق الإدارة بمراجعة البلاغ واتخاذ الإجراء المناسب."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">مركز الدعم والمساعدة</h1>
          <p className="text-xl text-gray-600">نحن هنا لمساعدتك في أي وقت</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2 text-center">
              <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl font-bold">البريد الإلكتروني</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">abobakrhasan5335@gmail.com</p>
              <p className="text-sm text-gray-500 mt-2">نرد خلال 24 ساعة</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2 text-center">
              <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-xl font-bold">الهاتف</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">+20193954137</p>
              <p className="text-sm text-gray-500 mt-2">9 صباحاً - 5 مساءً</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-2 text-center">
              <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircleQuestion className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-xl font-bold">الأسئلة الشائعة</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">اطلع على الأسئلة المتكررة</p>
              <p className="text-sm text-gray-500 mt-2">تحديث دوري</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="contact" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="contact" className="text-lg">
              <Mail className="h-4 w-4 ml-2" />
              اتصل بنا
            </TabsTrigger>
            <TabsTrigger value="faq" className="text-lg">
              <MessageCircleQuestion className="h-4 w-4 ml-2" />
              الأسئلة الشائعة
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="contact" className="space-y-4">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-right">نموذج التواصل</CardTitle>
                <CardDescription className="text-right">أرسل لنا استفسارك وسنرد عليك في أقرب وقت ممكن</CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">شكراً لتواصلك معنا</h3>
                    <p className="text-gray-600 mb-6">لقد استلمنا رسالتك وسنرد عليك قريباً</p>
                    <Button onClick={() => setSubmitted(false)} className="bg-primary hover:bg-primary/90">
                      إرسال رسالة أخرى
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium text-right">
                        الاسم
                      </label>
                      <Input
                        id="name"
                        placeholder="الاسم الكامل"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="text-right"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-right">
                        البريد الإلكتروني
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="text-right"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="block text-sm font-medium text-right">
                        الرسالة
                      </label>
                      <Textarea
                        id="message"
                        placeholder="اكتب رسالتك هنا..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="resize-none text-right min-h-[150px]"
                        required
                      />
                    </div>
                    <div className="pt-2">
                      <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                        <Send className="h-4 w-4 ml-2" />
                        إرسال الرسالة
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="faq">
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-right">الأسئلة الشائعة</CardTitle>
                <CardDescription className="text-right">الأسئلة الأكثر شيوعاً حول منصة مساحة الحلول</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-right">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-right text-gray-700">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Support;
