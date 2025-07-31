import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff, Play, Square } from "lucide-react";
import { useState } from "react";

const VoiceTranscription = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState("");

  const handleStartRecording = () => {
    setIsRecording(true);
    setTranscription("");
    // TODO: Implement actual voice recording functionality
    console.log("Starting voice recording...");
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsProcessing(true);

    // Simulate processing and transcription
    setTimeout(() => {
      setIsProcessing(false);
      setTranscription(
        "I need to check the status of container MSKU7845123 that's traveling from Los Angeles to Shanghai. Can you provide me with the latest tracking information and estimated delivery date?",
      );
    }, 2000);
  };

  const handleProcessTranscription = () => {
    // TODO: Process the transcription with Janus AI
    console.log("Processing transcription:", transcription);
  };

  return (
    <div className="p-6 h-full">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Voice Transcription
          </h2>
          <p className="text-slate-600">
            Speak your freight operations questions and get AI-powered responses
          </p>
        </div>

        {/* Recording Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mic className="w-5 h-5" />
              <span>Voice Input</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <div
                className={`w-32 h-32 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                  isRecording
                    ? "border-red-500 bg-red-50 animate-pulse"
                    : "border-slate-300 bg-slate-50"
                }`}
              >
                {isRecording ? (
                  <MicOff className="w-12 h-12 text-red-500" />
                ) : (
                  <Mic className="w-12 h-12 text-slate-500" />
                )}
              </div>
            </div>

            <div className="text-center space-y-4">
              {isRecording && (
                <p className="text-red-600 font-medium animate-pulse">
                  Recording... Speak your question
                </p>
              )}

              {isProcessing && (
                <p className="text-blue-600 font-medium">
                  Processing your voice input...
                </p>
              )}

              <div className="flex justify-center space-x-2">
                {!isRecording ? (
                  <Button onClick={handleStartRecording} className="space-x-2">
                    <Play className="w-4 h-4" />
                    <span>Start Recording</span>
                  </Button>
                ) : (
                  <Button
                    onClick={handleStopRecording}
                    variant="destructive"
                    className="space-x-2"
                  >
                    <Square className="w-4 h-4" />
                    <span>Stop Recording</span>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transcription Results */}
        {transcription && (
          <Card>
            <CardHeader>
              <CardTitle>Transcription Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-slate-800">{transcription}</p>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleProcessTranscription}>
                  Process with Janus AI
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              How to Use Voice Transcription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Click "Start Recording" to begin voice input</li>
              <li>• Speak clearly about your freight operations question</li>
              <li>• Click "Stop Recording" when finished</li>
              <li>• Review the transcription and process with Janus AI</li>
              <li>• Best results with quiet environment and clear speech</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VoiceTranscription;
