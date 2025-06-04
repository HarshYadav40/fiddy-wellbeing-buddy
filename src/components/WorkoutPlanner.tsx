
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Dumbbell, Calendar, PlayCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WorkoutPlanner = () => {
  const [formData, setFormData] = useState({
    workoutType: '',
    duration: '',
    frequency: '',
    equipment: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const { toast } = useToast();

  const workoutTypes = ['Strength', 'Yoga', 'Cardio', 'Functional', 'Stretching'];
  const durations = ['15-30 minutes', '30-45 minutes', '45-60 minutes', '60+ minutes'];
  const frequencies = ['2-3 times/week', '4-5 times/week', '6-7 times/week', 'Daily'];
  const equipmentOptions = ['Dumbbells', 'Resistance bands', 'Yoga mat', 'Pull-up bar', 'Kettlebells', 'No equipment'];

  const handleEquipmentChange = (equipment: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      equipment: checked
        ? [...prev.equipment, equipment]
        : prev.equipment.filter(e => e !== equipment)
    }));
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
      
      Please provide:
      1. A detailed weekly workout schedule
      2. Specific exercises for each day with sets and reps
      3. YouTube video suggestions for each exercise (include search terms)
      4. Warm-up and cool-down routines
      5. Progress tracking suggestions
      6. Rest day activities
      7. Modifications for beginners and advanced levels
      
      Format the response in a clear, structured manner with daily breakdowns.`;

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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Your Plan...
              </>
            ) : (
              'Generate My Workout Plan'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Workout Plan Results */}
      {workoutPlan && (
        <Card className="border-0 gentle-shadow bg-white">
          <CardHeader>
            <CardTitle className="text-blue-700 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Your Personalized Workout Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                {workoutPlan}
              </pre>
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
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkoutPlanner;
