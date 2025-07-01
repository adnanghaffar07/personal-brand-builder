
import { MessageSquare, Target, Zap } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigationItems = [
    { name: "Smart Targeting", icon: Target, active: true },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden backdrop-blur-sm transition-all duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out shadow-lg lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${!isOpen ? 'lg:w-0 lg:overflow-hidden' : ''}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo/Brand Section */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Personal Brand Builder</h2>
                <p className="text-xs text-gray-500">LinkedIn Outreach Manager</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item, index) => (
              <a
                key={index}
                href="#"
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                  ${item.active 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' 
                    : 'text-gray-700 hover:bg-gray-100 hover:transform hover:scale-105'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 ${item.active ? 'text-white' : 'text-gray-500 group-hover:text-blue-500'} transition-colors`} />
                <span>{item.name}</span>
                {item.active && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </a>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-xs text-gray-500 text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Zap className="w-3 h-3 text-yellow-500" />
                <span>Powered by AI</span>
              </div>
              <p>Version 2.0</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
