'use client';

import { useState, useEffect, useRef } from 'react';
import {
  getOpenCalls,
  createOrGetChatSession,
  getChatHistory,
  sendMessage,
  getUserChatSessions,
  processGoogleDriveFile
} from '../actions';
import { GoogleDrivePicker } from '@/components/google-drive-picker';
import { Heading } from '@/components/ui/heading';
import { Plus } from 'lucide-react';

interface ChatInterfaceProps {
  userId: string;
}

export function ChatInterface({ userId }: ChatInterfaceProps) {
  const [openCalls, setOpenCalls] = useState<{ id: string; title: string }[]>(
    []
  );
  const [selectedCallId, setSelectedCallId] = useState<string>('none');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<
    { id: string; title: string; updatedAt: string }[]
  >([]);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingDrive, setIsProcessingDrive] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch Open Calls
    getOpenCalls().then(setOpenCalls);
  }, []);

  // Fetch threads when Open Call changes (or general)
  useEffect(() => {
    if (!userId) return;
    getUserChatSessions(userId, selectedCallId).then(setSessions);
  }, [userId, selectedCallId]);

  const loadSession = async (sid: string) => {
    setSessionId(sid);
    const history = await getChatHistory(sid);
    setMessages(history);
  };

  const createNewSession = async () => {
    setMessages([]);
    setSessionId(null); // Clear current
    // Create new immediately
    const res = await createOrGetChatSession(userId, selectedCallId);
    if (res.success && res.sessionId) {
      setSessionId(res.sessionId);
      // Refresh list
      getUserChatSessions(userId, selectedCallId).then(setSessions);
    }
  };

  // Initial load logic:
  // If no session selected, try to load latest.
  useEffect(() => {
    if (!sessionId && sessions.length > 0) {
      // Auto-load most recent?
      // loadSession(sessions[0].id);
    }
  }, [sessions, sessionId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // If no session active, create one first
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      const res = await createOrGetChatSession(userId, selectedCallId);
      if (res.success && res.sessionId) {
        currentSessionId = res.sessionId;
        setSessionId(res.sessionId);
        getUserChatSessions(userId, selectedCallId).then(setSessions);
      } else {
        return;
      }
    }

    const userMsg = input;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const res = await sendMessage(currentSessionId!, userMsg);

    if (res.success && res.message) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: res.message }
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { role: 'system', content: 'Error: Failed to get response.' }
      ]);
    }
    setIsLoading(false);
  };

  const handleDriveSelect = async (
    fileId: string,
    accessToken: string,
    fileName: string
  ) => {
    setIsProcessingDrive(true);
    try {
      // Ensure session
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        const res = await createOrGetChatSession(userId, selectedCallId);
        if (res.success && res.sessionId) {
          currentSessionId = res.sessionId;
          setSessionId(res.sessionId);
          getUserChatSessions(userId, selectedCallId).then(setSessions);
        } else {
          setIsProcessingDrive(false);
          return;
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'system',
          content: `Importing context from Google Drive: ${fileName}...`
        }
      ]);

      const res = await processGoogleDriveFile(
        currentSessionId!,
        fileId,
        accessToken,
        fileName
      );

      if (res.success) {
        const history = await getChatHistory(currentSessionId!);
        setMessages(history);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'system', content: `Error importing file: ${res.error}` }
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessingDrive(false);
    }
  };

  return (
    <div className='flex h-[calc(100vh-200px)] overflow-hidden rounded-lg border bg-white shadow-sm'>
      {/* Sidebar */}
      <div className='flex w-1/4 flex-col border-r bg-gray-50'>
        <div className='border-b p-4'>
          <h3 className='mb-2 text-sm font-semibold text-gray-700'>Context</h3>
          <label className='mb-1 block text-xs text-gray-500'>
            Select Open Call
          </label>
          <select
            className='mb-4 w-full rounded-md border p-2 text-sm'
            value={selectedCallId}
            onChange={(e) => {
              setSelectedCallId(e.target.value);
              setSessionId(null); // Reset session view when context changes
              setMessages([]); // Clear chat
            }}
          >
            <option value='none'>-- General Draft --</option>
            {openCalls.map((call) => (
              <option key={call.id} value={call.id}>
                {call.title}
              </option>
            ))}
          </select>

          <div className='mb-4'>
            <GoogleDrivePicker
              onFileSelect={handleDriveSelect}
              isLoading={isProcessingDrive}
            />
          </div>

          <button
            onClick={createNewSession}
            className='flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700'
          >
            <Plus className='h-4 w-4' /> New Draft
          </button>
        </div>

        <div className='flex-1 overflow-y-auto p-4'>
          <h4 className='mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase'>
            History
          </h4>
          <div className='space-y-2'>
            {sessions.map((s) => (
              <div
                key={s.id}
                onClick={() => loadSession(s.id)}
                className={`cursor-pointer rounded-md border p-3 text-sm transition-colors ${
                  sessionId === s.id
                    ? 'border-blue-500 bg-white shadow-sm'
                    : 'border-transparent bg-transparent hover:bg-gray-100'
                }`}
              >
                <div className='truncate font-medium text-gray-800'>
                  {s.title}
                </div>
                <div className='mt-1 text-xs text-gray-400'>
                  {new Date(s.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
            {sessions.length === 0 && (
              <div className='py-4 text-center text-xs text-gray-400'>
                No drafts found.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className='flex flex-1 flex-col'>
        {selectedCallId !== 'none' && (
          <div className='border-b border-blue-100 bg-blue-50 px-4 py-2 text-xs text-blue-700'>
            Context:{' '}
            <strong>
              {openCalls.find((c) => c.id === selectedCallId)?.title}
            </strong>
          </div>
        )}

        {/* Messages */}
        <div className='flex-1 space-y-4 overflow-y-auto p-4' ref={scrollRef}>
          {messages.length === 0 && (
            <div className='mt-10 text-center text-gray-400'>
              <p>Start chatting to draft your proposal.</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 text-sm whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : msg.role === 'system'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className='flex justify-start'>
              <div className='rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-500 italic'>
                Thinking...
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className='border-t bg-white p-4'>
          <div className='flex gap-2'>
            <input
              className='flex-1 rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none'
              placeholder='Type a message...'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading}
            />
            <button
              className={`rounded-md px-4 py-2 text-sm font-medium text-white ${
                isLoading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
              }`}
              onClick={handleSend}
              disabled={isLoading}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
