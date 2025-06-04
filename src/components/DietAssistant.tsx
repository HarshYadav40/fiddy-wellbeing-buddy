
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Utensils, ShoppingCart, Calendar, Droplets } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DietAssistant = () => {
  const [formData, setFormData] = useState({
    dietType: '',
    allergies: [],
    fitnessGoal: '',
    workoutType: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [dietPlan, setDietPlan] = useState(null);
  const { toast } = useToast();

  const dietTypes = ['Vegetarian', 'Non-Vegetarian', 'Vegan'];
  const allergyOptions = ['Lactose intolerant', 'Gluten-free', 'Nut allergies', 'Shellfish allergy', 'Soy allergy'];
  const fitnessGoals = ['Muscle gain', 'Weight loss', 'Skin glow', 'General health', 'Energy boost'];
  const workoutTypes = ['Strength', 'Yoga', 'Cardio', 'Mixed'];

  const handleAllergyChange = (allergy: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      allergies: checked
        ? [...prev.allergies, allergy]
        : prev.allergies.filter(a => a !== allergy)
    }));
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
      
      Please provide:
      1. A 7-day meal plan with breakfast, lunch, dinner, and 2 snacks
      2. Grocery shopping list
      3. Hydration recommendations
      4. Supplement suggestions
      5. Macro breakdown for each day
      
      Format the response in a structured, easy-to-read manner.`;

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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Your Plan...
              </>
            ) : (
              'Generate My Diet Plan'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Diet Plan Results */}
      {dietPlan && (
        <Card className="border-0 gentle-shadow bg-white">
          <CardHeader>
            <CardTitle className="text-green-700 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Your Personalized Diet Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                {dietPlan}
              </pre>
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
      )}
    </div>
  );
};

export default DietAssistant;
