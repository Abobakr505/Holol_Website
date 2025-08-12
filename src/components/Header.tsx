import { MessageSquare, Users, FileText, LifeBuoy, Shield, Menu , Handshake  } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { to: "/support", icon: LifeBuoy, label: "الدعم الفني" },
    { to: "/terms", icon: FileText, label: "السياسات والشروط" },
    { to: "/admin", icon: Shield, label: "الإدارة" },
    { to: "/chatPage", icon: Handshake , label: "المجتمع" },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="NUMBER mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 space-x-reverse">
            <Link to="/" className="flex items-center group">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-2 rounded-lg shadow-md group-hover:shadow-lg transition-all">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div className="mr-2">
                <h1 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                  محطة الحلول
                </h1>
                <p className="text-sm text-gray-600">منصة المشاكل المجهولة</p>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4 space-x-reverse">
            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center space-x-4 space-x-reverse">
              {navItems.map((item) => (
                <Link key={item.to} to={item.to}>
                  <Button variant="ghost" className="flex items-center text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50">
                    <item.icon className="h-4 w-4 ml-1" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              ))}
              <div className="flex items-center text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-full">
                <Users className="h-4 w-4 ml-1" />
                <span>مجتمع داعم</span>
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="sm:hidden">
              <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
                    <Menu className="h-6 w-6" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>القائمة</DrawerTitle>
                  </DrawerHeader>
                  <div className="flex flex-col space-y-4 p-4">
                    {navItems.map((item) => (
                      <Link key={item.to} to={item.to} onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50">
                          <item.icon className="h-4 w-4 ml-2" />
                          <span>{item.label}</span>
                        </Button>
                      </Link>
                    ))}
                    <div className="flex items-center text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-full">
                      <Users className="h-4 w-4 ml-1" />
                      <span>مجتمع داعم</span>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};