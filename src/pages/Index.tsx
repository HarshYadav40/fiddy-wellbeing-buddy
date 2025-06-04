
import React, { useState } from 'react';
import { Heart, Utensils, Dumbbell, Brain, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import DietAssistant from '@/components/DietAssistant';
import WorkoutPlanner from '@/components/WorkoutPlanner';
import PookieChat from '@/components/PookieChat';

const Index = () => {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const modules = [
    {
      id: 'diet',
      title: 'Diet Assistant',
      icon: Utensils,
      description: 'Personalized nutrition planning for your goals',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-50',
    },
    {
      id: 'workout',
      title: 'Workout Planner',
      icon: Dumbbell,
      description: 'Smart fitness routines tailored to you',
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'pookie',
      title: 'Pookie - Mental Wellness',
      icon: Heart,
      description: 'Your caring AI companion for emotional support',
      color: 'from-purple-400 to-pink-500',
      bgColor: 'bg-purple-50',
    },
  ];

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'diet':
        return <DietAssistant />;
      case 'workout':
        return <WorkoutPlanner />;
      case 'pookie':
        return <PookieChat />;
      default:
        return null;
    }
  };

  if (activeModule) {
    return (
      <div className="min-h-screen">
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-100">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setActiveModule(null)}
              className="text-green-700 hover:text-green-800 hover:bg-green-50"
            >
              ← Back to Fiddy
            </Button>
            <h1 className="text-xl font-semibold text-gray-800">
              {modules.find(m => m.id === activeModule)?.title}
            </h1>
            <div className="w-20"></div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-6">
          {renderActiveModule()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="relative bg-white/70 backdrop-blur-md border-b border-green-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 wellness-gradient rounded-full flex items-center justify-center breathe">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  Fiddy
                </h1>
                <p className="text-sm text-gray-600">Your wellness companion</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              Your Complete
              <span className="block bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 bg-clip-text text-transparent">
                Wellness Journey
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Transform your life with personalized nutrition, smart workouts, and emotional support - all in one beautiful app.
            </p>
          </div>

          {/* Floating Elements */}
          <div className="relative">
            <div className="absolute top-10 left-10 w-20 h-20 bg-green-200 rounded-full opacity-50 float"></div>
            <div className="absolute top-32 right-16 w-12 h-12 bg-blue-200 rounded-full opacity-40 float" style={{animationDelay: '2s'}}></div>
            <div className="absolute bottom-20 left-20 w-16 h-16 bg-purple-200 rounded-full opacity-30 float" style={{animationDelay: '4s'}}></div>
          </div>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {modules.map((module, index) => {
              const IconComponent = module.icon;
              return (
                <Card
                  key={module.id}
                  className={`${module.bgColor} border-0 gentle-shadow wellness-hover cursor-pointer group relative overflow-hidden`}
                  onClick={() => setActiveModule(module.id)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  <CardContent className="p-8 text-center relative z-10">
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${module.color} rounded-full mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-gray-900 transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {module.description}
                    </p>
                    <Button 
                      className={`bg-gradient-to-r ${module.color} hover:shadow-lg transition-all duration-300 text-white border-0`}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-white/50">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 wellness-gradient rounded-full flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-700">Fiddy</span>
          </div>
          <p className="text-gray-600">
            Empowering your wellness journey with AI-powered insights
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
