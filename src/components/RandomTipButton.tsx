import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Lightbulb } from "lucide-react";

const tips = [
  "حدد المشكلة بوضوح واكتب تفاصيلها: ما هي، متى تظهر، وكيف تؤثر عليك؟",
  "قسّم المشكلة إلى أجزاء صغيرة قابلة للإدارة حتى لا تشعر بالإرهاق.",
  "ضع خطة عمل بأهداف محددة وجدول زمني لإنجاز كل خطوة.",
  "اطلب الدعم من صديق موثوق أو أحد أفراد العائلة لمناقشة المشكلة وإيجاد حلول جديدة.",
  "دوّن أفكارك ومشاعرك في دفتر يوميات لتفريغ القلق وفهم الأنماط المتكررة لديك.",
  "خذ استراحة من التفكير المركز (ممارسة هواية أو نزهة) ثم عد لاحقًا لحل المشكلة بعقل صافٍ.",
  "ركّز على الحلول التالية بدل الانغماس في التفكير بالمشكلة نفسها.",
  "اعتمد عقلية النمو: اعتبر الأخطاء فرصًا للتعلم والتطوير.",
  "مارس أنشطة تحفّز التفكير الإبداعي كالألغاز أو الرسم أو الكتابة الحرة.",
  "عند اشتداد الشعور بالتوتر أو القلق، لا تتردد في استشارة مختص نفسي أو مدرب معتمد."
];


export const RandomTipButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTip, setCurrentTip] = useState("");

  const getRandomTip = () => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    return tips[randomIndex];
  };

  const handleButtonClick = () => {
    setCurrentTip(getRandomTip());
    setIsOpen(true);
  };

  return (
    <>
      <Button
        onClick={handleButtonClick}
        className="p-4  z-10 fixed bottom-4 left-4 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white  rounded-full flex items-center gap-2"
      >
        نصيحة
        <Lightbulb className="h-5 w-5" />
        
      </Button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
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
                    className="text-lg font-medium leading-6 text-gray-900 flex items-center gap-2"
                  >
                    <Lightbulb className="h-5 w-5 text-blue-600" />
                    نصيحة لحل المشكلة
                  </Dialog.Title>
                  <div className="mt-4">
                    <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg border-r-4 border-blue-200 leading-relaxed">
                      {currentTip}
                    </p>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={() => setIsOpen(false)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
                    >
                      إغلاق
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