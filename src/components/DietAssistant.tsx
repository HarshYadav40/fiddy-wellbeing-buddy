
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Utensils, ShoppingCart, Calendar, Droplets } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const DietAssistant = () => {
  const [formData, setFormData] = useState({
    dietType: '',
    allergies: [],
    fitnessGoal: '',
    workoutType: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [dietPlan, setDietPlan] = useState(null);
  const [chartData, setChartData] = useState(null);
  const { toast } = useToast();

  const dietTypes = ['Vegetarian', 'Non-Vegetarian', 'Vegan'];
  const allergyOptions = ['Lactose intolerant', 'Gluten-free', 'Nut allergies', 'Shellfish allergy', 'Soy allergy'];
  const fitnessGoals = ['Muscle gain', 'Weight loss', 'Skin glow', 'General health', 'Energy boost'];
  const workoutTypes = ['Strength', 'Yoga', 'Cardio', 'Mixed'];

  const handleAllergyChange = (allergy: string, checked: boolean | string) => {
    const isChecked = checked === true;
    setFormData(prev => ({
      ...prev,
      allergies: isChecked
        ? [...prev.allergies, allergy]
        : prev.allergies.filter(a => a !== allergy)
    }));
  };

  const generateMockChartData = () => {
    return {
      macros: [
        { name: 'Carbs', value: 45, color: '#8884d8' },
        { name: 'Protein', value: 30, color: '#82ca9d' },
        { name: 'Fats', value: 25, color: '#ffc658' }
      ],
      weeklyCalories: [
        { day: 'Mon', calories: 2200, protein: 150, carbs: 250, fats: 80 },
        { day: 'Tue', calories: 2150, protein: 145, carbs: 240, fats: 75 },
        { day: 'Wed', calories: 2300, protein: 160, carbs: 260, fats: 85 },
        { day: 'Thu', calories: 2180, protein: 155, carbs: 245, fats: 78 },
        { day: 'Fri', calories: 2250, protein: 158, carbs: 255, fats: 82 },
        { day: 'Sat', calories: 2400, protein: 165, carbs: 270, fats: 90 },
        { day: 'Sun', calories: 2100, protein: 140, carbs: 235, fats: 72 }
      ],
      hydration: [
        { time: '6AM', glasses: 2 },
        { time: '9AM', glasses: 3 },
        { time: '12PM', glasses: 5 },
        { time: '3PM', glasses: 7 },
        { time: '6PM', glasses: 8 },
        { time: '9PM', glasses: 10 }
      ]
    };
  };

  const generateDietPlan = async () => {
    if (!formData.dietType || !formData.fitnessGoal || !formData.workoutType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to generate your diet plan.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const prompt = `Create a comprehensive weekly diet plan for someone with the following preferences:
      Diet Type: ${formData.dietType}
      Allergies/Restrictions: ${formData.allergies.join(', ') || 'None'}
      Fitness Goal: ${formData.fitnessGoal}
      Workout Type: ${formData.workoutType}
      
      Please provide a structured response with:
      1. Daily meal suggestions (breakfast, lunch, dinner, snacks)
      2. Weekly grocery shopping list
      3. Hydration guidelines
      4. Supplement recommendations
      5. Key nutritional tips
      
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
      
      setDietPlan(planText);
      setChartData(generateMockChartData());
      
      toast({
        title: "Diet Plan Generated! 🥗",
        description: "Your personalized nutrition plan is ready!",
      });
    } catch (error) {
      console.error('Error generating diet plan:', error);
      toast({
        title: "Error",
        description: "Failed to generate diet plan. Please try again.",
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
            {/* Chef's hat */}
            <div className="relative mb-4">
              <div className="w-16 h-12 bg-white rounded-t-full border-2 border-gray-200 relative">
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-3 h-6 bg-white rounded-full"></div>
              </div>
              <div className="w-20 h-4 bg-white rounded-full border-2 border-gray-200 -mt-2"></div>
            </div>
            
            {/* Cooking pot with animated steam */}
            <div className="relative">
              <div className="w-24 h-16 bg-gradient-to-b from-gray-300 to-gray-400 rounded-b-3xl relative border-4 border-gray-500">
                {/* Pot handles */}
                <div className="absolute -left-3 top-2 w-6 h-3 border-3 border-gray-500 rounded-full border-r-transparent"></div>
                <div className="absolute -right-3 top-2 w-6 h-3 border-3 border-gray-500 rounded-full border-l-transparent"></div>
                
                {/* Bubbling effect inside pot */}
                <div className="absolute inset-2 bg-orange-200 rounded-b-2xl overflow-hidden">
                  <div className="absolute bottom-0 left-2 w-2 h-2 bg-orange-300 rounded-full animate-bounce"></div>
                  <div className="absolute bottom-1 right-3 w-1 h-1 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
                  <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-orange-300 rounded-full animate-bounce" style={{animationDelay: '0.6s'}}></div>
                </div>
              </div>
              
              {/* Animated steam clouds */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div className="flex space-x-1">
                  <div className="w-3 h-6 bg-gradient-to-t from-gray-200 to-transparent rounded-full opacity-70 animate-pulse"></div>
                  <div className="w-2 h-8 bg-gradient-to-t from-gray-300 to-transparent rounded-full opacity-60 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <div className="w-3 h-7 bg-gradient-to-t from-gray-200 to-transparent rounded-full opacity-80 animate-pulse" style={{animationDelay: '1s'}}></div>
                  <div className="w-2 h-5 bg-gradient-to-t from-gray-300 to-transparent rounded-full opacity-50 animate-pulse" style={{animationDelay: '1.5s'}}></div>
                </div>
              </div>
            </div>
            
            {/* Wooden spoon with stirring animation */}
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 origin-bottom">
              <div className="animate-spin" style={{animationDuration: '3s'}}>
                <div className="w-1 h-12 bg-amber-600 rounded-full relative">
                  <div className="absolute -top-1 -left-1 w-3 h-2 bg-amber-700 rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Floating ingredients */}
            <div className="absolute -top-4 -left-6 w-2 h-2 bg-green-500 rounded-full animate-bounce opacity-70" style={{animationDelay: '0.2s'}}></div>
            <div className="absolute -top-2 -right-8 w-1 h-1 bg-red-500 rounded-full animate-bounce opacity-60" style={{animationDelay: '0.8s'}}></div>
            <div className="absolute -top-6 right-4 w-1 h-1 bg-yellow-500 rounded-full animate-bounce opacity-80" style={{animationDelay: '1.2s'}}></div>
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-3xl font-bold text-green-700">Preparing Your Meal Plan</h3>
            <p className="text-gray-600 text-lg">Our AI chef is cooking up something special...</p>
          </div>
          
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-4">
          <Utensils className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Diet Assistant</h2>
        <p className="text-gray-600">Let's create your personalized nutrition plan</p>
      </div>

      {/* Form */}
      <Card className="border-0 gentle-shadow bg-green-50/50">
        <CardHeader>
          <CardTitle className="text-green-700">Tell us about yourself</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Diet Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Diet Type *
            </label>
            <Select value={formData.dietType} onValueChange={(value) => setFormData(prev => ({...prev, dietType: value}))}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select your diet preference" />
              </SelectTrigger>
              <SelectContent>
                {dietTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Allergies */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allergies & Restrictions
            </label>
            <div className="grid grid-cols-2 gap-3">
              {allergyOptions.map(allergy => (
                <div key={allergy} className="flex items-center space-x-2">
                  <Checkbox
                    id={allergy}
                    checked={formData.allergies.includes(allergy)}
                    onCheckedChange={(checked) => handleAllergyChange(allergy, checked)}
                  />
                  <label htmlFor={allergy} className="text-sm text-gray-600">{allergy}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Fitness Goal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fitness Goal *
            </label>
            <Select value={formData.fitnessGoal} onValueChange={(value) => setFormData(prev => ({...prev, fitnessGoal: value}))}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="What's your main goal?" />
              </SelectTrigger>
              <SelectContent>
                {fitnessGoals.map(goal => (
                  <SelectItem key={goal} value={goal}>{goal}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Workout Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Workout Type *
            </label>
            <Select value={formData.workoutType} onValueChange={(value) => setFormData(prev => ({...prev, workoutType: value}))}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select your workout style" />
              </SelectTrigger>
              <SelectContent>
                {workoutTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={generateDietPlan}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white border-0"
          >
            Generate My Diet Plan
          </Button>
        </CardContent>
      </Card>

      {/* Diet Plan Results with Charts */}
      {dietPlan && chartData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Macro Distribution Chart */}
          <Card className="border-0 gentle-shadow bg-white">
            <CardHeader>
              <CardTitle className="text-green-700">Macro Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{
                carbs: { label: "Carbs", color: "#8884d8" },
                protein: { label: "Protein", color: "#82ca9d" },
                fats: { label: "Fats", color: "#ffc658" }
              }}>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={chartData.macros}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {chartData.macros.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Weekly Calories Chart */}
          <Card className="border-0 gentle-shadow bg-white">
            <CardHeader>
              <CardTitle className="text-green-700">Weekly Calorie Target</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{
                calories: { label: "Calories", color: "#8884d8" }
              }}>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData.weeklyCalories}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Bar dataKey="calories" fill="#8884d8" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Diet Plan Text */}
          <Card className="border-0 gentle-shadow bg-white lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-green-700 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Your Personalized Diet Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed bg-green-50 p-4 rounded-lg">
                  {dietPlan}
                </div>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-3">
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <Droplets className="w-3 h-3 mr-1" />
                  Hydration Included
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Grocery List Ready
                </Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  <Utensils className="w-3 h-3 mr-1" />
                  7-Day Meal Plan
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DietAssistant;
