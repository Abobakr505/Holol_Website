import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/Header";

interface Message {
  id: string;
  text: string;
  created_at: string;
  timestamp: string;
  isCurrentUser: boolean; // To track if the message is from the current user
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const [sessionId] = useState(crypto.randomUUID()); // Unique session ID for this client

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Fetch error:", error);
        toast.error(`فشل في جلب الرسائل: ${error.message}`);
        setIsLoading(false);
        return;
      }

      const formattedMessages = data.map((message) => ({
        ...message,
        timestamp: new Intl.RelativeTimeFormat("ar", { numeric: "auto" }).format(
          -Math.round(
            (Date.now() - new Date(message.created_at).getTime()) / (1000 * 60)
          ),
          "minute"
        ).replace(/\d+/g, (num) =>
          num.replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d])
        ),
        isCurrentUser: false, // Messages from DB are not from the current user
      }));

      setMessages(formattedMessages.reverse());
      setIsLoading(false);
      scrollToBottom();
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("حدث خطأ غير متوقع");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['messages'] });
    fetchMessages();

    const subscription = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMessage = {
            ...payload.new,
            timestamp: new Intl.RelativeTimeFormat("ar", { numeric: "auto" }).format(
              0,
              "minute"
            ),
            isCurrentUser: false, // Assume real-time messages are not from the current user
          };
          setMessages((prev) => [...prev, newMessage]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [queryClient]);

  const sendMessage = async () => {
    if (!newMessage.trim()) {
      toast.error("الرجاء إدخال رسالة");
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .insert([{ text: newMessage.trim() }])
      .select();

    if (error) {
      console.error("Send error:", error);
      toast.error(`فشل في إرسال الرسالة: ${error.message}`);
    } else {
      const sentMessage = {
        ...data[0],
        timestamp: new Intl.RelativeTimeFormat("ar", { numeric: "auto" }).format(
          0,
          "minute"
        ),
        isCurrentUser: true, // Mark as current user's message
      };
      setMessages((prev) => [...prev, sentMessage]);
      setNewMessage("");
      scrollToBottom();
    }
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            الدردشة المجهولة
          </h1>
          <p className="text-xl text-gray-600">
            تحدث بحرية وبأمان مع المجتمع بشكل مجهول
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 h-[70vh] overflow-y-auto">
          {isLoading && messages.length === 0 ? (
            <div className="text-center py-16 animate-pulse">
              <Loader2 className="h-12 w-12 mx-auto text-blue-500 animate-spin" />
              <p className="text-gray-500 mt-4">جارٍ تحميل الرسائل...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-2xl text-gray-600">لا توجد رسائل بعد</p>
              <p className="text-gray-500">كن أول من يبدأ المحادثة!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 p-4 rounded-lg animate-fade-in ${
                  message.isCurrentUser ? "bg-blue-100" : "bg-green-100"
                }`}
              >
                <p className="text-gray-800 font-semibold">مجهول</p>
                <p className="text-gray-800">{message.text}</p>
                <p className="text-sm text-gray-500 text-right">
                  {message.timestamp}
                </p>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-4">
          <Input
            type="text"
            placeholder="اكتب رسالتك هنا..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="text-right rounded-full bg-white/80 backdrop-blur-sm"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-full"
            disabled={isLoading}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;