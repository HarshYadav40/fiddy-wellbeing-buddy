
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Dumbbell, Calendar, PlayCircle, Clock, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, RadialBarChart, RadialBar } from 'recharts';

const WorkoutPlanner = () => {
  const [formData, setFormData] = useState({
    workoutType: '',
    duration: '',
    frequency: '',
    equipment: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [chartData, setChartData] = useState(null);
  const { toast } = useToast();

  const workoutTypes = ['Strength', 'Yoga', 'Cardio', 'Functional', 'Stretching'];
  const durations = ['15-30 minutes', '30-45 minutes', '45-60 minutes', '60+ minutes'];
  const frequencies = ['2-3 times/week', '4-5 times/week', '6-7 times/week', 'Daily'];
  const equipmentOptions = ['Dumbbells', 'Resistance bands', 'Yoga mat', 'Pull-up bar', 'Kettlebells', 'No equipment'];

  const handleEquipmentChange = (equipment: string, checked: boolean | string) => {
    const isChecked = checked === true;
    setFormData(prev => ({
      ...prev,
      equipment: isChecked
        ? [...prev.equipment, equipment]
        : prev.equipment.filter(e => e !== equipment)
    }));
  };

  const generateMockChartData = () => {
    return {
      weeklyProgress: [
        { week: 'Week 1', strength: 70, endurance: 60, flexibility: 50 },
        { week: 'Week 2', strength: 75, endurance: 65, flexibility: 55 },
        { week: 'Week 3', strength: 80, endurance: 70, flexibility: 60 },
        { week: 'Week 4', strength: 85, endurance: 75, flexibility: 65 }
      ],
      workoutIntensity: [
        { day: 'Mon', intensity: 85, duration: 45 },
        { day: 'Tue', intensity: 60, duration: 30 },
        { day: 'Wed', intensity: 90, duration: 50 },
        { day: 'Thu', intensity: 70, duration: 35 },
        { day: 'Fri', intensity: 95, duration: 55 },
        { day: 'Sat', intensity: 50, duration: 25 },
        { day: 'Sun', intensity: 0, duration: 0 }
      ],
      fitnessGoals: [
        { name: 'Strength', value: 75, fill: '#8884d8' },
        { name: 'Cardio', value: 60, fill: '#82ca9d' },
        { name: 'Flexibility', value: 45, fill: '#ffc658' }
      ]
    };
  };

  const generateWorkoutPlan = async () => {
    if (!formData.workoutType || !formData.duration || !formData.frequency) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to generate your workout plan.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const prompt = `Create a comprehensive weekly workout plan with the following specifications:
      Workout Type: ${formData.workoutType}
      Duration per session: ${formData.duration}
      Frequency: ${formData.frequency}
      Available Equipment: ${formData.equipment.join(', ') || 'Bodyweight only'}
      
      Please provide a structured response with:
      1. Weekly workout schedule with specific exercises
      2. Sets, reps, and rest periods for each exercise
      3. YouTube video search terms for each exercise
      4. Warm-up and cool-down routines
      5. Progress tracking tips
      6. Modifications for different fitness levels
      
      Keep the response clean and organized without markdown formatting.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAYmEj1tHJMiRm7lMsQbJ83Tf3IfkkY0Fg`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      });

      const data = await response.json();
      const planText = data.candidates[0].content.parts[0].text;
      
      setWorkoutPlan(planText);
      setChartData(generateMockChartData());
      
      toast({
        title: "Workout Plan Ready! 💪",
        description: "Your personalized fitness routine is here!",
      });
    } catch (error) {
      console.error('Error generating workout plan:', error);
      toast({
        title: "Error",
        description: "Failed to generate workout plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading overlay if generating plan
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
          <div className="relative">
            {/* Gym environment */}
            <div className="relative">
              {/* Muscular figure */}
              <div className="relative w-20 h-32">
                {/* Head */}
                <div className="w-7 h-7 bg-gradient-to-b from-amber-200 to-amber-300 rounded-full mx-auto mb-1 relative">
                  <div className="absolute top-1 left-1 w-1 h-1 bg-gray-800 rounded-full"></div>
                  <div className="absolute top-1 right-1 w-1 h-1 bg-gray-800 rounded-full"></div>
                </div>
                
                {/* Muscular torso */}
                <div className="w-12 h-16 bg-gradient-to-b from-blue-600 to-blue-700 rounded-lg mx-auto mb-1 relative">
                  {/* Chest muscles definition */}
                  <div className="absolute top-2 left-2 w-2 h-3 bg-blue-500 rounded opacity-50"></div>
                  <div className="absolute top-2 right-2 w-2 h-3 bg-blue-500 rounded opacity-50"></div>
                  {/* Abs */}
                  <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-500 rounded opacity-30"></div>
                </div>
                
                {/* Muscular arms doing deadlift */}
                <div className="absolute top-8 left-0 w-2 h-10 bg-gradient-to-b from-amber-200 to-amber-300 rounded-full origin-top transform -rotate-12 animate-pulse"></div>
                <div className="absolute top-8 right-0 w-2 h-10 bg-gradient-to-b from-amber-200 to-amber-300 rounded-full origin-top transform rotate-12 animate-pulse"></div>
                
                {/* Muscular legs */}
                <div className="flex justify-center space-x-1">
                  <div className="w-3 h-12 bg-gradient-to-b from-blue-800 to-blue-900 rounded-lg relative">
                    <div className="absolute top-2 left-0 w-1 h-4 bg-blue-700 rounded opacity-50"></div>
                  </div>
                  <div className="w-3 h-12 bg-gradient-to-b from-blue-800 to-blue-900 rounded-lg relative">
                    <div className="absolute top-2 right-0 w-1 h-4 bg-blue-700 rounded opacity-50"></div>
                  </div>
                </div>
              </div>
              
              {/* Olympic barbell with weights */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 animate-bounce" style={{animationDuration: '2s'}}>
                {/* Weight plates */}
                <div className="absolute -left-6 -top-2 w-5 h-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded border border-gray-600"></div>
                <div className="absolute -right-6 -top-2 w-5 h-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded border border-gray-600"></div>
                
                {/* Barbell bar */}
                <div className="w-24 h-1 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-full relative">
                  {/* Grip marks */}
                  <div className="absolute left-6 top-0 w-0.5 h-1 bg-gray-400"></div>
                  <div className="absolute right-6 top-0 w-0.5 h-1 bg-gray-400"></div>
                </div>
              </div>
              
              {/* Sweat drops */}
              <div className="absolute top-6 left-6 w-1 h-2 bg-gradient-to-b from-blue-300 to-blue-400 rounded-full animate-pulse"></div>
              <div className="absolute top-4 right-6 w-1 h-2 bg-gradient-to-b from-blue-300 to-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute top-8 left-10 w-0.5 h-1 bg-gradient-to-b from-blue-300 to-blue-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              
              {/* Gym floor */}
              <div className="absolute -bottom-2 -left-8 w-36 h-2 bg-gradient-to-r from-gray-400 to-gray-500 rounded opacity-30"></div>
            </div>
            
            {/* Strength indicators */}
            <div className="absolute -left-12 top-8 flex flex-col space-y-1">
              <div className="w-8 h-1 bg-red-500 rounded animate-pulse"></div>
              <div className="w-6 h-1 bg-orange-500 rounded animate-pulse" style={{animationDelay: '0.3s'}}></div>
              <div className="w-4 h-1 bg-yellow-500 rounded animate-pulse" style={{animationDelay: '0.6s'}}></div>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-3xl font-bold text-blue-700">Building Your Workout</h3>
            <p className="text-gray-600 text-lg">Crafting the perfect training routine...</p>
          </div>
          
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full mb-4">
          <Dumbbell className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Workout Planner</h2>
        <p className="text-gray-600">Let's design your perfect fitness routine</p>
      </div>

      {/* Form */}
      <Card className="border-0 gentle-shadow bg-blue-50/50">
        <CardHeader>
          <CardTitle className="text-blue-700">Customize your workout</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Workout Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workout Type *
            </label>
            <Select value={formData.workoutType} onValueChange={(value) => setFormData(prev => ({...prev, workoutType: value}))}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Choose your workout style" />
              </SelectTrigger>
              <SelectContent>
                {workoutTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration per Session *
            </label>
            <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({...prev, duration: value}))}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="How long can you work out?" />
              </SelectTrigger>
              <SelectContent>
                {durations.map(duration => (
                  <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frequency *
            </label>
            <Select value={formData.frequency} onValueChange={(value) => setFormData(prev => ({...prev, frequency: value}))}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="How often do you want to work out?" />
              </SelectTrigger>
              <SelectContent>
                {frequencies.map(freq => (
                  <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Equipment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Equipment
            </label>
            <div className="grid grid-cols-2 gap-3">
              {equipmentOptions.map(equipment => (
                <div key={equipment} className="flex items-center space-x-2">
                  <Checkbox
                    id={equipment}
                    checked={formData.equipment.includes(equipment)}
                    onCheckedChange={(checked) => handleEquipmentChange(equipment, checked)}
                  />
                  <label htmlFor={equipment} className="text-sm text-gray-600">{equipment}</label>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={generateWorkoutPlan}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white border-0"
          >
            Generate My Workout Plan
          </Button>
        </CardContent>
      </Card>

      {/* Workout Plan Results with Charts */}
      {workoutPlan && chartData && (
        <div className="space-y-6">
          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Weekly Progress Chart */}
            <Card className="border-0 gentle-shadow bg-white">
              <CardHeader>
                <CardTitle className="text-blue-700">Weekly Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{
                  strength: { label: "Strength", color: "#8884d8" },
                  endurance: { label: "Endurance", color: "#82ca9d" },
                  flexibility: { label: "Flexibility", color: "#ffc658" }
                }}>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData.weeklyProgress}>
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Line type="monotone" dataKey="strength" stroke="#8884d8" strokeWidth={2} />
                      <Line type="monotone" dataKey="endurance" stroke="#82ca9d" strokeWidth={2} />
                      <Line type="monotone" dataKey="flexibility" stroke="#ffc658" strokeWidth={2} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Workout Intensity Chart */}
            <Card className="border-0 gentle-shadow bg-white">
              <CardHeader>
                <CardTitle className="text-blue-700">Daily Intensity</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{
                  intensity: { label: "Intensity", color: "#8884d8" }
                }}>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData.workoutIntensity}>
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Bar dataKey="intensity" fill="#8884d8" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Fitness Goals Radial Chart */}
            <Card className="border-0 gentle-shadow bg-white">
              <CardHeader>
                <CardTitle className="text-blue-700">Fitness Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{
                  strength: { label: "Strength", color: "#8884d8" },
                  cardio: { label: "Cardio", color: "#82ca9d" },
                  flexibility: { label: "Flexibility", color: "#ffc658" }
                }}>
                  <ResponsiveContainer width="100%" height={200}>
                    <RadialBarChart data={chartData.fitnessGoals} innerRadius="30%" outerRadius="80%">
                      <RadialBar dataKey="value" cornerRadius={10} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Workout Plan Text */}
          <Card className="border-0 gentle-shadow bg-white">
            <CardHeader>
              <CardTitle className="text-blue-700 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Your Personalized Workout Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-lg">
                  {workoutPlan}
                </div>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-3">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  <PlayCircle className="w-3 h-3 mr-1" />
                  YouTube Tutorials
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <Calendar className="w-3 h-3 mr-1" />
                  Weekly Schedule
                </Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  <Clock className="w-3 h-3 mr-1" />
                  Progress Tracking
                </Badge>
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Performance Analytics
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WorkoutPlanner;
