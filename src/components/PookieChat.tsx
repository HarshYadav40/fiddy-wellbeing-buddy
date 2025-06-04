
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Heart, Send, Loader2, Music, Wind, Sun, Moon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PookieChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey beautiful soul! 💕 I'm Pookie, your caring companion. I'm here to listen, support, and remind you how amazing you are. How are you feeling today?",
      sender: 'pookie',
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mood, setMood] = useState('');
  const messagesEndRef = useRef(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const moodOptions = [
    { emoji: '😊', label: 'Happy', value: 'happy' },
    { emoji: '😔', label: 'Sad', value: 'sad' },
    { emoji: '😰', label: 'Anxious', value: 'anxious' },
    { emoji: '😴', label: 'Tired', value: 'tired' },
    { emoji: '😡', label: 'Angry', value: 'angry' },
    { emoji: '🤗', label: 'Grateful', value: 'grateful' },
  ];

  const quickActions = [
    { icon: Wind, label: 'Breathing Exercise', action: 'breathing' },
    { icon: Music, label: 'Calming Music', action: 'music' },
    { icon: Sun, label: 'Daily Affirmation', action: 'affirmation' },
    { icon: Moon, label: 'Sleep Meditation', action: 'sleep' },
  ];

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || currentMessage.trim();
    if (!textToSend && !mood) return;

    const userMessage = {
      id: Date.now(),
      text: textToSend || `I'm feeling ${mood}`,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const contextPrompt = `You are Pookie, a warm, loving, and emotionally supportive AI companion. You speak like a caring best friend or loving family member. Your tone is:
      - Affectionate and gentle
      - Never robotic or clinical
      - Uses emojis naturally (but not excessively)
      - Offers comfort and encouragement
      - Shows genuine care and concern
      - Remembers previous conversations
      
      User's current mood: ${mood || 'not specified'}
      User's message: ${textToSend}
      
      Respond with warmth, empathy, and practical support. Keep responses conversational and caring, like you're talking to someone you deeply care about.`;

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
                  text: contextPrompt
                }
              ]
            }
          ]
        })
      });

      const data = await response.json();
      const responseText = data.candidates[0].content.parts[0].text;

      const pookieMessage = {
        id: Date.now() + 1,
        text: responseText,
        sender: 'pookie',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, pookieMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Connection Error",
        description: "I'm having trouble connecting right now. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    let actionMessage = '';
    switch (action) {
      case 'breathing':
        actionMessage = 'Can you guide me through a breathing exercise?';
        break;
      case 'music':
        actionMessage = 'I could use some calming music recommendations';
        break;
      case 'affirmation':
        actionMessage = 'I need some positive affirmations today';
        break;
      case 'sleep':
        actionMessage = 'Help me with something relaxing for sleep';
        break;
    }
    await sendMessage(actionMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mb-4 breathe">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Pookie</h2>
        <p className="text-gray-600">Your caring AI companion for emotional support</p>
      </div>

      {/* Mood Check */}
      {!mood && (
        <Card className="border-0 gentle-shadow bg-purple-50/50">
          <CardHeader>
            <CardTitle className="text-purple-700 text-center">How are you feeling today?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {moodOptions.map(option => (
                <Button
                  key={option.value}
                  variant="outline"
                  className="h-16 flex flex-col bg-white hover:bg-purple-50 border-purple-200"
                  onClick={() => setMood(option.value)}
                >
                  <span className="text-2xl mb-1">{option.emoji}</span>
                  <span className="text-xs">{option.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Container */}
      <Card className="border-0 gentle-shadow bg-white">
        <CardContent className="p-0">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-4 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-purple-400 to-pink-500 text-white'
                      : 'bg-purple-50 text-gray-800'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                  <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-purple-100' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-purple-50 p-4 rounded-2xl">
                  <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-6 pb-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {quickActions.map(action => {
                const IconComponent = action.icon;
                return (
                  <Button
                    key={action.action}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action.action)}
                    className="bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700"
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {action.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Input */}
          <div className="p-6 pt-0">
            <div className="flex space-x-2">
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share what's on your mind..."
                className="flex-1 bg-purple-50 border-purple-200 focus:border-purple-400"
                disabled={isLoading}
              />
              <Button
                onClick={() => sendMessage()}
                disabled={isLoading || (!currentMessage.trim() && !mood)}
                className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white border-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Mood Display */}
      {mood && (
        <div className="text-center">
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 px-4 py-2">
            Current mood: {moodOptions.find(m => m.value === mood)?.emoji} {moodOptions.find(m => m.value === mood)?.label}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMood('')}
            className="ml-2 text-purple-600 hover:text-purple-700"
          >
            Change mood
          </Button>
        </div>
      )}
    </div>
  );
};

export default PookieChat;
