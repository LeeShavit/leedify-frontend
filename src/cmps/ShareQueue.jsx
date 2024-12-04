import React, { useState, useEffect } from 'react';
import { Share2, Check, X, Music } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function ShareQueue(){
  const [isConnected, setIsConnected] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [joinRequest, setJoinRequest] = useState(null);
  

  useEffect(() => {
    // Simulate WebSocket connection
    const connectWebSocket = () => {
      // In real implementation, connect to your WebSocket server
      setIsConnected(true)
      setSessionId(Math.random().toString(36).substring(7))
      setQueue(sampleQueue)
    }

    connectWebSocket()
  }, [])

  function generateShareLink(){
    const baseUrl = window.location.origin
    return `${baseUrl}/join-queue/${sessionId}`
  }

  async function handleShare(){
    const shareLink = generateShareLink()
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join My Music Queue',
          text: 'Listen to music together!',
          url: shareLink
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      // Fallback to copy to clipboard
      navigator.clipboard.writeText(shareLink);
      setShowShareDialog(true);
      setTimeout(() => setShowShareDialog(false), 3000);
    }
  };

  const handleJoinRequest = (accept) => {
    if (accept) {
      // In real implementation, send acceptance via WebSocket
      setJoinRequest(null);
      // Add new user to the session
    } else {
      setJoinRequest(null);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4">
      {/* Connection Status */}
      <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
        <span className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <Share2 size={16} />
          Share Queue
        </button>
      </div>

      {/* Share Dialog */}
      {showShareDialog && (
        <Alert>
          <AlertTitle>Link Copied!</AlertTitle>
          <AlertDescription>
            Share this link with your friend to join the queue
          </AlertDescription>
        </Alert>
      )}

      {/* Join Request */}
      {joinRequest && (
        <div className="flex items-center justify-between bg-yellow-100 p-3 rounded-lg">
          <span>"{joinRequest.name}" wants to join your queue</span>
          <div className="flex gap-2">
            <button
              onClick={() => handleJoinRequest(true)}
              className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
            >
              <Check size={16} />
            </button>
            <button
              onClick={() => handleJoinRequest(false)}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
