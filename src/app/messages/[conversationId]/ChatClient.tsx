"use client";

import { useState, useEffect, useRef } from "react";

import { 
  sendMessage, 
  markAsRead, 
  editMessage, 
  deleteMessage, 
  toggleReaction, 
  togglePin, 
  searchMessages,
  handleMessageRequest,
  uploadMessageAttachments
} from "@/actions/messages";
import { 
  Image as ImageIcon, 
  Send, 
  Loader2, 
  Play, 
  Pause, 
  Download, 
  FileText, 
  FileArchive, 
  File, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  Pin, 
  Reply as ReplyIcon, 
  Smile, 
  X, 
  Mic, 
  ArrowDown, 
  Search, 
  FileAudio, 
  Volume2, 
  VolumeX, 
  Link2,
  FolderOpen,
  ArrowRight,
  UserCheck
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

// Emojis for Reactions
const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "😡", "👏", "🔥"];

const DoubleTick = ({ isSeen }: { isSeen: boolean }) => (
  <svg 
    viewBox="0 0 24 24" 
    width="15" 
    height="15" 
    className={`shrink-0 ${isSeen ? "text-sky-500" : "text-zinc-400 dark:text-zinc-500"}`}
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M18 6 7 17l-5-5" />
    <path d="m22 10-7.5 7.5L13 16" />
  </svg>
);


export default function ChatClient({
  conversation,
  initialMessages,
  currentUserId,
  otherUser,
}: {
  conversation: any;
  initialMessages: any[];
  currentUserId: string;
  otherUser: any;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [otherLastReadAt, setOtherLastReadAt] = useState<number>(() => {
    const p = conversation.members.find((m: any) => m.userId !== currentUserId);
    return p?.lastReadAt ? new Date(p.lastReadAt).getTime() : 0;
  });
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [otherLastSeen, setOtherLastSeen] = useState<string | null>(otherUser?.lastSeen);

  // Message Request Status
  const [myMembershipStatus, setMyMembershipStatus] = useState<string>(() => {
    const p = conversation.members.find((m: any) => m.userId === currentUserId);
    return p?.status || "ACCEPTED";
  });

  // UI Panels
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryTab, setGalleryTab] = useState<"IMAGES" | "VIDEOS" | "FILES" | "LINKS">("IMAGES");

  // Interaction states
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editInput, setEditInput] = useState("");
  const [replyToMessage, setReplyToMessage] = useState<any | null>(null);
  const [activeReactionPickerId, setActiveReactionPickerId] = useState<string | null>(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);

  // File Upload State
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [attachments, setAttachments] = useState<Array<{ file: File; preview: string; type: string }>>([]);

  // Voice Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingWaveform, setRecordingWaveform] = useState<number[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Ref objects
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);

  // Audio Playback State
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioSpeed, setAudioSpeed] = useState<number>(1);
  const [audioCurrentTime, setAudioCurrentTime] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-scroll on initial load or new messages
  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom("auto");
  }, []);

  // Monitor scrolling to show "scroll down" button
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    // Show button if user is scrolled up by more than 400px
    setShowScrollDown(scrollHeight - scrollTop - clientHeight > 400);
  };

  // Initial actions
  useEffect(() => {
    markAsRead(conversation.id);

    // Initial check for online status
    setIsOnline(otherUser?.id && (Date.now() - new Date(otherUser.lastSeen || 0).getTime() < 60000));
  }, [conversation.id, currentUserId, otherUser?.id, otherUser?.lastSeen]);

  // Typing event trigger
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  // Upload attachments
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments = Array.from(files).map((file) => {
      let type = "FILE";
      if (file.type.startsWith("image/")) type = "IMAGE";
      else if (file.type.startsWith("video/")) type = "VIDEO";

      return {
        file,
        preview: type === "IMAGE" ? URL.createObjectURL(file) : "",
        type,
      };
    });

    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  // Send Message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && attachments.length === 0) return;

    setIsSending(true);
    setUploadProgress(10); // Start progress bar mock

    try {
      let attachmentsData: any[] = [];

      if (attachments.length > 0) {
        setUploadProgress(30);
        const formData = new FormData();
        attachments.forEach((att) => formData.append("files", att.file));

        attachmentsData = await uploadMessageAttachments(formData);
        setUploadProgress(80);
      }

      const { message, recipientIds } = await sendMessage(
        conversation.id,
        input.trim() || null,
        attachmentsData,
        replyToMessage?.id || null,
        null // voiceMessage
      );

      setUploadProgress(100);



      setMessages((prev) => [...prev, message]);
      setInput("");
      setAttachments([]);
      setReplyToMessage(null);
      scrollToBottom();
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message.");
    } finally {
      setIsSending(false);
      setTimeout(() => setUploadProgress(null), 1000);
    }
  };

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files) return;

    const newAttachments = Array.from(files).map((file) => {
      let type = "FILE";
      if (file.type.startsWith("image/")) type = "IMAGE";
      else if (file.type.startsWith("video/")) type = "VIDEO";

      return {
        file,
        preview: type === "IMAGE" ? URL.createObjectURL(file) : "",
        type,
      };
    });

    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  // Clipboard Paste Handler (Screenshot paste)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            setAttachments((prev) => [
              ...prev,
              {
                file,
                preview: URL.createObjectURL(file),
                type: "IMAGE",
              },
            ]);
            toast.success("Image pasted from clipboard");
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);
  // Voice recording handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      let elapsedSeconds = 0;
      const localWaveform: number[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const actualMimeType = mediaRecorder.mimeType || "audio/webm";
        const ext = actualMimeType.includes("mp4") ? "mp4" : "webm";
        const audioBlob = new Blob(audioChunksRef.current, { type: actualMimeType });
        const audioFile = new (globalThis as any).File([audioBlob], `voice.${ext}`, { type: actualMimeType }) as File;

        setIsSending(true);
        try {
          const formData = new FormData();
          formData.append("files", audioFile);

          const attachmentsData = await uploadMessageAttachments(formData);
          if (attachmentsData.length > 0) {
            const voiceData = {
              url: attachmentsData[0].url,
              duration: elapsedSeconds || 1,
              waveform: localWaveform.length > 0 ? localWaveform : [10, 15, 12, 8, 16, 22, 14, 10, 18, 12, 14, 16, 8, 10, 15, 12, 8, 16, 22, 14, 10, 18, 12, 14, 16],
            };

            const { message, recipientIds } = await sendMessage(
              conversation.id,
              null,
              [],
              replyToMessage?.id || null,
              voiceData
            );


            setMessages((prev) => [...prev, message]);
            setReplyToMessage(null);
            scrollToBottom();
          }
        } catch (e) {
          toast.error("Failed to send voice message");
        } finally {
          setIsSending(false);
          setRecordingDuration(0);
          setRecordingWaveform([]);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Dynamic waveform visualizer & Duration timer
      recordingIntervalRef.current = setInterval(() => {
        elapsedSeconds += 1;
        setRecordingDuration(elapsedSeconds);
        // Simulate a nice clean waveform height
        const randomHeight = Math.floor(Math.random() * 20) + 5;
        localWaveform.push(randomHeight);
        setRecordingWaveform((prev) => [...prev, randomHeight].slice(-30));
      }, 1000);
    } catch (err) {
      toast.error("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.onstop = null; // Prevent sending
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
      setRecordingDuration(0);
      setRecordingWaveform([]);
      toast.info("Recording cancelled");
    }
  };
  // Message Request Handler Actions
  const handleRequestAction = async (action: "ACCEPT" | "IGNORE" | "BLOCK") => {
    try {
      await handleMessageRequest(conversation.id, action);
      if (action === "ACCEPT") {
        setMyMembershipStatus("ACCEPTED");
        toast.success("Request accepted!");
      } else {
        setMyMembershipStatus("IGNORED");
        toast.info("Conversation ignored.");
      }
    } catch (e) {
      toast.error("Failed to handle request.");
    }
  };

  // Editing logic
  const handleEditSubmit = async (messageId: string) => {
    if (!editInput.trim()) return;

    try {
      const updated = await editMessage(messageId, editInput.trim());

      setMessages((prev) => prev.map((m) => (m.id === messageId ? updated : m)));
      setEditingMessageId(null);
      toast.success("Message edited");
    } catch (e) {
      toast.error("Failed to edit message");
    }
  };

  // Deletion logic
  const handleDeleteMessage = async (messageId: string, type: "ME" | "EVERYONE") => {
    try {
      const res = await deleteMessage(messageId, type);


      if (res.isDeleted) {
        setMessages((prev) => 
          prev.map((m) => 
            m.id === messageId 
              ? { 
                  ...m, 
                  isDeleted: true, 
                  content: "This message was deleted.",
                  attachments: [],
                  voiceMessage: null
                } 
              : m
          )
        );
      } else {
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
      }
      toast.success("Message deleted");
    } catch (e: any) {
      toast.error(e.message || "Failed to delete message");
    }
  };

  // Reaction logic
  const handleAddReaction = async (messageId: string, emoji: string) => {
    try {
      const updatedReactions = await toggleReaction(messageId, emoji);

      setMessages((prev) => 
        prev.map((m) => 
          m.id === messageId ? { ...m, reactions: updatedReactions } : m
        )
      );
      setActiveReactionPickerId(null);
    } catch (e) {
      toast.error("Failed to add reaction");
    }
  };

  // Pin logic
  const handleTogglePin = async (messageId: string) => {
    try {
      const updated = await togglePin(messageId);

      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, isPinned: updated.isPinned, pinnedAt: updated.pinnedAt } : m))
      );
      toast.success(updated.isPinned ? "Message pinned" : "Message unpinned");
    } catch (e) {
      toast.error("Failed to pin message");
    }
  };

  // Search in conversation
  const executeSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const results = await searchMessages(conversation.id, searchQuery);
      setSearchResults(results);
    } catch (e) {
      toast.error("Failed to search messages");
    }
  };

  // Play audio voice message
  const playVoice = (id: string, url: string) => {
    if (playingAudioId === id) {
      audioRef.current?.pause();
      setPlayingAudioId(null);
      setAudioCurrentTime(0);
    } else {
      // Pause any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
      }

      // Create or update audio element
      const audio = audioRef.current || new Audio();
      audio.src = url;
      audioRef.current = audio;

      // Reset playback speed to current speed selection
      audio.playbackRate = audioSpeed;

      // Event handlers
      audio.onloadedmetadata = () => {
        setAudioDuration(audio.duration);
      };

      audio.ontimeupdate = () => {
        setAudioCurrentTime(audio.currentTime);
      };

      audio.onended = () => {
        setPlayingAudioId(null);
        setAudioCurrentTime(0);
      };

      // Handle loading states
      if (audio.readyState >= 1) {
        setAudioDuration(audio.duration);
      } else {
        setAudioDuration(0);
      }
      setAudioCurrentTime(0);

      // Play
      audio.play().catch((err) => {
        console.error("Audio playback failed", err);
      });
      setPlayingAudioId(id);
    }
  };

  const changeAudioSpeed = (speed: number) => {
    setAudioSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  // Generate unique visual waveform bars statically based on message ID
  const getStaticWaveform = (id: string) => {
    const bars = 25;
    const result = [];
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    for (let i = 0; i < bars; i++) {
      const val = Math.abs((hash >> (i % 4)) % 16) + 4;
      result.push(val);
    }
    return result;
  };

  const seekAudio = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, clickX / width));

    const duration = audioRef.current.duration || audioDuration || 0;
    if (duration > 0) {
      audioRef.current.currentTime = percentage * duration;
      setAudioCurrentTime(percentage * duration);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === Infinity) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const pinnedMessages = messages.filter((m) => m.isPinned);

  // Group messages by date to render date separators
  const messagesGroupedByDate = messages.reduce((acc: any[], msg) => {
    const dateStr = new Date(msg.createdAt).toDateString();
    if (acc.length === 0 || acc[acc.length - 1].date !== dateStr) {
      acc.push({ date: dateStr, msgs: [] });
    }
    acc[acc.length - 1].msgs.push(msg);
    return acc;
  }, []);

  return (
    <div 
      className="flex flex-row h-full relative w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Active Area */}
      <div className="flex flex-col flex-1 h-full relative min-w-0 border-r border-zinc-200 dark:border-zinc-800">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center font-bold text-indigo-600 flex-shrink-0 relative overflow-hidden">
              {otherUser?.profile?.avatarUrl ? (
                <img src={otherUser.profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover object-center" />
              ) : (
                otherUser?.profile?.username?.charAt(0).toUpperCase() || "?"
              )}
              {isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full"></div>
              )}
            </div>
            <div>
              <Link href={`/${otherUser?.profile?.username}`} className="font-bold text-zinc-900 dark:text-zinc-50 hover:underline flex items-center gap-1.5">
                {conversation.type === "GROUP" ? conversation.name : (otherUser?.profile?.displayName || otherUser?.profile?.username)}
              </Link>
              <p className="text-xs text-zinc-500">
                {isOnline ? (isIdle ? "Idle" : "Online") : otherLastSeen ? `Last seen: ${new Date(otherLastSeen).toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit" })}` : "Offline"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowSearch(!showSearch)} 
              className={`p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition ${showSearch ? 'text-indigo-600' : 'text-zinc-500'}`}
            >
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowGallery(!showGallery)}
              className={`p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition ${showGallery ? 'text-indigo-600' : 'text-zinc-500'}`}
            >
              <FolderOpen className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Pinned Messages Header Bar */}
        {pinnedMessages.length > 0 && (
          <div className="bg-indigo-50/70 dark:bg-indigo-950/20 px-6 py-2 border-b border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between text-xs text-indigo-700 dark:text-indigo-300">
            <div className="flex items-center gap-2 truncate">
              <Pin className="w-3.5 h-3.5 shrink-0 rotate-45" />
              <span className="font-semibold">Pinned:</span>
              <span className="truncate italic">
                {pinnedMessages[pinnedMessages.length - 1].content || "Media Attachment"}
              </span>
            </div>
            <button 
              onClick={() => {
                const pinId = pinnedMessages[pinnedMessages.length - 1].id;
                document.getElementById(`msg-${pinId}`)?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline shrink-0"
            >
              Jump to Pin
            </button>
          </div>
        )}

        {/* Message List */}
        <div 
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          {/* eslint-disable-next-line react-hooks/refs */}
          {messagesGroupedByDate.map((group) => (
            <div key={group.date} className="space-y-4">
              <div className="flex justify-center my-4">
                <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-400 bg-zinc-200/50 dark:bg-zinc-800/50 px-2.5 py-1 rounded-full">
                  {group.date}
                </span>
              </div>
              
              {group.msgs.map((msg: any, index: number) => {
                // Check if message was deleted for me
                let myDeletedList = [];
                if (msg.deletedForUsers) {
                  try {
                    myDeletedList = JSON.parse(msg.deletedForUsers);
                  } catch(e) {}
                }
                if (myDeletedList.includes(currentUserId)) return null;

                const isMe = msg.senderId === currentUserId;
                const showAvatar = !isMe && (index === 0 || group.msgs[index - 1]?.senderId !== msg.senderId);
                const isLastMyMessage = isMe && (index === group.msgs.length - 1);
                
                // Seen calculations
                const isSeen = !!(isMe && otherLastReadAt && (new Date(msg.createdAt).getTime() <= otherLastReadAt));
                const isDelivered = isMe && (isOnline || (otherLastSeen && new Date(otherLastSeen).getTime() > new Date(msg.createdAt).getTime()));

                return (
                  <div 
                    key={msg.id} 
                    id={`msg-${msg.id}`}
                    className={`flex gap-3 group relative ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    {!isMe && (
                      <div className="w-8 h-8 shrink-0">
                        {showAvatar && (
                          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center font-bold text-indigo-600 text-xs flex-shrink-0 overflow-hidden">
                            {msg.sender?.profile?.avatarUrl ? (
                              <img src={msg.sender.profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover object-center" />
                            ) : (
                              msg.sender?.profile?.username?.charAt(0).toUpperCase() || "?"
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className={`flex flex-col gap-1.5 max-w-[65%] relative ${isMe ? "items-end" : "items-start"}`}>
                      
                      {/* Quoted Message Reply Preview */}
                      {msg.replyToMessage && (
                        <div 
                          onClick={() => document.getElementById(`msg-${msg.replyToMessage.id}`)?.scrollIntoView({ behavior: "smooth" })}
                          className={`text-xs p-2.5 rounded-lg border cursor-pointer border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/60 max-w-full truncate ${isMe ? 'rounded-br-none border-r-4 border-r-indigo-500' : 'rounded-bl-none border-l-4 border-l-zinc-500'}`}
                        >
                          <p className="font-bold text-[10px] uppercase text-zinc-400">
                            Replying to {msg.replyToMessage.senderId === currentUserId ? "You" : (msg.replyToMessage.sender?.profile?.username || "user")}
                          </p>
                          <p className="truncate text-zinc-500 dark:text-zinc-400">
                            {msg.replyToMessage.isDeleted ? "This message was deleted." : (msg.replyToMessage.content || "Media / Voice attachment")}
                          </p>
                        </div>
                      )}

                      {/* File Attachments */}
                      {!msg.isDeleted && msg.attachments?.length > 0 && (
                        <div className="grid gap-2 max-w-full">
                          {msg.attachments.map((att: any) => {
                            if (att.type === "IMAGE") {
                              return (
                                <div 
                                  key={att.id} 
                                  onClick={() => setSelectedImagePreview(att.url)}
                                  className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 cursor-zoom-in group/img relative"
                                >
                                  <img src={att.url} alt="Attachment" className="max-h-64 object-cover w-full bg-zinc-100 dark:bg-zinc-900 rounded-xl" />
                                </div>
                              );
                            } else if (att.type === "VIDEO") {
                              return (
                                <video 
                                  key={att.id} 
                                  src={att.url} 
                                  controls 
                                  className="rounded-xl border border-zinc-200 dark:border-zinc-800 max-h-64 max-w-full bg-black"
                                />
                              );
                            } else {
                              return (
                                <div key={att.id} className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                                  {att.name?.endsWith(".zip") ? (
                                    <FileArchive className="w-8 h-8 text-yellow-600" />
                                  ) : (
                                    <FileText className="w-8 h-8 text-indigo-600" />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold truncate text-zinc-800 dark:text-zinc-200">{att.name || "Attachment"}</p>
                                    <p className="text-[10px] text-zinc-400">{(att.size ? `${(att.size / 1024).toFixed(1)} KB` : "")}</p>
                                  </div>
                                  <a href={att.url} download className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition text-zinc-500">
                                    <Download className="w-4 h-4" />
                                  </a>
                                </div>
                              );
                            }
                          })}
                        </div>
                      )}

                      {/* Voice Message rendering */}
                      {!msg.isDeleted && msg.voiceMessage && (() => {
                        const rawWaveform = msg.voiceMessage.waveform;
                        const parsedWaveform = Array.isArray(rawWaveform) 
                          ? rawWaveform 
                          : typeof rawWaveform === "string" 
                            ? (() => { try { return JSON.parse(rawWaveform); } catch { return null; } })()
                            : null;
                        const waveformBars = Array.isArray(parsedWaveform) && parsedWaveform.length > 0 
                          ? parsedWaveform 
                          : getStaticWaveform(msg.id);

                        return (
                          <div className={`flex items-center gap-3.5 p-3 rounded-2xl w-72 max-w-full select-none ${
                            isMe 
                              ? 'bg-indigo-600 text-white rounded-br-sm shadow-md shadow-indigo-600/10' 
                              : 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-bl-sm shadow-sm'
                          }`}>
                            {/* Play/Pause Button */}
                            <button 
                              onClick={() => playVoice(msg.id, msg.voiceMessage.url)}
                              className={`w-9 h-9 rounded-full flex items-center justify-center transition shrink-0 ${
                                isMe 
                                  ? 'bg-white text-indigo-600 hover:bg-zinc-100 active:scale-95' 
                                  : 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 active:scale-95'
                              }`}
                            >
                              {playingAudioId === msg.id ? (
                                <Pause className="w-4 h-4 fill-current animate-pulse" />
                              ) : (
                                <Play className="w-4 h-4 fill-current ml-0.5" />
                              )}
                            </button>
                            
                            {/* Waveform and Time Info Container */}
                            <div className="flex-1 flex flex-col gap-1 min-w-0">
                              {/* Interactive Waveform Wrapper */}
                              <div 
                                onClick={(e) => {
                                  if (playingAudioId === msg.id) {
                                    seekAudio(e);
                                  }
                                }}
                                className={`flex items-end gap-[2.5px] h-7 select-none py-1 ${
                                  playingAudioId === msg.id ? 'cursor-pointer group/wave' : 'cursor-default opacity-80'
                                }`}
                              >
                                {waveformBars.map((h, i) => {
                                  const barProgress = i / waveformBars.length;
                                  const currentProgress = playingAudioId === msg.id 
                                    ? audioCurrentTime / (audioDuration || msg.voiceMessage.duration || 1) 
                                    : 0;
                                  const isActive = barProgress <= currentProgress;
                                  
                                  return (
                                    <div 
                                      key={i} 
                                      className={`w-[2.5px] rounded-full transition-all duration-150 ${
                                        isActive 
                                          ? (isMe ? 'bg-white' : 'bg-indigo-600 dark:bg-indigo-400') 
                                          : (isMe ? 'bg-white/35' : 'bg-zinc-200 dark:bg-zinc-800')
                                      } ${playingAudioId === msg.id ? 'group-hover/wave:scale-y-110' : ''}`} 
                                      style={{ 
                                        height: `${Math.max(4, Math.min(24, h))}px`,
                                      }} 
                                    />
                                  );
                                })}
                              </div>

                              {/* Time / Label row */}
                              <div className="flex justify-between items-center text-[10px] font-medium opacity-85 select-none">
                                <span>
                                  {playingAudioId === msg.id 
                                    ? `${formatTime(audioCurrentTime)} / ${formatTime(audioDuration || msg.voiceMessage.duration)}`
                                    : formatTime(msg.voiceMessage.duration || 0)
                                  }
                                </span>
                                <span className="opacity-60 flex items-center gap-0.5">
                                  <span>🎙️ Voice</span>
                                </span>
                              </div>
                            </div>

                            {/* Playback Speed selector */}
                            <button 
                              onClick={() => changeAudioSpeed(audioSpeed === 1 ? 1.5 : audioSpeed === 1.5 ? 2 : 1)}
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border transition shrink-0 whitespace-nowrap active:scale-95 ${
                                isMe 
                                  ? 'border-white/40 text-white hover:bg-white/10' 
                                  : 'border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                              }`}
                            >
                              {audioSpeed}x
                            </button>
                          </div>
                        );
                      })()}

                      {/* Message Content Bubble */}
                      {msg.content && (
                        <div className="relative max-w-full">
                          {editingMessageId === msg.id ? (
                            <div className="flex gap-2 items-center min-w-[200px]">
                              <input 
                                type="text" 
                                value={editInput}
                                onChange={(e) => setEditInput(e.target.value)}
                                className="flex-1 px-3 py-1 text-sm bg-zinc-100 dark:bg-zinc-800 border-none outline-none rounded-lg text-zinc-900 dark:text-zinc-50"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleEditSubmit(msg.id);
                                  else if (e.key === "Escape") setEditingMessageId(null);
                                }}
                              />
                              <button onClick={() => handleEditSubmit(msg.id)} className="p-1 text-green-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
                                <ArrowRight className="w-4 h-4" />
                              </button>
                              <button onClick={() => setEditingMessageId(null)} className="p-1 text-red-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className={`px-4 py-2.5 text-sm leading-relaxed rounded-2xl break-words whitespace-pre-wrap select-text ${
                              msg.isDeleted
                                ? "italic bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-zinc-800 rounded-bl-sm"
                                : isMe 
                                  ? "bg-indigo-600 text-white rounded-br-sm shadow-sm" 
                                  : "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 rounded-bl-sm shadow-sm"
                            }`}>
                              {msg.content}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Emoji Reactions List Display */}
                      {msg.reactions && msg.reactions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1 bg-white dark:bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-sm text-xs select-none">
                          {Array.from(new Set(msg.reactions.map((r: any) => r.emoji))).map((emoji: any) => {
                            const count = msg.reactions.filter((r: any) => r.emoji === emoji).length;
                            return (
                              <button 
                                key={emoji} 
                                onClick={() => handleAddReaction(msg.id, emoji)}
                                className="flex items-center gap-1.5 hover:scale-105 transition"
                              >
                                <span>{emoji}</span>
                                <span className="font-bold text-zinc-500 text-[10px]">{count}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Time, Edited tag, Message Status Indicator */}
                      <div className="flex items-center gap-1.5 select-none shrink-0">
                        <span className="text-[10px] text-zinc-400">
                          {new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {msg.isEdited && (
                          <span className="text-[9px] text-zinc-400 italic font-semibold">(edited)</span>
                        )}
                        {isMe && (
                          <DoubleTick isSeen={isSeen} />
                        )}
                        {msg.isPinned && (
                          <Pin className="w-3 h-3 text-indigo-500 rotate-45 shrink-0" />
                        )}
                      </div>

                      {/* Message Actions Trigger Button & Inline Reactions bar (Hover triggers) */}
                      {!msg.isDeleted && (
                        <div className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition z-20 ${isMe ? 'left-0 -translate-x-full pr-2' : 'right-0 translate-x-full pl-2'}`}>
                          
                          {/* Mini Reaction Trigger */}
                          <div className="relative">
                            <button 
                              onClick={() => setActiveReactionPickerId(activeReactionPickerId === msg.id ? null : msg.id)}
                              className="p-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-900 transition text-zinc-400 hover:text-indigo-500"
                            >
                              <Smile className="w-3.5 h-3.5" />
                            </button>
                            
                            {activeReactionPickerId === msg.id && (
                              <div className="absolute bottom-full mb-1 flex items-center gap-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-1.5 rounded-full shadow-lg z-50">
                                {REACTION_EMOJIS.map((emoji) => (
                                  <button 
                                    key={emoji} 
                                    onClick={() => handleAddReaction(msg.id, emoji)}
                                    className="text-base hover:scale-125 transition"
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Quick Reply Button */}
                          <button 
                            onClick={() => setReplyToMessage(msg)}
                            className="p-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-900 transition text-zinc-400 hover:text-indigo-500"
                          >
                            <ReplyIcon className="w-3.5 h-3.5" />
                          </button>

                          {/* More Options Dropdown */}
                          <div className="relative">
                            <button 
                              onClick={() => setActiveMenuId(activeMenuId === msg.id ? null : msg.id)}
                              className="p-1.5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-900 transition text-zinc-400"
                            >
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>
                            
                            {activeMenuId === msg.id && (
                              <div className="absolute bottom-full right-0 mb-1 w-36 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg py-1 z-50 text-xs">
                                <button 
                                  onClick={() => handleTogglePin(msg.id)} 
                                  className="w-full text-left px-3 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-900 flex items-center gap-2 text-zinc-700 dark:text-zinc-300"
                                >
                                  <Pin className="w-3.5 h-3.5 rotate-45" /> {msg.isPinned ? "Unpin" : "Pin"}
                                </button>
                                {isMe && (
                                  <button 
                                    onClick={() => {
                                      setEditingMessageId(msg.id);
                                      setEditInput(msg.content || "");
                                      setActiveMenuId(null);
                                    }} 
                                    className="w-full text-left px-3 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-900 flex items-center gap-2 text-zinc-700 dark:text-zinc-300"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" /> Edit
                                  </button>
                                )}
                                <button 
                                  onClick={() => {
                                    handleDeleteMessage(msg.id, "ME");
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full text-left px-3 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-900 flex items-center gap-2 text-red-600"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Delete for Me
                                </button>
                                {isMe && (
                                  <button 
                                    onClick={() => {
                                      handleDeleteMessage(msg.id, "EVERYONE");
                                      setActiveMenuId(null);
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-900 flex items-center gap-2 text-red-600 font-bold"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" /> Delete for All
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          
          {isOtherUserTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center font-bold text-indigo-600 text-xs shrink-0">
                {otherUser?.profile?.username?.charAt(0).toUpperCase() || "?"}
              </div>
              <div className="px-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl rounded-bl-sm flex gap-1 items-center shadow-sm">
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Floating Scroll Down button */}
        {showScrollDown && (
          <button 
            onClick={() => scrollToBottom()}
            className="absolute bottom-24 right-6 p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full shadow-lg text-indigo-600 dark:text-indigo-400 hover:scale-105 transition z-30"
          >
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </button>
        )}

        {/* Message composer / Message Request Box */}
        <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 shrink-0">
          
          {myMembershipStatus === "PENDING" ? (
            <div className="flex flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-3">
              <div className="text-center">
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Accept message request from @{otherUser?.profile?.username}?
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  They won't know you've seen their messages until you accept.
                </p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleRequestAction("ACCEPT")}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Accept
                </button>
                <button 
                  onClick={() => handleRequestAction("IGNORE")}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-lg text-xs font-semibold transition"
                >
                  Ignore
                </button>
                <button 
                  onClick={() => handleRequestAction("BLOCK")}
                  className="px-4 py-2 bg-red-50/50 hover:bg-red-50 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-600 rounded-lg text-xs font-bold transition"
                >
                  Block
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              
              {/* Attachment Previews */}
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2.5 p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                  {attachments.map((att, i) => (
                    <div key={i} className="relative group shrink-0">
                      {att.type === "IMAGE" ? (
                        <img src={att.preview} alt="" className="w-16 h-16 object-cover rounded-lg border border-zinc-200 dark:border-zinc-700" />
                      ) : att.type === "VIDEO" ? (
                        <div className="w-16 h-16 bg-black flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700">
                          <Play className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/50 flex flex-col items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 p-1 text-center">
                          <FileText className="w-5 h-5 text-indigo-500" />
                          <span className="text-[8px] truncate max-w-full text-zinc-500">{att.file.name}</span>
                        </div>
                      )}
                      <button 
                        onClick={() => setAttachments((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute -top-1.5 -right-1.5 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Preview Bar */}
              {replyToMessage && (
                <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-950 border-l-4 border-l-indigo-600 border border-zinc-200 dark:border-zinc-800 rounded-r-lg">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      Replying to {replyToMessage.senderId === currentUserId ? "You" : `@${replyToMessage.sender?.profile?.username}`}
                    </p>
                    <p className="text-xs text-zinc-500 truncate mt-0.5">
                      {replyToMessage.content || "Media Attachment"}
                    </p>
                  </div>
                  <button onClick={() => setReplyToMessage(null)} className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition text-zinc-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Progress Bar Mock */}
              {uploadProgress !== null && (
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
              )}

              {/* Form Input Composer */}
              <form onSubmit={handleSend} className="flex items-end gap-3">
                <label className="p-3.5 text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200/50 dark:hover:bg-zinc-800 rounded-full cursor-pointer transition shrink-0">
                  <ImageIcon className="w-5 h-5" />
                  <input type="file" className="hidden" multiple onChange={handleFileChange} ref={fileInputRef} />
                </label>
                
                {isRecording ? (
                  <div className="flex-1 flex items-center justify-between bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-full px-5 py-2.5">
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping shrink-0" />
                      <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                        Recording voice... {recordingDuration}s
                      </span>
                      {/* Form Waveform simulation visual */}
                      <div className="flex items-end gap-[2px] h-4">
                        {recordingWaveform.map((h, idx) => (
                          <div key={idx} className="w-[1.5px] bg-red-500 rounded-full" style={{ height: `${h / 1.5}px` }} />
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        type="button" 
                        onClick={cancelRecording}
                        className="px-3 py-1 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-full text-xs font-semibold transition"
                      >
                        Cancel
                      </button>
                      <button 
                        type="button" 
                        onClick={stopRecording}
                        className="px-3.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-bold transition flex items-center gap-1"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={input}
                    onChange={handleTyping}
                    placeholder="Type a message..."
                    className="flex-1 bg-zinc-100 dark:bg-zinc-850 rounded-full px-5 py-3 text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-indigo-500/50 transition border border-transparent dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-900"
                  />
                )}

                {!isRecording && input.trim() === "" && attachments.length === 0 ? (
                  <button 
                    type="button" 
                    onClick={startRecording}
                    className="p-3.5 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full transition shrink-0"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                ) : (
                  !isRecording && (
                    <button 
                      type="submit"
                      disabled={isSending || (!input.trim() && attachments.length === 0)}
                      className="p-3.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shrink-0"
                    >
                      {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                  )
                )}
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Slideout Search Panel */}
      {showSearch && (
        <div className="w-[300px] h-full bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 flex flex-col z-30 shrink-0">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-50">Search Messages</h3>
            <button onClick={() => setShowSearch(false)} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition text-zinc-400">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex gap-2 shrink-0">
            <input 
              type="text" 
              placeholder="Search query..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded px-3 py-1.5 text-xs outline-none text-zinc-900 dark:text-zinc-50"
              onKeyDown={(e) => e.key === "Enter" && executeSearch()}
            />
            <button onClick={executeSearch} className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded">
              Find
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {searchResults.length === 0 ? (
              <p className="text-xs text-center text-zinc-500 py-8">No results found.</p>
            ) : (
              searchResults.map((res) => (
                <div 
                  key={res.id}
                  onClick={() => {
                    document.getElementById(`msg-${res.id}`)?.scrollIntoView({ behavior: "smooth" });
                    setShowSearch(false);
                  }}
                  className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-850 rounded-lg cursor-pointer hover:bg-indigo-50/30 dark:hover:bg-indigo-950/10 transition"
                >
                  <p className="font-bold text-[10px] text-zinc-500 mb-1">
                    @{res.sender?.profile?.username || "user"} • {new Date(res.createdAt).toLocaleDateString('en-US')}
                  </p>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 break-words">{res.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Slideout Shared Media Gallery Panel */}
      {showGallery && (
        <div className="w-[320px] h-full bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 flex flex-col z-30 shrink-0">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-50">Shared Gallery</h3>
            <button onClick={() => setShowGallery(false)} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition text-zinc-400">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Gallery Tabs */}
          <div className="flex border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-bold shrink-0">
            {["IMAGES", "VIDEOS", "FILES"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setGalleryTab(tab as any)}
                className={`flex-1 py-3 text-center border-b transition ${galleryTab === tab ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'text-zinc-500'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {galleryTab === "IMAGES" && (
              <div className="grid grid-cols-3 gap-2">
                {messages
                  .filter(m => !m.isDeleted)
                  .flatMap(m => m.attachments || [])
                  .filter(att => att.type === "IMAGE")
                  .map((att: any) => (
                    <div 
                      key={att.id} 
                      onClick={() => setSelectedImagePreview(att.url)}
                      className="aspect-square bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden cursor-zoom-in"
                    >
                      <img src={att.url} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
              </div>
            )}

            {galleryTab === "VIDEOS" && (
              <div className="space-y-3">
                {messages
                  .filter(m => !m.isDeleted)
                  .flatMap(m => m.attachments || [])
                  .filter(att => att.type === "VIDEO")
                  .map((att: any) => (
                    <video key={att.id} src={att.url} controls className="w-full rounded-lg bg-black border border-zinc-200 dark:border-zinc-800 max-h-36" />
                  ))}
              </div>
            )}

            {galleryTab === "FILES" && (
              <div className="space-y-2">
                {messages
                  .filter(m => !m.isDeleted)
                  .flatMap(m => m.attachments || [])
                  .filter(att => att.type === "FILE")
                  .map((att: any) => (
                    <div key={att.id} className="flex items-center gap-2 p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-lg text-xs truncate">
                      <File className="w-4 h-4 text-zinc-500 shrink-0" />
                      <span className="flex-1 truncate">{att.name || "Attachment"}</span>
                      <a href={att.url} download className="text-indigo-600 font-bold shrink-0">Get</a>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lightbox / Fullscreen Image Preview */}
      {selectedImagePreview && (
        <div 
          onClick={() => setSelectedImagePreview(null)}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[999] cursor-zoom-out"
        >
          <img src={selectedImagePreview} alt="" className="max-w-[90vw] max-h-[90vh] object-contain" />
          <button 
            onClick={() => setSelectedImagePreview(null)}
            className="absolute top-6 right-6 p-2 bg-white/10 text-white hover:bg-white/20 rounded-full transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}
